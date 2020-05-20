import axios from 'axios';
import apicache from 'apicache';
import redis from 'redis';

export const api = (path) => `${process.env.SERVER_URL}/v1${path}`;

export const fetchToken = async () => {
	try {
		const { data } = await axios.get(api(`/auth/jwt/token`));
		return data.token;
	} catch (err) {
		return null;
	}
};

export const fetchApi = async (path, token, params = {}) => {
	const { data } = await axios.get(api(path), { params: { ...params, _t: Date.now() }, headers: { 'x-access-token': token } });
	return data;
};

const cacheWithRedis = apicache.options({
	redisClient: redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }),
	appendKey: (req, res) => {
		if (process.env.SERVER_URL === 'https://api.starteacher.co.kr') return '';
		const referer = req.headers.referer || '';
		return referer.replace(/^http(s*)\:\/\//i, '').replace(/\/\S*$/, '');
	}
}).middleware;

const successCache = (req, res) => res.statusCode === 200;

export const cache = (duration, options) => (req, res, next) => {
	const cookieHeader = res.getHeader('set-cookie');
	if (Array.isArray(cookieHeader)) {
		res.setHeader(
			'set-cookie',
			cookieHeader.filter((header) => !header.startsWith('_csrf'))
		);
	}
	return cacheWithRedis(duration, successCache, options)(req, res, next);
};

export const clearCache = (target) => apicache.clear(target);
