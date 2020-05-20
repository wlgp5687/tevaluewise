import { agent } from 'supertest';
import app from '../../../../app';
import * as reviewCheck from '../../../check/review';

import * as common from '../../../component/common';

const postReviewComment = () => {
	// 리뷰 댓글 등록
	describe('POST /v1/admins/reviews/:review_id/comment', () => {
		const request = agent(app);
		let setData = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});
		// eslint-disable-next-line
		let sendData = null;

		beforeEach(() => {
			sendData = {
				institute_id: 3,
				tutor_id: 1,
				parent_id: 1,
				title: '제목제목',
				content: '내용내용내용',
				is_anonymous: 'N',
			};
		});

		test('should return invalid status if institute_id is not number', (done) => {
			sendData.institute_id = 'invalid';
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is invalid', (done) => {
			sendData.institute_id = 999999999;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is empty', (done) => {
			delete sendData.institute_id;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			sendData.tutor_id = 'invalid';
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is invalid', (done) => {
			sendData.tutor_id = 999999999;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is empty', (done) => {
			delete sendData.tutor_id;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(200, done);
		});

		test('should return invalid status if parent_id is not number', (done) => {
			sendData.parent_id = 'invalid';
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if parent_id is invalid', (done) => {
			sendData.parent_id = 999999;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if parent_id is empty', (done) => {
			delete sendData.parent_id;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(200, done);
		});

		test('should return invalid status if title is empty', (done) => {
			delete sendData.title;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if content is empty', (done) => {
			delete sendData.content;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_anonymous is empty', (done) => {
			delete sendData.is_anonymous;
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return reviewcomment data if success create reviewcomment', (done) => {
			request
				.post(`/v1/admins/reviews/1/comment`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewComment = res.body.review_comment;
					reviewCheck.checkReviewComment(reviewComment);

					return done();
				});
		});
	});
};

export default postReviewComment;
