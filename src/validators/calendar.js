import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 일정 조회
export const getCalendars = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.isNumeric(),
	check('start_date')
		.exists({ checkFalsy: true })
		.toString()
		.not()
		.isEmpty()
		.custom(validation.isValidCalendarDate)
		.custom(validation.isValidPrevDateBigger),
	check('end_date')
		.exists({ checkFalsy: true })
		.toString()
		.not()
		.isEmpty()
		.custom(validation.isValidCalendarDate),
	check('filter_id')
		.exists({ checkFalsy: true })
		.isNumeric()
		.not()
		.isEmpty()
		.custom(validation.isSiteFilter)
]);
