import { agent } from 'supertest';
import app from '../../../../app';

import * as reviewCheck from '../../../check/review';

import * as common from '../../../component/common';

const getChoiceAnswersTest = () => {
	// 리뷰 선택형 답변 목록 조회
	describe('GET /v1/admins/reviews/:review_answer_id/question-choice-answer', () => {
		const request = agent(app);
		let reviewAnswerId = null;
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
			reviewAnswerId = 3;
		});

		test('should return invalid status if reviewanswerid is not number', (done) => {
			reviewAnswerId = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/${reviewAnswerId}/question-choice-answer`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if reviewanswerid is null', (done) => {
			reviewAnswerId = null;
			request
				.get(`/v1/admins/reviews/${reviewAnswerId}/question-choice-answer`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if reviewanswerid is not exist', (done) => {
			reviewAnswerId = 9999999;
			request
				.get(`/v1/admins/reviews/${reviewAnswerId}/question-choice-answer`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review answer data if success get review answer list', (done) => {
			request
				.get(`/v1/admins/reviews/${reviewAnswerId}/question-choice-answer`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const answerList = res.body.review_answer_choice;

					for (let i = 0; i < answerList.length; i += 1) reviewCheck.checkReviewQuestionChoice(answerList[i]);

					return done();
				});
		});
	});
};

export default getChoiceAnswersTest;
