import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchInstituteMajor = () => {
	describe('Patch /v1/admins/institutes/major/:institute_id/filter/:filter_id', () => {
		const request = agent(app);
		let setData = null;
		let instituteId = null;
		let filterId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			instituteId = 1;
			filterId = 2;
		});

		test('should return invalid status if institute_id is not number', (done) => {
			instituteId = 'notnumber';
			request
				.patch(`/v1/admins/institutes/major/${instituteId}/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is invalid', (done) => {
			instituteId = 99999999;
			request
				.patch(`/v1/admins/institutes/major/${instituteId}/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is not number', (done) => {
			filterId = 'notnumber';
			request
				.patch(`/v1/admins/institutes/major/${instituteId}/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is invalid', (done) => {
			filterId = 99999999;
			request
				.patch(`/v1/admins/institutes/major/${instituteId}/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return response data if success patch institute major', (done) => {
			request
				.patch(`/v1/admins/institutes/major/${instituteId}/filter/${filterId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});
	});
};

export default patchInstituteMajor;
