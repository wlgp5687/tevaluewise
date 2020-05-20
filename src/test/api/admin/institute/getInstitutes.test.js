import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';
import * as regionCheck from '../../../check/region';

import * as common from '../../../component/common';

const getInstitutes = () => {
	describe('Get /v1/admins/institutes', () => {
		const request = agent(app);
		let searchfield = null;
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
			searchfield = {
				page: 1,
				limit: 10,
				institute_id: 1,
				name_ko: '박문각',
				name_en: '박문각',
				member_id: 15,
				user_id: 'bc',
				member_name: '원',
				member_phone: '01',
				member_match: 'N',
				major: 317,
				order: 'first_id',
			};
		});

		test('should return invalid stats if page is not number', (done) => {
			searchfield.page = 'isNotNumber';
			request
				.get(`/v1/admins/institutes?page=${searchfield.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchfield.page = '9999999';
			request
				.get(`/v1/admins/institutes?page=${searchfield.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if limit is not number', (done) => {
			searchfield.limit = 'is not number';
			request
				.get(`/v1/admins/institutes?limit=${searchfield.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members length 20 if limit is 20', (done) => {
			searchfield.limit = 20;
			request
				.get(`/v1/admins/institutes?limit=${searchfield.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(20);
					return done();
				});
		});

		test('should return invalid status if institute_id is not number', (done) => {
			searchfield.institute_id = 'isNotNumber';
			request
				.get(`/v1/admins/institutes?institute_id=${searchfield.institute_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is null', (done) => {
			searchfield.institute_id = null;
			request
				.get(`/v1/admins/institutes?institute_id=${searchfield.institute_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if institute_id is invalid', (done) => {
			searchfield.institute_id = 99999999999;
			request
				.get(`/v1/admins/institutes?institute_id=${searchfield.institute_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield institute_id success get institutes', (done) => {
			request
				.get(`/v1/admins/institutes?institute_id=${searchfield.institute_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return invalid status if name_ko is null', (done) => {
			searchfield.name_ko = null;
			request
				.get(`/v1/admins/institutes?name_ko=${searchfield.name_ko}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return institutes if searchfield name_ko success get institutes', (done) => {
			searchfield.name_ko = '박문각';
			request
				.get(encodeURI(`/v1/admins/institutes?name_ko=${searchfield.name_ko}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return invalid status if name_en is null', (done) => {
			searchfield.name_en = null;
			request
				.get(`/v1/admins/institutes?name_en=${searchfield.name_en}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return institutes if searchfield name_en success get institutes', (done) => {
			searchfield.name_en = '박문각';
			request
				.get(encodeURI(`/v1/admins/institutes?name_en=${searchfield.name_en}`))

				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return invalid status if is_deleted is invalid', (done) => {
			searchfield.is_deleted = 'invalid';
			request
				.get(`/v1/admins/institutes?is_deleted=${searchfield.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is null', (done) => {
			searchfield.is_deleted = null;
			request
				.get(`/v1/admins/institutes?is_deleted=${searchfield.is_deleted}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield is_deleted success get institutes', (done) => {
			searchfield.is_deleted = 'N';
			request
				.get(`/v1/admins/institutes?is_deleted=${searchfield.is_deleted}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return invalid status if is_confirm is invalid', (done) => {
			searchfield.is_confirm = 'invalid';
			request
				.get(`/v1/admins/institutes?is_confirm=${searchfield.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_confirm is null', (done) => {
			searchfield.is_confirm = null;
			request
				.get(`/v1/admins/institutes?is_confirm=${searchfield.is_confirm}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield is_confirm success get institutes', (done) => {
			searchfield.is_confirm = 'Y';
			request
				.get(`/v1/admins/institutes?is_confirm=${searchfield.is_confirm}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return invalid status if major is invalid', (done) => {
			searchfield.major = 99999999999;
			request
				.get(`/v1/admins/institutes?major=${searchfield.major}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if major is null', (done) => {
			searchfield.major = null;
			request
				.get(`/v1/admins/institutes?major=${searchfield.major}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if major is notnumber', (done) => {
			searchfield.major = 'notnumber';
			request
				.get(`/v1/admins/institutes?major=${searchfield.major}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield major success get institutes', (done) => {
			request
				.get(`/v1/admins/institutes?major=${searchfield.major}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return invalid status if order is invalid', (done) => {
			searchfield.order = 'invalid';
			request
				.get(`/v1/admins/institutes?order=${searchfield.order}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if order is null', (done) => {
			searchfield.order = null;
			request
				.get(`/v1/admins/institutes?order=${searchfield.order}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if searchfield order success get institutes', (done) => {
			searchfield.order = 'first_id';
			request
				.get(`/v1/admins/institutes?order=${searchfield.order}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});

		test('should return response if success get institutes', (done) => {
			searchfield.order = 'first_id';
			searchfield.is_confirm = 'Y';
			searchfield.is_deleted = 'N';
			searchfield.name_ko = '박문각';
			searchfield.name_en = '박문각';
			request
				.get(
					encodeURI(
						`/v1/admins/institutes?page=${searchfield.page}&limit=${searchfield.limit}&institute_id=${searchfield.institute_id}&name_ko=${searchfield.name_ko}&name_en=${searchfield.name_en}&is_deleted=${searchfield.is_deleted}&is_confirm=${searchfield.is_confirm}&order=${searchfield.order}&major=${searchfield.major}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteList.length; i += 1) {
						instituteCheck.checkInstitute(instituteList[i]);
						if (instituteList[i].region) {
							regionCheck.checkRegion(instituteList[i].region);
							if (instituteList[i].region.region_info) {
								regionCheck.checkRegion(instituteList[i].region.region_info);
								if (instituteList[i].region.region_info.sub_region) {
									regionCheck.checkRegion(instituteList[i].region.region_info.sub_region);
									if (instituteList[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(instituteList[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}

					return done();
				});
		});
	});
};

export default getInstitutes;
