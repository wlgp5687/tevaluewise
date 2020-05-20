import { getModel, sequelize, Op } from '../../database';

const Cafe = getModel('Cafe');
const CafeVideo = getModel('CafeVideo');
const CafeTutor = getModel('CafeTutor');
const CafePost = getModel('CafePost');
const CafeBoardConfig = getModel('CafeBoardConfig');
const TutorRequestAuthCafe = getModel('TutorRequestAuthCafe');

/**
 * @description 강사 카페 생성 여부 조회
 * @param {Int} tutorId
 */
export const isExistCafeTutorByTutorId = async (tutorId) => ((await CafeTutor.count({ where: { tutor_id: tutorId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

/**
 * @description 강사 인덱스로 강사 카페 개설 요청 여부 조회
 * @param {Int} tutorId
 */
export const isExistTutorRequestAuthCafeByTutorId = async (tutorId) => ((await TutorRequestAuthCafe.count({ where: { tutor_id: tutorId, is_confirm: 'REQUEST' } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

/**
 * @description 카페 게시판 설정 인덱스 존재 여부 확인
 * @param {int} cafeBoardConfigId
 */
export const isExistCafeBoardConfigId = async (cafeBoardConfigId) => ((await CafeBoardConfig.count({ where: { id: cafeBoardConfigId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// cafeId 존재 여부 조회
export const isExistCafeId = async (cafeId) => ((await Cafe.count({ where: { id: cafeId } })) > 0 ? true : false);

// cafevideoId 존재 여부 조회
export const isExistCafeVideoId = async (cafeVideoId) => ((await CafeVideo.count({ where: { id: cafeVideoId } })) > 0 ? true : false);

/**
 * @description 카페 게시판 설정 인덱스와 카페 인덱스 유효성 여부 확인
 * @param {Int} cafeBoardConfigId
 * @param {Int} cafeId
 */
export const isValidCafeBoardConfigIdAndCafeId = async (cafeBoardConfigId, cafeId) => ((await CafeBoardConfig.count({ where: { id: cafeBoardConfigId, cafe_id: cafeId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// cafeId로 카페 조회
export const getCafeById = async (cafeId) => {
	const response = await Cafe.findOne({ where: { id: cafeId } });
	return response;
};

/**
 * @description CafeId 로 강사 ID 조회
 * @param {Int} cafeId
 */
export const getTutorIdByCafeId = async (cafeId) => {
	const cafeTutor = await CafeTutor.findOne({ where: { id: cafeId } });
	return cafeTutor.tutor_id;
};

/**
 * @description 카페 영상 조회
 * @param {Array} cafeVideo
 * @param {String} isDefault
 * @param {Int} offset
 * @param {Int} limit
 */
export const getCafeVideos = async (cafeVideo, offset, limit) => {
	let response = null;
	const sql = { where: { cafe_id: cafeVideo.cafe_id, is_deleted: 'N' } };

	// Total
	const total = await CafeVideo.count(sql);
	if (total && total > 0) {
		sql.attributes = ['id', 'title', 'video_url', 'cafe_id', 'sort_no', 'is_default', 'is_deleted', 'created_at'];
		sql.order = [
			['is_default', 'ASC'],
			['sort_no', 'ASC'],
			['id', 'DESC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 카페 영상 정보 조회
		const cafevideo = await CafeVideo.findAll(sql);
		if (Object.keys(cafevideo).length > 0) response = { total, list: cafevideo };
	}
	// Return
	return response;
};

/**
 * @description 카페 조회수 증가
 * @param {Array} cafe
 * @param {Transaction} t
 */
export const updateCafeVisitCount = async (cafe, t) => {
	const response = await Cafe.update({ visit_count: sequelize.literal(`visit_count + 1`) }, { where: { id: cafe.id }, transaction: t });
	return response;
};

/**
 * @description 카페 인덱스로 카페 게시판 목록 조회
 * @param {Int} cafeId
 */
export const getCafeBoardConfigs = async (cafeId) => {
	let response = null;
	const sql = { where: { cafe_id: cafeId, is_deleted: 'N' } };

	// Total
	const total = await CafeBoardConfig.count(sql);
	if (total && total > 0) {
		sql.attributes = ['id', 'cafe_id', 'board_config_id', 'name'];
		sql.order = [['id', 'ASC']];

		const cafeBoardConfig = await CafeBoardConfig.findAll(sql);
		if (Object.keys(cafeBoardConfig).length > 0) response = { cafe_board_config: cafeBoardConfig };
	}
	return response;
};

/**
 * @description 카페 게시판 설정 수정
 * @param {Array} cafeBoardConfig
 * @param {Transaction} t
 */
export const updateCafeBoardConfig = async (cafeBoardConfig, t) => {
	const response = await CafeBoardConfig.update({ name: cafeBoardConfig.name }, { where: { id: cafeBoardConfig.id }, transaction: t });
	return response;
};

/**
 * @description 게시물 인덱스로 카페 인덱스 조회
 * @param {Int} postId
 */
export const getCafeIdBypostId = async (postId) => {
	const cafePost = await CafePost.findOne({ attributes: ['cafe_id'], where: { board_posts_id: postId } });
	return cafePost.cafe_id;
};
