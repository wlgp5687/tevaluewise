export const wrapAsyncRouter = routerFn => (req, res, next) => routerFn(req, res, next).catch(next);

export const throwError = (message, status) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};
