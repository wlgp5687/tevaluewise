import { validationResult } from 'express-validator/check';
import { throwError } from '../services';

const verify = (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return throwError(errors.array()[0].msg, 500);
		return next();
	} catch (err) {
		return next(err);
	}
};

export const validate = validations => [validations, verify];
