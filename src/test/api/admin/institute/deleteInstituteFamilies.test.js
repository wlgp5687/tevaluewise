import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const deleteInstituteFamilies = () => {
	describe('DELETE /v1/admins/institutes/:institute_id/parent_institute', () => {
		const request = agent(app);
		let instituteId = null;
		let setData = null;

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
		});

		test('should return invalid status if instituteId is null', (done) => {
			instituteId = null;
			request
				.delete(`/v1/admins/institutes/${instituteId}/parent_institute`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is not number', (done) => {
			instituteId = 'notnumber';
			request
				.delete(`/v1/admins/institutes/${instituteId}/parent_institute`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is invalid', (done) => {
			instituteId = 99999999;
			request
				.delete(`/v1/admins/institutes/${instituteId}/parent_institute`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success delete institute parent_institute', (done) => {
			request
				.delete(`/v1/admins/institutes/${instituteId}/parent_institute`)
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

export default deleteInstituteFamilies;
