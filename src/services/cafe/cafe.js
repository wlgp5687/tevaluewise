import { sequelize } from '../../database';

import * as memberService from '../member/member';
import * as tutorService from '../tutor/tutor';
import * as instituteService from '../institute/institute';
import * as cafeComponent from '../../component/cafe/cafe';
import * as boardComponent from '../../component/board/board';

// 카페 인덱스 존재여부 확인
export const isExistCafeId = async (cafeId) => {
	const response = await cafeComponent.isExistCafeId(cafeId);
	return response;
};

/**
 * @description 강사 카페 개설 여부 확인
 * @param {Int} tutorId
 */
export const isExistCafeTutorByTutorId = async (tutorId) => {
	const response = await cafeComponent.isExistCafeTutorByTutorId(tutorId);
	return response;
};

/**
 * @description 강사 인덱스로 강사 카페 개설 요청 여부 조회
 * @param {Int} tutorId
 */
export const isExistTutorRequestAuthCafeByTutorId = async (tutorId) => {
	const response = await cafeComponent.isExistTutorRequestAuthCafeByTutorId(tutorId);
	return response;
};

// 카페 영상 인덱스 존재여부 확인
export const isExistCafeVideoId = async (cafeVideoId) => {
	const response = await cafeComponent.isExistCafeVideoId(cafeVideoId);
	return response;
};

/** @description 카페 게시판 설정 인덱스 존재 여부 확인 */
export const isExistCafeBoardConfigId = async (cafeBoardConfigId) => {
	const response = await cafeComponent.isExistCafeBoardConfigId(cafeBoardConfigId);
	return response;
};

/** @description 카페 게시판 설정 인덱스와 카페 인덱스 유효성 여부 확인 */
export const isValidCafeBoardConfigIdAndCafeId = async (cafeBoardConfigId, cafeId) => {
	const response = await cafeComponent.isValidCafeBoardConfigIdAndCafeId(cafeBoardConfigId, cafeId);
	return response;
};

/**
 * @description 카페 영상 조회
 * @param {Araay} cafeVideo
 * @param {Int} memberId
 * @param {Int} offset
 * @param {Int} limit
 */
export const getCafeVideos = async (cafeVideo, memberId, offset = 0, limit = 5) => {
	const response = await cafeComponent.getCafeVideos(cafeVideo, offset, limit);

	return response;
};

/**
 * @description 강사 인덱스로 강사 카페 게시판 목록 조회
 * @param {Int} tutorId
 */
export const getCafeBoardConfigByTutorId = async (tutorId) => {
	let response = null;
	const cafeTutor = await tutorService.getCafeIdByTutorId(tutorId);
	if (cafeTutor) response = await cafeComponent.getCafeBoardConfigs(cafeTutor.dataValues.cafe_id);
	return response;
};

/**
 * @description 카페 최신게시글 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getCafeGeneralBoardPosts = async (searchFields, offset = 0, limit = 15) => {
	const posts = await boardComponent.getGeneralBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	return posts;
};

/**
 * @description 카페 게시판 설정 수정
 * @param {Array} cafeBoardConfig
 */
export const updateCafeBoardConfig = async (cafeBoardConfig) => {
	await sequelize.transaction(async (t) => {
		await cafeComponent.updateCafeBoardConfig(cafeBoardConfig, t);
	});
	return null;
};
