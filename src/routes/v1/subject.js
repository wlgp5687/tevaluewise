import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as subjectService from '../../services/subject/subject';
import * as subjectValidator from '../../validators/subject';
import * as commonComponent from '../../component/common';
import { cache } from '../../services/cache';

const router = express.Router();

// 검색 조건에 따른 과목 목록 조회(light version)
router.get(
	'/list',
	...subjectValidator.getSubjectList,
	cache('7 days'),
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const instituteId = req.query.institute_id;
		const filterId = req.query.filter_id;
		let response = null;

		/**
		 * DESC : 기관 인덱스 & 필터 인덱스를 통한 과목 목록 조회
		 * INPUT : instituteId, filterId
		 * SEARCH : null
		 */
		if (instituteId && filterId) response = await subjectService.getSubjectByInstituteIdAndFilterId(instituteId, filterId, offset, limit);

		/**
		 * DESC : 기관 인덱스를 통한 과목 목록 조회 (단일)
		 * INPUT : instituteId
		 * SEARCH : null
		 */
		if (instituteId && !filterId) response = await subjectService.getSubjectByInstituteId(instituteId, offset, limit);

		/**
		 * DESC : 필터 인덱스를 통한 과목 목록 조회 (단일)
		 * INPUT : filterId
		 * SEARCH : null
		 */
		if (!instituteId && filterId) response = await subjectService.getSubjectByFilterId(filterId, null, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// id 가 일치하는 과목 조회
router.get(
	'/:subject_id',
	...subjectValidator.getSubject,
	cache('7 days'),
	wrapAsyncRouter(async (req, res) => {
		const subject = await subjectService.getSubjectById(req.params.subject_id);

		// Return
		return res.json(subject);
	}),
);

export default router;
