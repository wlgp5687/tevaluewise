import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';

import * as common from '../../../component/common';

const getMemberLoginLogsTest = () => {
	describe('GET /v1/admins/members/loginlog/:member_id', () => {
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
			memberId = 107419;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 99999999;
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 999999', (done) => {
			searchField.page = 999999;
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return loginlogs list length 20 if limit is 20', (done) => {
			searchField.limit = 20;
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const loginLogs = res.body.list;
					common.listAttrTypeCheck(res.body.total, res.body.limit, res.body.page);

					for (let i = 0; i < loginLogs.length; i += 1) memberCheck.checkMemberLoginLog(loginLogs[i]);
					expect(loginLogs.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return loginlogs if success get member login logs', (done) => {
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const loginLogs = res.body.list;
					common.listAttrTypeCheck(res.body.total, res.body.limit, res.body.page);

					for (let i = 0; i < loginLogs.length; i += 1) memberCheck.checkMemberLoginLog(loginLogs[i]);

					return done();
				});
		});

		test('should return loginlogs if page 2 success get member login logs', (done) => {
			searchField.page = 2;
			request
				.get(`/v1/admins/members/loginlog/${memberId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const loginLogs = res.body.list;
					common.listAttrTypeCheck(res.body.total, res.body.limit, res.body.page);

					for (let i = 0; i < loginLogs.length; i += 1) memberCheck.checkMemberLoginLog(loginLogs[i]);
					expect(res.body.page).toEqual(searchField.page);

					return done();
				});
		});
	});
};

export default getMemberLoginLogsTest;
