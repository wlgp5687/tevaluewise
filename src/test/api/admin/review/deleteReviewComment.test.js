import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const deleteReviewCommentTest = () => {
	describe('DELETE /v1/admins/reviews/:review_id/comment', () => {
		const request = agent(app);
		let setData = null;
		let reviewId = 43514;
		let reviewCommentId = 1;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		test('should return invalid status if reviewCommentid not number', (done) => {
			reviewCommentId = 'not number';
			request
				.delete(`/v1/admins/reviews/comment/${reviewCommentId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if reviewCommentid is invalid', (done) => {
			reviewCommentId = 8898999;
			request
				.delete(`/v1/admins/reviews/comment/${reviewCommentId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review comments data if success get review comments list', (done) => {
			reviewCommentId = 1;
			request
				.delete(encodeURI(`/v1/admins/reviews/comment/${reviewCommentId}`))
				.set(setData)
				.expect(200, done);
		});
	});
};

export default deleteReviewCommentTest;
