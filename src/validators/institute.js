import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 기관 등록
export const postRegisterInstitute = validate([]);

// 검색 조건으로 기관 목록 가져오기
export const getInstitutes = validate([
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
	check('name_ko')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('name_en')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('campus')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('type')
		.optional()
		.not()
		.isEmpty()
		.custom(validation.isValidInstituteType),
	check('has_online')
		.optional()
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('has_review')
		.optional()
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('message')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('site_url')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('address')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
	check('phone')
		.optional()
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('subject_id')
		.optional()
		.custom(validation.isExistSubjectId)
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('filter_id')
		.optional()
		.custom(validation.isSiteFilter)
		.exists({ checkFalsy: true })
		.isNumeric(),
]);

// 기관 Id 로 기관 조회
export const getInstituteById = validate([
	check('institute_id')
		.custom(validation.isExistInstituteId)
		.isNumeric()
		.not()
		.isEmpty(),
	check('filter_id')
		.optional()
		.custom(validation.isSiteFilter)
		.exists({ checkFalsy: true })
		.isNumeric(),
]);

// 캠퍼스 목록 조회
export const getInstituteCampus = validate([
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
	check('filter_id')
		.custom(validation.isSiteFilter)
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('institute_id')
		.custom(validation.isExistInstituteId)
		.isNumeric()
		.not()
		.isEmpty(),
]);

// 하위 기관 존재 여부 조회
export const getExistenceInstituteSubFamilies = validate([
	check('institute_id')
		.custom(validation.isExistInstituteId)
		.isNumeric()
		.not()
		.isEmpty(),
]);

// 상위 기관 존재 여부 조회
export const getExistenceInstituteHighFamilies = validate([
	check('institute_id')
		.custom(validation.isExistInstituteId)
		.isNumeric()
		.not()
		.isEmpty(),
]);

// 검색 조건에 따른 기관 목록 조회(light version)
export const getInstituteList = validate([
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
	check('filter_id')
		.optional()
		.custom(validation.isSiteFilter)
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('subject_id')
		.optional()
		.custom(validation.isExistSubjectId)
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('tutor_id')
		.optional()
		.custom(validation.isExistTutorId)
		.isNumeric()
		.not()
		.isEmpty(),
	check('institute_name')
		.optional()
		.exists({ checkFalsy: true })
		.toString(),
]);

// 내가 팔로우한 기관 목록 조회
export const getFollowInstitute = validate([]);

// 인근 유치원 조회
export const getPeripheryKindergarten = validate([
	check('institute_id')
		.custom(validation.isExistInstituteId)
		.isNumeric()
		.not()
		.isEmpty(),
]);
