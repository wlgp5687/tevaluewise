import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchQuestionTextAnswerTest = () => {
	// 리뷰 정성 답변 수정
	describe('Patch /v1/admins/reviews/:review_answer_text_id/question-text-answer', () => {
		const request = agent(app);
		let setData = null;
		let reviewAnswerTextId = null;
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
			reviewAnswerTextId = 5;
			sendData = {
				answer: '실험용 답변',
			};
		});

		test('should return invalid status if review_answer_text_id is not number', (done) => {
			reviewAnswerTextId = 'isNotNumber';
			request
				.patch(`/v1/admins/reviews/${reviewAnswerTextId}/question-text-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_text_id is not exist', (done) => {
			reviewAnswerTextId = 9999999;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerTextId}/question-text-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if review_answer_text_id is null', (done) => {
			reviewAnswerTextId = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerTextId}/question-text-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if answer_text is null', (done) => {
			sendData.answer = null;
			request
				.patch(`/v1/admins/reviews/${reviewAnswerTextId}/question-text-answer`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return review answer data if success get review answer', (done) => {
			request
				.patch(`/v1/admins/reviews/${reviewAnswerTextId}/question-text-answer`)
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

export default patchQuestionTextAnswerTest;
