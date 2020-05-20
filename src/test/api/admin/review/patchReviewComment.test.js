import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchReviewComment = () => {
	describe('PATCH /v1/admins/reviews/comment/:review_comment_id', () => {
		const request = agent(app);
		let setData = null;
		let reviewCommentId = null;
		let sendData = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			reviewCommentId = 1;
			sendData = {
				title: 'title1111',
				content: 'content1111',
			};
		});

		test('should return invalid status if reviewCommentId is not number', (done) => {
			request
				.patch(`/v1/admins/reviews/comment/not number`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if reviewCommentId is invalid', (done) => {
			reviewCommentId = 999999;
			request
				.patch(`/v1/admins/reviews/comment/${reviewCommentId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if title is empty', (done) => {
			delete sendData.title;
			request
				.patch(`/v1/admins/reviews/comment/${reviewCommentId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if content is empty', (done) => {
			delete sendData.content;
			request
				.patch(`/v1/admins/reviews/comment/${reviewCommentId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return null if success patch reviewcomment', (done) => {
			request
				.patch(`/v1/admins/reviews/comment/${reviewCommentId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});
	});
};

export default patchReviewComment;
