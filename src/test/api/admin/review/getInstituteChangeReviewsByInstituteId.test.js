import { agent } from 'supertest';
import app from '../../../../app';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as filterCheck from '../../../check/filter';
import * as subjectCheck from '../../../check/subject';

import * as common from '../../../component/common';

const getInstituteChangeReviewsByInstituteId = () => {
	// 기관 인덱스로 기관 환승 리뷰 조회
	describe('GET /v1/admins/reviews/institute/:institute_id/institute-change-reviews', () => {
		const request = agent(app);
		let setData = null;
		let instituteId = null;
		let searchField = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			instituteId = 107587;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is null', (done) => {
			instituteId = null;
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is not number', (done) => {
			instituteId = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is not exist', (done) => {
			instituteId = 9999999;
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return reviews length 1 if limit is 1', (done) => {
			searchField.limit = 1;
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return reviews if no searchField get institute change reviews', (done) => {
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList[i].length; i += 1) {
						// 리뷰 검사
						const instituteChangeReview = reviewList[i].institute_change_review;
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChangeReview(instituteChangeReview);
						expect(typeof reviewList[i].comment_count).toEqual('number'); // 댓글 수 검사는 굳이 check에 만들지 않아도 괜찮아 보입니다. 추후 수정이 필요할 수 도 있습니다.

						// 회원 검사
						const { member } = reviewList[i];
						memberCheck.checkMember(member);
						memberCheck.checkMemberAttribute(member.attribute);

						// 기관 검사
						const beforeInstitute = instituteChangeReview.before_institute;
						const afterInstitute = instituteChangeReview.after_institute;
						instituteCheck.checkInstitute(beforeInstitute);
						instituteCheck.checkInstituteAttribute(beforeInstitute.attribute);
						instituteCheck.checkInstitute(afterInstitute);
						instituteCheck.checkInstituteAttribute(afterInstitute.attribute);

						// 필터 검사
						const beforeFilter = instituteChangeReview.before_filter;
						const afterFilter = instituteChangeReview.after_filter;
						filterCheck.checkFilter(beforeFilter);
						filterCheck.checkFilter(beforeFilter.lv1);
						filterCheck.checkFilter(afterFilter);
						filterCheck.checkFilter(afterFilter.lv1);

						// 과목 검사
						subjectCheck.checkSubject(instituteChangeReview.before_subject);
						subjectCheck.checkSubject(instituteChangeReview.after_subject);

						// 리뷰 제목 검사
						if (reviewList[i].review_title) for (let j = 0; j < reviewList[i].review_title.length; j += 1) reviewCheck.checkReviewAnswerText(reviewList[i].review_title[j].review_answer);
					}

					return done();
				});
		});

		test('should return reviews if page get institute change reviews', (done) => {
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList[i].length; i += 1) {
						// 리뷰 검사
						const instituteChangeReview = reviewList[i].institute_change_review;
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChangeReview(instituteChangeReview);
						expect(typeof reviewList[i].comment_count).toEqual('number'); // 댓글 수 검사는 굳이 check에 만들지 않아도 괜찮아 보입니다. 추후 수정이 필요할 수 도 있습니다.

						// 회원 검사
						const { member } = reviewList[i];
						memberCheck.checkMember(member);
						memberCheck.checkMemberAttribute(member.attribute);

						// 기관 검사
						const beforeInstitute = instituteChangeReview.before_institute;
						const afterInstitute = instituteChangeReview.after_institute;
						instituteCheck.checkInstitute(beforeInstitute);
						instituteCheck.checkInstituteAttribute(beforeInstitute.attribute);
						instituteCheck.checkInstitute(afterInstitute);
						instituteCheck.checkInstituteAttribute(afterInstitute.attribute);

						// 필터 검사
						const beforeFilter = instituteChangeReview.before_filter;
						const afterFilter = instituteChangeReview.after_filter;
						filterCheck.checkFilter(beforeFilter);
						filterCheck.checkFilter(beforeFilter.lv1);
						filterCheck.checkFilter(afterFilter);
						filterCheck.checkFilter(afterFilter.lv1);

						// 과목 검사
						subjectCheck.checkSubject(instituteChangeReview.before_subject);
						subjectCheck.checkSubject(instituteChangeReview.after_subject);

						// 리뷰 제목 검사
						if (reviewList[i].review_title) for (let j = 0; j < reviewList[i].review_title.length; j += 1) reviewCheck.checkReviewAnswerText(reviewList[i].review_title[j].review_answer);
					}

					return done();
				});
		});

		test('should return reviews if limit get institute change reviews', (done) => {
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList[i].length; i += 1) {
						// 리뷰 검사
						const instituteChangeReview = reviewList[i].institute_change_review;
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChangeReview(instituteChangeReview);
						expect(typeof reviewList[i].comment_count).toEqual('number'); // 댓글 수 검사는 굳이 check에 만들지 않아도 괜찮아 보입니다. 추후 수정이 필요할 수 도 있습니다.

						// 회원 검사
						const { member } = reviewList[i];
						memberCheck.checkMember(member);
						memberCheck.checkMemberAttribute(member.attribute);

						// 기관 검사
						const beforeInstitute = instituteChangeReview.before_institute;
						const afterInstitute = instituteChangeReview.after_institute;
						instituteCheck.checkInstitute(beforeInstitute);
						instituteCheck.checkInstituteAttribute(beforeInstitute.attribute);
						instituteCheck.checkInstitute(afterInstitute);
						instituteCheck.checkInstituteAttribute(afterInstitute.attribute);

						// 필터 검사
						const beforeFilter = instituteChangeReview.before_filter;
						const afterFilter = instituteChangeReview.after_filter;
						filterCheck.checkFilter(beforeFilter);
						filterCheck.checkFilter(beforeFilter.lv1);
						filterCheck.checkFilter(afterFilter);
						filterCheck.checkFilter(afterFilter.lv1);

						// 과목 검사
						subjectCheck.checkSubject(instituteChangeReview.before_subject);
						subjectCheck.checkSubject(instituteChangeReview.after_subject);

						// 리뷰 제목 검사
						if (reviewList[i].review_title) for (let j = 0; j < reviewList[i].review_title.length; j += 1) reviewCheck.checkReviewAnswerText(reviewList[i].review_title[j].review_answer);
					}

					return done();
				});
		});

		test('should return reviews if all searchField get institute change reviews', (done) => {
			request
				.get(`/v1/admins/reviews/institute/${instituteId}/institute-change-reviews?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList[i].length; i += 1) {
						// 리뷰 검사
						const instituteChangeReview = reviewList[i].institute_change_review;
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChangeReview(instituteChangeReview);
						expect(typeof reviewList[i].comment_count).toEqual('number'); // 댓글 수 검사는 굳이 check에 만들지 않아도 괜찮아 보입니다. 추후 수정이 필요할 수 도 있습니다.

						// 회원 검사
						const { member } = reviewList[i];
						memberCheck.checkMember(member);
						memberCheck.checkMemberAttribute(member.attribute);

						// 기관 검사
						const beforeInstitute = instituteChangeReview.before_institute;
						const afterInstitute = instituteChangeReview.after_institute;
						instituteCheck.checkInstitute(beforeInstitute);
						instituteCheck.checkInstituteAttribute(beforeInstitute.attribute);
						instituteCheck.checkInstitute(afterInstitute);
						instituteCheck.checkInstituteAttribute(afterInstitute.attribute);

						// 필터 검사
						const beforeFilter = instituteChangeReview.before_filter;
						const afterFilter = instituteChangeReview.after_filter;
						filterCheck.checkFilter(beforeFilter);
						filterCheck.checkFilter(beforeFilter.lv1);
						filterCheck.checkFilter(afterFilter);
						filterCheck.checkFilter(afterFilter.lv1);

						// 과목 검사
						subjectCheck.checkSubject(instituteChangeReview.before_subject);
						subjectCheck.checkSubject(instituteChangeReview.after_subject);

						// 리뷰 제목 검사
						if (reviewList[i].review_title) for (let j = 0; j < reviewList[i].review_title.length; j += 1) reviewCheck.checkReviewAnswerText(reviewList[i].review_title[j].review_answer);
					}

					return done();
				});
		});
	});
};

export default getInstituteChangeReviewsByInstituteId;
