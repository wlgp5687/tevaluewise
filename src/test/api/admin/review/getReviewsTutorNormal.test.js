import { agent } from 'supertest';
import app from '../../../../app';
import * as filterCheck from '../../../check/filter';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';

import * as common from '../../../component/common';

const getReviewsTutorNormalTest = () => {
	// 강사 리뷰 목록 조회
	describe('GET /v1/admins/reviews/type/tutor/normal', () => {
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
				filter_id: 317,
				is_deleted: 'N',
				is_confirm: 'N',
				tutor_name: '강민성',
				institute_name: '공단기',
				subject_name: '한국사',
				member_nickname: 'dbl3z470ol',
				review_title: '선생님의',
				review_answer: '선생님의',
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/tutor/normal?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/tutor/normal?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not number', (done) => {
			searchField.filter_id = 'isNotNumber';
			request
				.get(`/v1/admins/reviews/type/tutor/normal?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not exist', (done) => {
			searchField.filter_id = 999999;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is null', (done) => {
			searchField.filter_id = null;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted not enum values', (done) => {
			searchField.is_deleted = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/tutor/normal?is_deleted=${searchField.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is null', (done) => {
			searchField.is_deleted = null;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?is_deleted=${searchField.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm not enum values', (done) => {
			searchField.is_confirm = 'notEnumValue';
			request
				.get(`/v1/admins/reviews/type/tutor/normal?is_confirm=${searchField.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm is null', (done) => {
			searchField.is_confirm = null;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?is_confirm=${searchField.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return  tutor normal reviews length 5 if limit is 5', (done) => {
			searchField.limit = 5;
			request
				.get(`/v1/admins/reviews/type/tutor/normal?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return tutor normal reviews if page get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?page=${searchField.page}`))
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

		test('should return tutor normal reviews if limit get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?limit=${searchField.limit}`))
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

		test('should return tutor normal reviews if filter_id get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?filter_id=${searchField.filter_id}`))
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

		test('should return tutor normal reviews if is_deleted N get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?is_deleted=${searchField.is_deleted}`))
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

		test('should return tutor normal reviews if is_deleted Y get tutornormalreview list', (done) => {
			searchField.is_deleted = 'Y';
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?is_deleted=${searchField.is_deleted}`))
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

		test('should return tutor normal reviews if is_confirm N get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?is_confirm=${searchField.is_confirm}`))
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

		test('should return tutor normal reviews if is_confirm Y get tutornormalreview list', (done) => {
			searchField.is_confirm = 'Y';
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?is_confirm=${searchField.is_confirm}`))
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

		test('should return tutor normal reviews if is_confirm REQUEST get tutornormalreview list', (done) => {
			searchField.is_confirm = 'REQUEST';
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?is_confirm=${searchField.is_confirm}`))
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

		test('should return tutor normal reviews if tutor_name get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?tutor_name=${searchField.tutor_name}`))
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

		test('should return tutor normal reviews if institute_name get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?institute_name=${searchField.institute_name}`))
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

		test('should return tutor normal reviews if subject_name get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?subject_name=${searchField.subject_name}`))
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

		test('should return tutor normal reviews if member_nickname get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?member_nickname=${searchField.member_nickname}`))
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

		test('should return tutor normal reviews if review_title get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?review_title=${searchField.review_title}`))
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

		test('should return tutor normal reviews if review_answer get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal?review_answer=${searchField.review_answer}`))
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

		test('should return tutor normal reviews if all searchField get tutornormalreview list', (done) => {
			request
				.get(
					encodeURI(
						`/v1/admins/reviews/type/tutor/normal?page=${searchField.page}&limit=${searchField.limit}&filter_id=${searchField.filter_id}&is_deleted=${searchField.is_deleted}&is_confrim=${searchField.is_confirm}&tutor_name=${searchField.tutor_name}&institute_name=${searchField.institute_name}&subject_name=${searchField.subject_name}&member_nickname=${searchField.member_nickname}&review_title=${searchField.review_title}`,
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

		test('should return tutor normal reviews if no searchField get tutornormalreview list', (done) => {
			request
				.get(encodeURI(`/v1/admins/reviews/type/tutor/normal`))
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

export default getReviewsTutorNormalTest;
