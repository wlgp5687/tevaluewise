import { sequelize } from '../database';

export const handleNotFound = (req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	return next(error);
};

export const handleRender = (err, req, res, next) => {
	if (err.code === 'EBADCSRFTOKEN') err.status = 403;
	if (!err.status) err.status = 500;
	return res.status(err.status).send(err.message);
};

export const handleUncaught = exitCode => async err => {
	console.error(err);
	await sequelize.close();
	return process.exit(exitCode);
};
