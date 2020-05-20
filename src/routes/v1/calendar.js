import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as calendarService from '../../services/calendar/calendar';
import { cache } from '../../services/cache';
import * as calendarValidator from '../../validators/calendar';
import * as commonComponenet from '../../component/common';

const router = express.Router();

// 일자 및 필터에 맞는 일정 조회
router.get(
	'/',
	...calendarValidator.getCalendars,
	cache('1 day'), // 개발 완료 후 테스트까지 마무리 됐을 때 적용
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponenet.getOffset(page, limit);

		const calendar = { start_date: req.query.start_date, end_date: req.query.end_date, filter_id: req.query.filter_id, is_deleted: 'N' };

		const calendars = await calendarService.getCalendars(calendar, offset, limit);
		return res.json(!calendars ? null : { ...calendars, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/**
 * @description 이재익이 작성한게 아님
 */
router.get(
	'/:lv1_id',
	cache('1 day'),
	wrapAsyncRouter(async (req, res) => {
		const response = null;
		// const { start_date } = req.query;
		// const { end_date } = req.query;

		// response = await calendarService.getCalenderItems(req.params.lv1_id, start_date, end_date);

		// req.apicacheGroup = 'calendar-' + req.params.lv1_id; // clearCache on update

		return res.json(response);
	}),
);

export default router;
