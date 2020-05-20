import express from 'express';
import { wrapAsyncRouter } from '../../services';

import * as bannerService from '../../services/banner/banner';
import * as bannerValidator from '../../validators/banner';
import * as commonComponent from '../../component/common';
import { cache } from '../../services/cache';

const router = express.Router();

// 배너 아이템 조회
router.get(
	'/items',
	...bannerValidator.getBannerItems,
	wrapAsyncRouter(async (req, res) => {
		const filterId = req.query.filter_id;
		const pageCode = req.query.page_code;
		const positionCode = req.query.position_code;

		const bannerItems = await bannerService.getBannerItems(filterId, pageCode, positionCode);

		return res.json(bannerItems);
	}),
);

// 배너 코드 List 조회
router.get(
	'/codes',
	...bannerValidator.getBannerCodeList,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		const codeList = await bannerService.getBannerCodeList(offset, limit);
		return res.json(!codeList ? null : { ...codeList, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 배너 조회
router.get(
	'/',
	...bannerValidator.getBanners,
	cache('1 days'),
	wrapAsyncRouter(async (req, res) => {
		const banners = {
			banner_page: req.query.banner_page ? req.query.banner_page : null,
			position: req.query.position ? req.query.position : null,
			target: req.query.target ? req.query.target : null,
			filter_id: req.query.filter_id ? req.query.filter_id : null,
			tutor_id: req.query.tutor_id ? req.query.tutor_id : null,
			institute_id: req.query.institute_id ? req.query.institute_id : null,
		};

		const response = await bannerService.getBanners(banners);
		req.apicacheGroup = `banner-${banners.banner_page}-${banners.position}-${banners.target}`;

		// Return
		return res.json(!response ? null : response);
	}),
);

export default router;
