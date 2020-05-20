import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchQuestionYearAnswerTest = () => {
	// 리뷰 년도 답변 수정
	describe('PATCH /v1/admins/reviews/:review_answer_year_id/question-year-answer', () => {
		// eslint-disable-next-line
		const request = agent(app);
		let setData = null;
		let reviewAnswerYearId = null;
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
			reviewAnswerYearId = 123423;
			sendData = {
				answer: 2020,
			};
		});

		test('should return invalid status if review_answer_year_id is not number', (done) => {
			reviewAnswerYearId = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerYearId}/question-year-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_year_id is not exist', (done) => {
			reviewAnswerYearId = 99999999;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerYearId}/question-year-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_year_id is null', (done) => {
			reviewAnswerYearId = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerYearId}/question-year-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if year_answer is not number', (done) => {
			sendData.answer = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerYearId}/question-year-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if year_answer is null', (done) => {
			sendData.answer = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerYearId}/question-year-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return review answer data if success get review answer', (done) => {
			request
				.patch(`/v1/admins/reviews/${reviewAnswerYearId}/question-year-answer`)
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

export default patchQuestionYearAnswerTest;
