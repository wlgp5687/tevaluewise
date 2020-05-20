import * as validation from './validation';
import { check } from 'express-validator/check';
import { validate } from '.';

// 강사 등록
export const postRegisterTutor = validate([]);

// 강사 목록 조회
export const getTutors = validate([]);

// 강사 id 로 강사 조회
export const getTutorById = validate([]);

// 강사 일치 여부 조회
export const getMatchTutor = validate([]);

// 검색 조건에 따른 강사 목록 조회(light version)
export const getTutorList = validate([]);

// 내가 팔로우한 강사 목록 조회
export const getFollowTutor = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.isNumeric()
		.toInt(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.isNumeric()
		.toInt(),
	check('institute_name')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('tutor_name')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('order')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
]);

// 전달받은 기관의 본점에 소속된 강사 조회
export const getTutorByMainInstitute = validate([]);

/** @description 강사 카페 개설 요청 */
export const postNormalinessTutorRequestAuthCafe = validate([
	check('tutor_id')
		.custom(validation.isExistTutorId)
		.custom(validation.isValidRequestTutorCafeAuth)
		.isNumeric()
		.toInt()
		.not()
		.isEmpty(),
]);

/** @description 강사 인덱스로 메이저 조회 */
export const getMajorByTutorId = validate([
	check('tutor_id')
		.exists({ checkFalsy: true })
		.isNumeric()
		.toInt()
		.custom(validation.isExistTutorId)
		.not()
		.isEmpty(),
]);
