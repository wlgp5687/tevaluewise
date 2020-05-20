import { check } from 'express-validator/check';
import * as validation from './validation';
import { validate } from '.';

/** @description 고객센터 문의 */
export const postCustomerServiceValidator = validate([
	check('tutor_id')
		.optional()
		.custom(validation.isExistTutorId)
		.isNumeric()
		.toInt()
		.not()
		.isEmpty(),
	check('institute_id')
		.optional()
		.custom(validation.isExistInstituteId)
		.isNumeric()
		.toInt()
		.not()
		.isEmpty(),
	check('filter_id')
		.optional()
		.exists({ checkFalsy: true })
		.isNumeric()
		.not()
		.isEmpty()
		.custom(validation.isSiteFilter),
	check('type')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty()
		.custom(validation.isValidCustomerServiceType),
	check('name')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty(),
	check('nickname')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty(),
	check('email')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.isEmail()
		.not()
		.isEmpty(),
	check('phone')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty(),
	check('title')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty(),
	check('contents')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty(),
	check('url')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.not()
		.isEmpty(),
]);
