import { agent } from 'supertest';
import app from '../../../../app';
import * as reviewCheck from '../../../check/review';
import * as regionCheck from '../../../check/region';

import * as common from '../../../component/common';

const getQuestionAnswersTest = () => {
	// 리뷰 질문 및 답변 조회
	describe('GET /v1/admins/reviews/:review_id/question-answer', () => {
		const request = agent(app);
		let setData = null;
		let reviewId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			reviewId = 1;
		});

		test('should return invalid status if review_id is not number', (done) => {
			reviewId = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/${reviewId}/question-answer`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if review_id is not exist', (done) => {
			reviewId = 9999999;
			request
				.get(`/v1/admins/reviews/${reviewId}/question-answer`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if review_id is null', (done) => {
			reviewId = null;
			request
				.get(`/v1/admins/reviews/${reviewId}/question-answer`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review answer data if success get review answer', (done) => {
			request
				.get(`/v1/admins/reviews/${reviewId}/question-answer`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const review = res.body.review_question_and_answer;

					// 리뷰 검사
					reviewCheck.checkReview(review);

					// 질문 및 답변 검사
					const { question } = review;

					for (let i = 0; i < question.length; i += 1) {
						reviewCheck.checkReviewQuestion(question[i]);
						if (question[i].review_question) for (let j = 0; j < question[i].review_question; j += 1) reviewCheck.checkReviewQuestionFilter(question[i].review_question[j]);

						if (question[i].answer_type === 'choice') {
							expect(typeof question[i].answer.id).toEqual('number');
							reviewCheck.checkTextChoiceAnswer(question[i].answer.review_question_choice);
						} else if (question[i].answer_type === 'text') reviewCheck.checkTextChoiceAnswer(question[i].answer);
						else if (question[i].answer_type === 'point' || question[i].answer_type === 'year') reviewCheck.checkPointYearAnswer(question[i].answer);
						else if (question[i].answer_type === 'region') regionCheck.checkRegion(question[i].answer);
					}

					return done();
				});
		});
	});
};

export default getQuestionAnswersTest;
