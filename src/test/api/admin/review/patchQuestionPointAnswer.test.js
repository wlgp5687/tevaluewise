import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchQuestionPointAnswerTest = () => {
	// 리뷰 정량 답변 수정
	describe('Patch /v1/admins/reviews/:review_answer_point_id/question-point-answer', () => {
		const request = agent(app);
		let setData = null;
		let reviewAnswerPointId = null;
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
			reviewAnswerPointId = 18;
			sendData = {
				answer: 5,
			};
		});

		test('should return invalid status if review_answer_point_id is not number', (done) => {
			reviewAnswerPointId = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_point_id is not exist', (done) => {
			reviewAnswerPointId = 9999999;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_point_id is null', (done) => {
			reviewAnswerPointId = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer_point greater than 10', (done) => {
			sendData.answer = 11;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer_point less than 1', (done) => {
			sendData.answer = 0;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer_point is not number', (done) => {
			sendData.answer = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer_point is null', (done) => {
			sendData.answer = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return review answer data if success get review answer', (done) => {
			request
				.patch(`/v1/admins/reviews/${reviewAnswerPointId}/question-point-answer`)
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

export default patchQuestionPointAnswerTest;
