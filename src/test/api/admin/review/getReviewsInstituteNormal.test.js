import { agent } from 'supertest';
import app from '../../../../app';
// import * as reviewCheck from './check/review';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';

import * as common from '../../../component/common';

const getReviewsInstituteNormalTest = () => {
	// 기관 리뷰 목록 조회
	describe('GET /v1/admins/reviews/type/institute/normal', () => {
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
				filter_id: 4403,
				is_deleted: 'N',
				is_confirm: 'Y',
				institute_type: 'daycare',
				institute_name: '도담뜰어린이집',
				subject_name: '유치원',
				member_nickname: '이지',
				review_title: '생긴지 얼마안된곳',
				review_answer: '생긴지 얼마안된곳이라서 괜찮아요',
			};
		});

		test('should return invalid status if page not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/institute/normal?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/reviews/type/institute/normal?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/institute/normal?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/reviews/type/institute/normal?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id not number', (done) => {
			searchField.filter_id = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/institute/normal?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is null', (done) => {
			searchField.filter_id = null;
			request
				.get(`/v1/admins/reviews/type/institute/normal?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted not enum values', (done) => {
			searchField.is_deleted = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/institute/normal?is_deleted=${searchField.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm not enum values', (done) => {
			searchField.is_confirm = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/institute/normal?is_confirm=${searchField.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_type not enum values', (done) => {
			searchField.institute_type = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/institute/normal?institute_type=${searchField.institute_type}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/reviews/type/institute/normal?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return institute normal reviews length 5 if limit is 5', (done) => {
			searchField.limit = 5;
			request
				.get(`/v1/admins/reviews/type/institute/normal?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return institute normal reviews if is_deleted N success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?is_deleted=${searchField.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if is_deleted Y success get institute normal review list', (done) => {
			searchField.is_deleted = 'Y';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?is_deleted=${searchField.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if is_confirm Y success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if is_confirm N success get institute normal review list', (done) => {
			searchField.is_confirm = 'N';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if is_confirm REQUEST success get institute normal review list', (done) => {
			searchField.is_confirm = 'REQUEST';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if institute_type is daycare success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?institute_type=${searchField.institute_type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if institute_type is institute success get institute normal review list', (done) => {
			searchField.institute_type = 'institute';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?institute_type=${searchField.institute_type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test.skip('should return institute normal reviews if institute_type is university success get institute normal review list(대학 리뷰 없음)', (done) => {
			searchField.institute_type = 'univaersity';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?institute_type=${searchField.institute_type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if institute_type is kindergarten success get institute normal review list', (done) => {
			searchField.institute_type = 'kindergarten';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?institute_type=${searchField.institute_type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test.skip('should return institute normal reviews if institute_type is etc success get institute normal review list(etc 리뷰 없음)', (done) => {
			searchField.institute_type = 'etc';
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?institute_type=${searchField.institute_type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if institute_name success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?institute_name=${searchField.institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if subject_name success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?subject_name=${searchField.subject_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if review_title success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?review_title=${searchField.review_title}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		test('should return institute normal reviews if review_answer success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal?review_answer=${searchField.review_answer}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});

		//========================================

		test('should return institute normal reviews if no searchfield success get institute normal review list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/institute/normal`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						// 리뷰 검사
						reviewCheck.checkReview(reviewList[i]);
						reviewCheck.checkNormalReviewCount(reviewList[i]);
						reviewCheck.checkChangeReviewTitleResult(reviewList[i]);

						// 회원 검사
						memberCheck.checkMember(reviewList[i].member);

						// 기관 검사
						instituteCheck.checkInstitute(reviewList[i].institute);

						// 과목 검사
						subjectCheck.checkSubject({ id: reviewList[i].subject_id });

						// 필터 검사
						filterCheck.checkFilter({ id: reviewList[i].filter_id });
					}
					return done();
				});
		});
	});
};

export default getReviewsInstituteNormalTest;
