import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const deleteMemberReviewAuthTest = () => {
	describe('DELETE /v1/admins/members/review-auth/:review_auth_id', () => {
		const request = agent(app);
		let reviewAuthId = null;
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
			reviewAuthId = 19981;
		});

		test('should return invalid status if review_auth_id is not number', (done) => {
			reviewAuthId = 'isNotNumber';
			request
				.delete(`/v1/admins/members/review-auth/${reviewAuthId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if review_auth_id is not exist', (done) => {
			reviewAuthId = 999999;
			request
				.delete(`/v1/admins/members/review-auth/${reviewAuthId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success delete member review auth', (done) => {
			request
				.delete(`/v1/admins/members/review-auth/${reviewAuthId}`)
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

export default deleteMemberReviewAuthTest;
