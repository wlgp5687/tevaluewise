import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';

import * as common from '../../../component/common';

const postMemberReviewAuthTest = () => {
	describe('POST /v1/admins/members/:member_id/review-auth', () => {
		const request = agent(app);
		let memberId = null;
		let sendData = null;
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
			sendData = {
				comment: '열람 권한을 임의로 부여합니다.',
				later_expire_date: 7,
			};
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.post(`/v1/admins/members/${memberId}/review-auth`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.post(`/v1/admins/members/${memberId}/review-auth`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if later_expire_date is not number', (done) => {
			sendData.later_expire_date = 'isNotNumber';
			request
				.post(`/v1/admins/members/${memberId}/review-auth`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if later_expire_date is null', (done) => {
			sendData.later_expire_date = null;
			request
				.post(`/v1/admins/members/${memberId}/review-auth`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return member review auth if success post member review auth', (done) => {
			request
				.post(`/v1/admins/members/${memberId}/review-auth`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewAuth = res.body.review_auth;

					memberCheck.checkMemberReviewAuth(reviewAuth);
					return done();
				});
		});

		test('should return member review auth if only later_expire_date success post member review auth', (done) => {
			request
				.post(`/v1/admins/members/${memberId}/review-auth`)
				.set(setData)
				.send({ later_expire_date: sendData.later_expire_date })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewAuth = res.body.review_auth;

					memberCheck.checkMemberReviewAuth(reviewAuth);
					return done();
				});
		});
	});
};

export default postMemberReviewAuthTest;
