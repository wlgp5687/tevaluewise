import * as jwtService from '../../../services/auth/jwt';

// 토큰 발급
export const getGenerateToken = async (req, res) => {
	// 기존 Token 이 존재하는 경우 token 획득
	const token = req.headers['x-access-token'] || req.query.token;

	// 토큰 생성
	const response = await jwtService.generateToken(token);
	return res.json({ response });
};

// 토큰 갱신
export const getRefreshToken = async (req, res) => {
	// 기존 Token 이 존재하는 경우 token 획득
	const token = req.headers['x-access-token'] || req.query.token;

	// 토큰 갱신
	const response = await jwtService.refreshToken(token);
	return res.json({ response });
};

// 토큰 체크
export const getIsValidToken = async (req, res) => {
	// 기존 Token 이 존재하는 경우 token 획득
	const token = req.headers['x-access-token'] || req.query.token;

	const decodedToken = await jwtService.decodeToken(token);

	return res.json({
		token: token,
		decoded_token: decodedToken
	});
};
