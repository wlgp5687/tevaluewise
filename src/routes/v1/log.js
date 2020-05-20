import express from 'express';
import { wrapAsyncRouter } from '../../services';
// import * as logService from '../../services/auth/jwt';

const router = express.Router();

// JWT 토큰 발급
router.post(
	'/page-move',
	wrapAsyncRouter(async (req, res) => {
		return res.json(req);
	})
);

export default router;
