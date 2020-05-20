import express from 'express';
import v1 from './v1/router';
import { wrapAsyncRouter } from '../services';
import { sequelize } from '../database';

const router = express.Router();

router.get(
	'/status',
	wrapAsyncRouter(async (req, res) => {
		await sequelize.authenticate();
		return res.send('OK');
	})
);

router.use('/v1', v1);

export default router;
