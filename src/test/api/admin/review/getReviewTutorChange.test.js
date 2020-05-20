import { agent } from 'supertest';
import app from '../../../../app';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as instituteCheck from '../../../check/institute';
import * as memberCheck from '../../../check/member';
import * as boardCheck from '../../../check/board';
import * as subjectCheck from '../../../check/subject';
import * as regionCheck from '../../../check/region';
import * as tutorCheck from '../../../check/tutor';

import * as common from '../../../component/common';

const getReviewTutorChangeTest = () => {
	// 강사 환승 리뷰 상세 조회
	describe('GET /v1/admins/reviews/:review_id/type/tutor/change', () => {
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
			reviewId = 149462;
		});

		test('should return Invalid status if review_id is not exist', (done) => {
			reviewId = 9999999;
			request
				.get(`/v1/admins/reviews/${reviewId}/type/tutor/change`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if review_id is not number', (done) => {
			reviewId = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/${reviewId}/type/tutor/change`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if review_id is null', (done) => {
			reviewId = null;
			request
				.get(`/v1/admins/reviews/${reviewId}/type/tutor/change`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review data if success get review', (done) => {
			request
				.get(`/v1/admins/reviews/${reviewId}/type/tutor/change`)
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

					// 강사 검사
					const tutorChangeReview = review.tutor_change_review;
					const beforeTutor = tutorChangeReview.before_tutor;
					const afterTutor = tutorChangeReview.after_tutor;
					reviewCheck.checkTutorChangeReview(tutorChangeReview);
					tutorCheck.checkTutor(beforeTutor);
					tutorCheck.checkTutorAttribute(beforeTutor.attribute);
					if (beforeTutor.subject) for (let i = 0; i < beforeTutor.subject.length; i += 1) subjectCheck.checkSubject(beforeTutor.subject[i]);
					tutorCheck.checkTutor(afterTutor);
					tutorCheck.checkTutorAttribute(afterTutor.attribute);
					if (afterTutor.subject) for (let i = 0; i < afterTutor.subject.length; i += 1) subjectCheck.checkSubject(afterTutor.subject[i]);

					// 기관 검사
					const beforeInstitute = tutorChangeReview.before_institute;
					const afterInstitute = tutorChangeReview.after_institute;
					instituteCheck.checkInstitute(beforeInstitute);
					instituteCheck.checkInstituteAttribute(beforeInstitute.attribute);
					instituteCheck.checkInstitute(afterInstitute);
					instituteCheck.checkInstituteAttribute(afterInstitute.attribute);

					// 필터 검사
					filterCheck.checkFilter(tutorChangeReview.before_filter);
					filterCheck.checkFilter(tutorChangeReview.after_filter);

					// 과목 검사
					subjectCheck.checkSubject(tutorChangeReview.before_subject);
					subjectCheck.checkSubject(tutorChangeReview.after_subject);

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

export default getReviewTutorChangeTest;
