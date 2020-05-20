import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const deleteMemberReviewAuthsTest = () => {
	describe('DELETE /v1/admins/members/review-auth/:review_auth_id', () => {
		const request = agent(app);
		let memberId = null;
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
			memberId = 6075;
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.delete(`/v1/admins/members/${memberId}/review-auth-all`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.delete(`/v1/admins/members/${memberId}/review-auth-all`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.delete(`/v1/admins/members/${memberId}/review-auth-all`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success delete all member review auth', (done) => {
			request
				.delete(`/v1/admins/members/${memberId}/review-auth-all`)
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

export default deleteMemberReviewAuthsTest;
