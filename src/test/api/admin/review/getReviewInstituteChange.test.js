import { agent } from 'supertest';
import app from '../../../../app';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';
import * as boardCheck from '../../../check/board';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';
import * as regionCheck from '../../../check/region';

import * as common from '../../../component/common';

const getReviewInstituteChangeTest = () => {
	// 기관 환승 리뷰 상세 조회
	describe('GET /v1/admins/reviews/:review_id/type/institute/change', () => {
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
			reviewId = 98734;
		});

		test('should return Invalid status if review_id is not exist', (done) => {
			reviewId = 9999999;
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/change`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if review_id not number', (done) => {
			reviewId = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/change`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if review_id is null', (done) => {
			reviewId = null;
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/change`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review data if success get review', (done) => {
			request
				.get(`/v1/admins/reviews/${reviewId}/type/institute/change`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					// 리뷰 검사
					const { review } = res.body;
					reviewCheck.checkReview(review);
					boardCheck.checkOppositionRecommendCount(review.count);
					expect(typeof review.comment_count).toEqual('number'); // 댓글 수 검사는 굳이 check에 만들지 않아도 괜찮아 보입니다. 추후 수정이 필요할 수 도 있습니다.

					// 회원 검사
					const { member } = review;
					memberCheck.checkMember(member);
					memberCheck.checkMemberAttribute(member.attribute);
					memberCheck.checkMemberExternals(member.external);

					// 기관 검사
					const instituteChangeReview = review.institute_change_review;
					const beforeInstitute = instituteChangeReview.before_institute;
					const afterInstitute = instituteChangeReview.after_institute;
					reviewCheck.checkInstituteChangeReview(instituteChangeReview);
					instituteCheck.checkInstitute(beforeInstitute);
					instituteCheck.checkInstituteAttribute(beforeInstitute.attribute);
					instituteCheck.checkInstitute(afterInstitute);
					instituteCheck.checkInstituteAttribute(afterInstitute.attribute);

					// 필터 검사
					filterCheck.checkFilter(instituteChangeReview.before_filter);
					filterCheck.checkFilter(instituteChangeReview.after_filter);

					// 과목 검사
					subjectCheck.checkSubject(instituteChangeReview.before_subject);
					subjectCheck.checkSubject(instituteChangeReview.after_subject);

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

export default getReviewInstituteChangeTest;
