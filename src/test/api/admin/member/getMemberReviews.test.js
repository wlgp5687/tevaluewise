import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as tutorCheck from '../../../check/tutor';
import * as instituteCheck from '../../../check/institute';
import * as reviewCheck from '../../../check/review';

import * as common from '../../../component/common';

const getMemberReviewsTest = () => {
	describe('GET /v1/admins/members/:member_id/review', () => {
		const request = agent(app);
		let setData = null;
		let memberId = null;
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
			memberId = 31;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return member reviews length 5  if limit is 5', (done) => {
			searchField.limit = 5;
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return null reviews if page is 999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return member reviews if success get member reviews', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/review?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						reviewCheck.checkReview(reviewList[i]);

						for (let j = 0; j < reviewList[i].review_question_answer.length; j += 1) {
							reviewCheck.checkReviewQuestion(reviewList[i].review_question_answer[j].review_question);
							reviewCheck.checkReviewAnswerText(reviewList[i].review_question_answer[j].review_answer);
						}
						expect(typeof reviewList[i].review_comment_count).toEqual('number');
					}
					return done();
				});
		});

		test('should return member reviews if no page, no limitsuccess get member reviews', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/review`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const reviewList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewList.length; i += 1) {
						reviewCheck.checkReview(reviewList[i]);

						for (let j = 0; j < reviewList[i].review_question_answer.length; j += 1) {
							reviewCheck.checkReviewQuestion(reviewList[i].review_question_answer[j].review_question);
							reviewCheck.checkReviewAnswerText(reviewList[i].review_question_answer[j].review_answer);
						}
						expect(typeof reviewList[i].review_comment_count).toEqual('number');
					}
					return done();
				});
		});
	});
};

export default getMemberReviewsTest;
