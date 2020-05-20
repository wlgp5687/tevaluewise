import { agent } from 'supertest';
import app from '../../../app';
import * as instituteCheck from '../../check/institute';

import * as common from '../../component/common';

const getInstitutes = () => {
	// 기관 목록 조회
	describe('GET /v1/institutes', () => {
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
				name_ko: '에듀윌',
				name_en: '에듀윌',
				campus: '본사',
				type: 'institute',
				has_online: 'Y',
				has_review: 'N',
				message: '메세지',
				site_url: 'www.chongkyokids.com',
				address: '서울특별시',
				phone: '6322',
				filter_id: 317,
				subject_id: 1,
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes?page=${searchField.page}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(encodeURI(`/v1/institutes?page=${searchField.page}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return null status if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/institutes?page=${searchField.page}`)
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
				.get(encodeURI(`/v1/institutes?limit=${searchField.limit}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(encodeURI(`/v1/institutes?limit=${searchField.limit}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return posts length 1 status if limit is 1', (done) => {
			searchField.limit = 1;
			request
				.get(encodeURI(`/v1/institutes?limit=${searchField.limit}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return invalid status if filter_id is not exist', (done) => {
			searchField.filter_id = 9999999;
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not number', (done) => {
			searchField.filter_id = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is null', (done) => {
			searchField.filter_id = null;
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield filter success get institutes', (done) => {
			request
				.get(`/v1/institutes?filter_id=${searchField.filter_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return invalid status if subject_id is not exist', (done) => {
			searchField.subject_id = 9999999;
			request
				.get(encodeURI(`/v1/institutes?subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if subject_id is not number', (done) => {
			searchField.subject_id = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes?subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if subject_id is null', (done) => {
			searchField.subject_id = null;
			request
				.get(encodeURI(`/v1/institutes?subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield subject success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return invalid status if type is invalid', (done) => {
			searchField.type = 'invalid';
			request
				.get(encodeURI(`/v1/institutes?type=${searchField.type}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if type is null', (done) => {
			searchField.type = null;
			request
				.get(encodeURI(`/v1/institutes?type=${searchField.type}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield type success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}&type=${searchField.type}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return invalid status if has_online is invalid', (done) => {
			searchField.has_online = 'invalid';
			request
				.get(encodeURI(`/v1/institutes?has_online=${searchField.has_online}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if has_online is null', (done) => {
			searchField.has_online = null;
			request
				.get(encodeURI(`/v1/institutes?has_online=${searchField.has_online}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield online success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}&type=${searchField.type}&has_online=${searchField.has_online}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return invalid status if has_review is invalid', (done) => {
			searchField.has_review = 'invalid';
			request
				.get(encodeURI(`/v1/institutes?has_review=${searchField.has_review}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if has_review is null', (done) => {
			searchField.has_review = null;
			request
				.get(encodeURI(`/v1/institutes?has_review=${searchField.has_review}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield review success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}&type=${searchField.type}&has_online=${searchField.has_review}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return institutes if searchfield campus success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}&type=${searchField.type}&campus=${searchField.campus}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return institutes if searchfield nameko success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}&type=${searchField.type}&name_ko=${searchField.name_ko}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return institutes if searchfield nameen success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?filter_id=${searchField.filter_id}&subject_id=${searchField.subject_id}&type=${searchField.type}&name_en=${searchField.name_en}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return institutes if searchfield site_url success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?site_url=${searchField.site_url}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return institutes if searchfield adress success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?adress=${searchField.adress}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});

		test('should return institutes if searchfield phone success get institutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes?phone=${searchField.phone}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutes = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutes.length; i += 1) {
						instituteCheck.checkInstitute(institutes[i]);
						instituteCheck.checkInstituteAttribute(institutes[i].attribute);
						if (institutes[i].children) instituteCheck.checkInstituteChildren(institutes[i].children);
					}
					return done();
				});
		});
	});
};

export default getInstitutes;
