import request from 'supertest';
import app from '../../app';
import { setAuth } from '../../../test/util';

describe('ROUTER /v1/auth', function() {
	const agent = request.agent(app);
	const ctx = {};

	describe('GET /v1/auth/jwt/token', function() {
		it('should return jwt token', async function() {
			const { body } = await agent.get('/v1/auth/jwt/token').expect(200);
			should(body).have.keys('token');
			ctx.token = body.token;
		});
	});

	describe('GET /v1/auth/jwt/refresh-token', function() {
		it('should return invalid status without auth header', async function() {
			const { body } = await agent.get('/v1/auth/jwt/refresh-token').expect(400);
		});

		it('should return invalid status without auth header', async function() {
			const { body } = await setAuth(ctx.token + 'invalid')(agent.get('/v1/auth/jwt/refresh-token')).expect(500);
		});

		it('should return refreshed token', async function() {
			const { body } = await setAuth(ctx.token)(agent.get('/v1/auth/jwt/refresh-token')).expect(200);
			should(body).have.keys('token');
			ctx.token = body.token;
		});
	});

	describe('GET /v1/auth/jwt/check-token', function() {
		it('should return invalid status without auth header', async function() {
			const { body } = await agent.get('/v1/auth/jwt/check-token').expect(400);
		});

		it('should return invalid status without auth header', async function() {
			const { body } = await setAuth(ctx.token + 'invalid')(agent.get('/v1/auth/jwt/check-token')).expect(500);
		});

		it('should return checked token', async function() {
			const { body } = await setAuth(ctx.token)(agent.get('/v1/auth/jwt/check-token')).expect(200);
			should(body).have.keys('token');
			ctx.token = body.token;
		});
	});
});
