import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as cafeService from '../../services/cafe/cafe';
import * as cafeValidator from '../../validators/cafe';
import * as commonComponent from '../../component/common';

const router = express.Router();

/** @description 카페 영상 조회 */
router.get(
	'/:cafe_id/video',
	...cafeValidator.getCafeVideos,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const cafeVideo = { cafe_id: req.params.cafe_id, is_deleted: 'N' };

		const cafevideos = await cafeService.getCafeVideos(cafeVideo, memberId, offset, limit);
		return res.json(!cafevideos ? null : { ...cafevideos, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description 강사 인덱스로 강사 카페 게시판 목록 조회 */
router.get(
	'/tutor/:tutor_id/cafe-board-config',
	...cafeValidator.getCafeBoardConfigByTutorId,
	wrapAsyncRouter(async (req, res) => {
		const cafeBoardConfig = await cafeService.getCafeBoardConfigByTutorId(req.params.tutor_id);
		return res.json(!cafeBoardConfig ? null : cafeBoardConfig);
	}),
);

/** @description 강사 인덱스로 강사 카페 개설 요청 여부 조회 */
router.get(
	'/tutor/:tutor_id/request/existence',
	...cafeValidator.getExistenceTutorRequestAuthCafe,
	wrapAsyncRouter(async (req, res) => {
		const existence = await cafeService.isExistTutorRequestAuthCafeByTutorId(req.params.tutor_id);
		return res.json({ existence });
	}),
);

/** @description 카페 최신게시글 목록 조회 */
router.get(
	'/:cafe_id/generalposts',
	...cafeValidator.getCafeGeneralPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : 15;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = { board_post: { is_deleted: 'N', is_notice: 'N' } };

		// post_filter
		const postFilter = {};
		if (req.query.lv1_id) postFilter.lv1_id = req.query.lv1_id;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		// cafe
		const cafe = {};
		if (req.params.cafe_id) cafe.cafe_id = req.params.cafe_id;
		if (Object.keys(cafe).length > 0) searchFields.cafe = cafe;

		const common = {};
		common.order = 'newest';
		if (Object.keys(common).length > 0) searchFields.common = common;

		const posts = await cafeService.getCafeGeneralBoardPosts(searchFields, offset, limit);

		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description 카페 게시판 설정 수정 */
router.patch(
	'/board-config/:cafe_board_config_id',
	...cafeValidator.patchCafeBoardConfig,
	wrapAsyncRouter(async (req, res) => {
		await cafeService.updateCafeBoardConfig({ id: req.params.cafe_board_config_id, name: req.body.name });
		return res.json(null);
	}),
);

export default router;
