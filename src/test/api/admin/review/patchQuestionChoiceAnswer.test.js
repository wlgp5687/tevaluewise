import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchQuestionChoiceAnswerTest = () => {
	// 리뷰 선택형 답변 수정
	describe('PATCH /v1/admins/reviews/:review_answer_choice_id/question-choice-answer', () => {
		const request = agent(app);
		let setData = null;
		let reviewAnswerChoiceId = null;
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
			reviewAnswerChoiceId = 12203;
			sendData = {
				answer: 71,
			};
		});

		test('should return invalid status if review_answer_choice_id is not number', (done) => {
			reviewAnswerChoiceId = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_choice_id is null', (done) => {
			reviewAnswerChoiceId = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_choice_id is not exist', (done) => {
			reviewAnswerChoiceId = 9999999;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer is not number', (done) => {
			sendData.answer = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer is null', (done) => {
			sendData.answer = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer is not exist', (done) => {
			sendData.answer = 4;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return null if success get review question choice answer', (done) => {
			request
				.patch(`/v1/admins/reviews/${reviewAnswerChoiceId}/question-choice-answer`)
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

export default patchQuestionChoiceAnswerTest;
