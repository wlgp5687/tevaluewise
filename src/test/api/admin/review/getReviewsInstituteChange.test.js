import { agent } from 'supertest';
import app from '../../../../app';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as instituteCheck from '../../../check/institute';
import * as memberCheck from '../../../check/member';
import * as subjectCheck from '../../../check/subject';

import * as common from '../../../component/common';

const getReviewsInstituteChangeTest = () => {
	describe('GET /v1/admins/reviews/type/institute/change', () => {
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
				filter_id: 53,
				is_deleted: 'N',
				is_confirm: 'N',
				institute_type: 'institute',
				before_institute_name: '공부할땐김쌤학원',
				after_institute_name: '이차돌수학학원',
				before_subject_name: '수학',
				after_subject_name: '수학',
				member_nickname: 'PangJuck',
				review_title: '기관 환승 후기 리뷰',
				review_answer: '기관 환승',
			};
		});

		test('should return invalid status if page not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/institute/change?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/reviews/type/institute/change?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/institute/change?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/reviews/type/institute/change?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id not number', (done) => {
			searchField.filter_id = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/institute/change?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is null', (done) => {
			searchField.filter_id = null;
			request
				.get(`/v1/admins/reviews/type/institute/change?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not exist', (done) => {
			searchField.filter_id = 99999999;
			request
				.get(`/v1/admins/reviews/type/institute/change?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted not enum values', (done) => {
			searchField.is_deleted = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/institute/change?is_deleted=${searchField.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted not string', (done) => {
			searchField.is_deleted = 1234;
			request
				.get(`/v1/admins/reviews/type/institute/change?is_deleted=${searchField.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm not enum values', (done) => {
			searchField.is_confirm = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/institute/change?is_confirm=${searchField.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm not string', (done) => {
			searchField.is_confirm = 1234;
			request
				.get(`/v1/admins/reviews/type/institute/change?is_confirm=${searchField.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_type not enum value', (done) => {
			searchField.institute_type = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/institute/change?institute_type=${searchField.institute_type}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 999999;
			request
				.get(`/v1/admins/reviews/type/institute/change?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return institute change reviews length 5  if limit is 5', (done) => {
			searchField.limit = 5;
			request
				.get(`/v1/admins/reviews/type/institute/change?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return institute change reviews if is_confirm is Y success getinstitutechangereview list', (done) => {
			searchField.is_confirm = 'Y';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if is_confirm is N success getinstitutechangereview list', (done) => {
			searchField.is_confirm = 'N';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if is_deleted is N success getinstitutechangereview list', (done) => {
			searchField.is_deleted = 'N';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?is_deleted=${searchField.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if institute_type success getinstitutechangereview list', (done) => {
			searchField.institute_type = 'institute';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?institute_type=${searchField.institute_type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if before_institute_name success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?before_institute_name=${searchField.before_institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if after_institute_name success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?after_institute_name=${searchField.after_institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if before_subject_name success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?before_subject_name=${searchField.before_subject_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if after_subject_name success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?after_subject_name=${searchField.after_subject_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if member_nickname success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?member_nickname=${searchField.member_nickname}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if review_title success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?review_title=${searchField.review_title}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if review_answer success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?review_answer=${searchField.review_answer}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if page success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?page=${searchField.page}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

		test('should return institute change reviews if no searchField success getinstitutechangereview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/change?`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkInstituteChageReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

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

export default getReviewsInstituteChangeTest;
