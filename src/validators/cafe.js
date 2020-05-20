import { check, oneOf } from 'express-validator/check';
import * as validation from './validation';
import { validate } from '.';

/** @description 카페 영상 조회 */
export const getCafeVideos = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('cafe_id')
		.custom(validation.isExistCafeId)
		.isNumeric()
		.toInt()
		.not()
		.isEmpty(),
]);

/** @description 강사 인덱스로 강사 카페 게시판 목록 조회 */
export const getCafeBoardConfigByTutorId = validate([
	check('tutor_id')
		.custom(validation.isExistTutorId)
		.isNumeric()
		.toInt()
		.not()
		.isEmpty(),
]);

/** @description 강사 인덱스로 강사 카페 개설 요청 여부 조회 */
export const getExistenceTutorRequestAuthCafe = validate([
	check('tutor_id')
		.custom(validation.isExistTutorId)
		.isNumeric()
		.toInt()
		.not()
		.isEmpty(),
]);

/** @description 카페 최신게시글 조회 */
export const getCafeGeneralPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
	check('cafe_id')
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
]);

/** @description 카페 게시판 설정 수정  */
export const patchCafeBoardConfig = validate([
	check('cafe_board_config_id')
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeBoardConfigId)
		.custom(validation.isValidCafeBoardConfigAuth)
		.not()
		.isEmpty(),
	check('name')
		.optional()
		.isLength({ min: 2, max: 10 })
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
]);
