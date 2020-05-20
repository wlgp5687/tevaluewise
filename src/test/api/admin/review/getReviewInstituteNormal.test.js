import { agent } from 'supertest';
import app from '../../../../app';
// import * as reviewCheck from './check/review';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';
import * as boardCheck from '../../../check/board';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';
import * as regionCheck from '../../../check/region';

import * as common from '../../../component/common';

// 기관 리뷰 목록 조회
const getReviewInstituteNormalTest = () => {
	// 기관 리뷰 상세 조회
	describe('GET /v1/admins/reviews/:review_id/type/institute/normal', () => {
		const request = agent(app);
		let reviewId = null;
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
			reviewId = 42305;
		});

		test('should return Invalid status if review_id is not exist', (done) => {
			reviewId = 9999999;
			request
				.get(`/v1/admins/reviews/9999999/type/institute/normal`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if review_id is not number', (done) => {
			reviewId = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/normal`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if review_id is null', (done) => {
			reviewId = null;
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/normal`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review data if success get review', (done) => {
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/normal`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					// 리뷰 검사
					const { review } = res.body;
					reviewCheck.checkReview(review);
					boardCheck.checkOppositionRecommendCount(review.count);
					expect(typeof review.comment_count).toEqual('number');

					// 회원 검사
					const { member } = review;
					memberCheck.checkMember(member);
					memberCheck.checkMemberAttribute(member.attribute);
					memberCheck.checkMemberExternals(member.external);

					// 기관 검사
					const instituteReview = review.institute_review;
					const { institute } = instituteReview;
					reviewCheck.checkInstituteReview(instituteReview);
					instituteCheck.checkInstitute(institute);
					instituteCheck.checkInstituteAttribute(institute.attribute);

					// 필터 검사
					filterCheck.checkFilter(instituteReview.filter);

					// 과목 검사
					subjectCheck.checkSubject(instituteReview.subject);

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

export default getReviewInstituteNormalTest;
