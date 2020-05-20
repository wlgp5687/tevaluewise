import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';

import * as common from '../../../component/common';

const getMemberReviewAuthsTest = () => {
	describe('GET /v1/admins/members/:member_id/review-auth', () => {
		const request = agent(app);
		let memberId = null;
		let searchField = null;
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
			memberId = 39605;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if memberId is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if memberId is not exist', (done) => {
			memberId = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if memberId is null', (done) => {
			memberId = null;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return member review auths if success get member review auth', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const reviewAuths = res.body.list;

					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);
					for (let i = 0; i < reviewAuths.length; i += 1) memberCheck.checkMemberReviewAuth(reviewAuths[i]);

					return done();
				});
		});

		test('should return member review auths length 20 if limit is 20', (done) => {
			searchField.limit = 20;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const reviewAuths = res.body.list;

					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);
					for (let i = 0; i < reviewAuths.length; i += 1) memberCheck.checkMemberReviewAuth(reviewAuths[i]);
					expect(reviewAuths.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return member review auths if page 2 success get member review auth', (done) => {
			searchField.page = 2;
			request
				.get(`/v1/admins/members/${memberId}/review-auth?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const reviewAuths = res.body.list;

					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);
					for (let i = 0; i < reviewAuths.length; i += 1) memberCheck.checkMemberReviewAuth(reviewAuths[i]);
					expect(res.body.page).toEqual(searchField.page);
					return done();
				});
		});
	});
};

export default getMemberReviewAuthsTest;
