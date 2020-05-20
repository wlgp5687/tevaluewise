import { agent } from 'supertest';
import app from '../../../../app';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';
import * as tutorCheck from '../../../check/tutor';

import * as common from '../../../component/common';

const getReviewsTutorChangeTest = () => {
	// 강사 환승 리뷰 목록 조회
	describe('GET /v1/admins/reviews/type/tutor/change', () => {
		const request = agent(app);
		let setData = null;
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
			searchField = {
				page: 1,
				limit: 10,
				filter_id: 25,
				is_deleted: 'N',
				is_confirm: 'Y',
				before_tutor_name: '배성민',
				after_tutor_name: '정승제',
				before_institute_name: '대성마이맥',
				after_institute_name: '이투스',
				before_subject_name: '수학',
				after_subject_name: '수학',
				member_nickname: '9876jjjh',
				review_title: '생선님은',
				review_answer: '승제',
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/tutor/change?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/reviews/type/tutor/change?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/tutor/change?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/reviews/type/tutor/change?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not number', (done) => {
			searchField.filter_id = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/tutor/change?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is null', (done) => {
			searchField.filter_id = null;
			request
				.get(`/v1/admins/reviews/type/tutor/change?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not exist', (done) => {
			searchField.filter_id = 999999;
			request
				.get(`/v1/admins/reviews/type/tutor/change?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted not enum values', (done) => {
			searchField.is_deleted = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/tutor/change?is_deleted=${searchField.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm not enum values', (done) => {
			searchField.is_confirm = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/tutor/change?is_confirm=${searchField.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null reviews if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/reviews/type/tutor/change?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return tutor change reviews length 5 reviews if limit is 5', (done) => {
			searchField.limit = 5;
			request
				.get(`/v1/admins/reviews/type/tutor/change?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return tutor change reviews if page get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?page=${searchField.page}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if limit get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?limit=${searchField.limit}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if filter_id get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if is_deleted N get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?is_deleted=${searchField.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if is_deleted Y get tutorchangereview list', (done) => {
			searchField.is_deleted = 'Y';
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?is_deleted=${searchField.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if is_confirm N get tutorchangereview list', (done) => {
			searchField.is_confirm = 'N';
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if is_confirm Y get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test.skip('should return tutor change reviews if is_confirm REQUEST get tutorchangereview list(REQUEST 상태 환승 리뷰 없음)', (done) => {
			searchField.is_confirm = 'REQUEST';
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if before_tutor_name get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?before_tutor_name=${searchField.before_tutor_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if after_tutor_name get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?after_tutor_name=${searchField.after_tutor_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if before_institute_name get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?before_institute_name=${searchField.before_institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if after_institute_name get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?after_institute_name=${searchField.after_institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if before_subject_name get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?before_subject_name=${searchField.before_subject_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if after_subject_name get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?after_subject_name=${searchField.after_subject_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if member_nickname get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?member_nickname=${searchField.member_nickname}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if review_title get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?review_title=${searchField.review_title}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if review_answer get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change?review_answer=${searchField.review_answer}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if all searchField get tutorchangereview list', (done) => {
			request
				.get(
					encodeURI(
						`/v1/admins/reviews/type/tutor/change?page=${searchField.page}&limit=${searchField.limit}&filter_id=${searchField.filter_id}&is_deleted=${searchField.is_deleted}&is_confrim=${searchField.is_confirm}&before_tutor_name=${searchField.before_tutor_name}&after_tutor_name=${searchField.after_tutor_name}&before_institute_name=${searchField.before_institute_name}&after_institute_name=${searchField.after_institute_name}&before_subject_name=${searchField.before_subject_name}&after_subject_name=${searchField.after_subject_name}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});

		test('should return tutor change reviews if no searchField get tutorchangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/change`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkTutorChangeReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 강사 검사
						tutorCheck.checkTutor(reviewList[i].before_tutor);
						tutorCheck.checkTutor(reviewList[i].after_tutor);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].before_institute);
						instituteCheck.checkInstitute(reviewList[i].after_institute);

						// 과목 검사
						subjectCheck.checkSubject(reviewList[i].before_subject);
						subjectCheck.checkSubject(reviewList[i].after_subject);

						// 필터 검사
						filterCheck.checkFilter(reviewList[i].before_filter_id);
						filterCheck.checkFilter(reviewList[i].after_filter_id);
					}

					return done();
				});
		});
	});
};

export default getReviewsTutorChangeTest;
