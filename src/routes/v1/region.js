import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as regionService from '../../services/region/region';
import * as regionValidator from '../../validators/region';
import * as commonComponent from '../../component/common';
import { cache } from '../../services/cache';

const router = express.Router();

// 하위 지역 조회
router.get(
	'/sub-region',
	...regionValidator.getSubRegion,
	cache('7 days'),
	wrapAsyncRouter(async (req, res) => {
		const { id } = req.query;
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		const regions = await regionService.getSubRegions(id, offset, limit);

		// Return
		return res.json(!regions ? null : { ...regions, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 인덱스 기준 지역 전체 조회
router.get(
	'/:region_id/full-info',
	...regionValidator.getFullRegionInfoById,
	cache('7 days'),
	wrapAsyncRouter(async (req, res) => {
		const regionId = req.params.region_id;
		const region = await regionService.getFullRegionInfoById(regionId);
		// Return
		return res.json(region);
	}),
);

// 지역 조회
router.get(
	'/:region_id',
	...regionValidator.getRegionById,
	cache('7 days'),
	wrapAsyncRouter(async (req, res) => {
		const regionId = req.params.region_id;
		const region = await regionService.getRegionById(regionId);
		// Return
		return res.json(region);
	}),
);

export default router;
