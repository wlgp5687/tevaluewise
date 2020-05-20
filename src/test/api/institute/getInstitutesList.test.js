import { agent } from 'supertest';
import app from '../../../app';
import * as instituteCheck from '../../check/institute';

import * as common from '../../component/common';

const getInstitutesList = () => {
	// 기관 목록 조회 Lite
	describe('GET /v1/institutes/list', () => {
		const request = agent(app);
		let setData = null;
		let searchField = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': token.token,
			};
		});

		beforeEach(() => {
			searchField = {
				page: 1,
				limit: 10,
				institute_name: '모두공',
				tutor_id: 4063,
				filter_id: 317,
				subject_id: 271,
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/list?page=${searchField.page}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(encodeURI(`/v1/institutes/list?page=${searchField.page}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return null status if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/institutes/list?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/list?limit=${searchField.limit}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(encodeURI(`/v1/institutes/list?limit=${searchField.limit}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not exist', (done) => {
			searchField.filter_id = 9999999;
			request
				.get(encodeURI(`/v1/institutes/list?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not number', (done) => {
			searchField.filter_id = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/list?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is null', (done) => {
			searchField.filter_id = null;
			request
				.get(encodeURI(`/v1/institutes/list?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield filter success get institutes', (done) => {
			request
				.get(`/v1/institutes/list?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						instituteCheck.checkInstituteCount(institutes[i]);
					}
					return done();
				});
		});

		test('should return invalid status if subject_id is not exist', (done) => {
			searchField.subject_id = 9999999;
			request
				.get(encodeURI(`/v1/institutes/list?subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if subject_id is not number', (done) => {
			searchField.subject_id = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/list?subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if subject_id is null', (done) => {
			searchField.subject_id = null;
			request
				.get(encodeURI(`/v1/institutes/list?subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return null status if subject only', (done) => {
			request
				.get(encodeURI(`/v1/institutes/list?subject=${searchField.subject}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return institutes if searchfield subject success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes/list?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						instituteCheck.checkInstituteCount(institutes[i]);
					}
					return done();
				});
		});

		test('should return null status if institute_name is invalid', (done) => {
			searchField.institute_name = 'invalid';
			request
				.get(encodeURI(`/v1/institutes/list?institute_name=${searchField.institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null status if institute_name only', (done) => {
			request
				.get(encodeURI(`/v1/institutes/list?institute_name=${searchField.institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return institutes if searchfield institute_name filter_id success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes/list?filter_id=${searchField.filter_id}&institute_name=${searchField.institute_name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						instituteCheck.checkInstituteCount(institutes[i]);
					}
					return done();
				});
		});

		test('should return institutes if searchfield success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes/list?filter_id=${searchField.filter_id}&institute_name=${searchField.institute_name}&subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						instituteCheck.checkInstituteCount(institutes[i]);
					}
					return done();
				});
		});

		test('should return invalid status if tutor_id is invalid', (done) => {
			searchField.tutor_id = 'invalid';
			request
				.get(encodeURI(`/v1/institutes/list?tutor_id=${searchField.tutor_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is null', (done) => {
			searchField.tutor_id = null;
			request
				.get(encodeURI(`/v1/institutes/list?tutor_id=${searchField.tutor_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield tutor_id success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes/list?&tutor_id=${searchField.tutor_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						instituteCheck.checkInstituteCount(institutes[i]);
					}
					return done();
				});
		});
	});
};

export default getInstitutesList;
