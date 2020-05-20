import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as tutorCheck from '../../../check/tutor';

import * as common from '../../../component/common';

const getMemberFollowInstitutes = () => {
	describe('GET /v1/admins/members/:member_id/follow/institute', () => {
		const request = agent(app);
		let memberId = null;
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
			memberId = 123203;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return follow institutes length 1 if limit is 1', (done) => {
			searchField.limit = 1;
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);
					return done();
				});
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return institutes if success get member follow institutes', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/follow/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const followList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < followList.length; i += 1) {
						memberCheck.checkMemberFollowInstitute(followList[i]);
						instituteCheck.checkInstitute(followList[i].institute);
						instituteCheck.checkInstituteAttribute(followList[i].institute.attribute);
						if (followList[i].institute.subject) for (let j = 0; j < followList[i].institute.subject.length; j += 1) tutorCheck.checkSubject(followList[i].institute.subject[j]);
					}

					return done();
				});
		});

		test('should return institutes if no page, no limit success get member follow institutes', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/follow/institute`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const followList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < followList.length; i += 1) {
						memberCheck.checkMemberFollowInstitute(followList[i]);
						instituteCheck.checkInstitute(followList[i].institute);
						instituteCheck.checkInstituteAttribute(followList[i].institute.attribute);
						if (followList[i].institute.subject) for (let j = 0; j < followList[i].institute.subject.length; j += 1) tutorCheck.checkSubject(followList[i].institute.subject[j]);
					}

					return done();
				});
		});
	});
};

export default getMemberFollowInstitutes;
