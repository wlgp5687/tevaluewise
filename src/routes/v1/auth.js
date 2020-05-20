import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as jwtService from '../../services/auth/jwt';

const router = express.Router();

// JWT 토큰 발급
router.get(
	'/jwt/token',
	wrapAsyncRouter(async (req, res) => {
		// 기존 Token 이 존재하는 경우 token 획득
		const token = jwtService.getJwtToken(req);
		const csrf = req.csrfToken();

		// 토큰 생성
		const response = await jwtService.generateToken(token, csrf);
		return res.json(response);
	}),
);

// JWT 토큰 갱신
router.get(
	'/jwt/refresh-token',
	wrapAsyncRouter(async (req, res) => {
		// 기존 Token 이 존재하는 경우 token 획득
		const token = jwtService.getJwtToken(req);
		const csrf = req.csrfToken();

		// 토큰 갱신
		const response = await jwtService.refreshToken(csrf, token);
		return res.json(response);
	}),
);

// JWT 토큰 체크
router.get(
	'/jwt/check-token',
	wrapAsyncRouter(async (req, res) => {
		// 기존 Token 이 존재하는 경우 token 획득
		const token = jwtService.getJwtToken(req);
		const decodedToken = await jwtService.decodeToken(token);

		return res.json({ token, decoded_token: decodedToken });
	}),
);

export default router;
