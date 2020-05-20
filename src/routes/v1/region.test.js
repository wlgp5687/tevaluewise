import request from 'supertest';
import app from '../../app';
import { setAuth } from '../../../test/util';

describe('ROUTER /v1/auth', function() {
	const agent = request.agent(app);
	const ctx = {};

	before(async function() {
		const { body } = await agent.get('/v1/auth/jwt/token').expect(200);
		should(body).have.keys('token');
		ctx.token = body.token;
	});

	describe('GET /v1/regions/sub-region', function() {
		it('should return provinces (root regions) without id', async function() {
			const { body } = await setAuth(ctx.token)(agent.get('/v1/regions/sub-region')).expect(200);
			should(body).have.keys('total', 'list');
			should(body.list.length).be.above(0);
			ctx.provinceId = body.list[0].id;
		});

		it('should return cities with provinceId', async function() {
			const { body } = await setAuth(ctx.token)(agent.get(`/v1/regions/sub-region?id=${ctx.provinceId}`)).expect(200);
			should(body).have.keys('total', 'list');
			should(body.list.length).be.above(0);
			ctx.cityId = body.list[0].id;
		});

		it('should return towns with cityId', async function() {
			const { body } = await setAuth(ctx.token)(agent.get(`/v1/regions/sub-region?id=${ctx.cityId}`)).expect(200);
			should(body).have.keys('total', 'list');
			should(body.list.length).be.above(0);
		});
	});
});
