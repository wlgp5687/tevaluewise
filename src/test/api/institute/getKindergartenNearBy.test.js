import { agent } from 'supertest';
import app from '../../../app';
import * as instituteCheck from '../../check/institute';
import * as regionCheck from '../../check/region';

import * as common from '../../component/common';

const getKindergartenNearBy = () => {
	// 인근 유치원 목록 조회
	describe('GET /v1/institutes/:institute_id/periphery-kindergarten', () => {
		const request = agent(app);
		let setData = null;
		let searchField = null;
		let instituteId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': token.token,
			};
		});

		beforeEach(() => {
			instituteId = 126196;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten?page=${searchField.page}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten?page=${searchField.page}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return null status if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/institutes/${instituteId}/periphery-kindergarten?page=${searchField.page}`)
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
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten?limit=${searchField.limit}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten?limit=${searchField.limit}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is not number', (done) => {
			instituteId = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is null', (done) => {
			instituteId = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is invalid', (done) => {
			instituteId = 99999999;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten`))
				.set(setData)
				.expect(500, done);
		});

		test('should return kindergartens if success get kindergartens', (done) => {
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/periphery-kindergarten`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const kindergartens = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < kindergartens.length; i += 1) {
						instituteCheck.checkInstitute(kindergartens[i]);
						instituteCheck.checkInstituteAttribute(kindergartens[i].attribute);
						instituteCheck.checkInstituteCount(kindergartens[i]);
						instituteCheck.checkInstituteChildren(kindergartens[i].children);
						if (kindergartens[i].region) {
							regionCheck.checkRegion(kindergartens[i].region);
							if (kindergartens[i].region.region_info) {
								regionCheck.checkRegion(kindergartens[i].region.region_info);
								if (kindergartens[i].region.region_info.sub_region) {
									regionCheck.checkRegion(kindergartens[i].region.region_info.sub_region);
									if (kindergartens[i].region.region_info.sub_region.sub_region) regionCheck.checkRegion(kindergartens[i].region.region_info.sub_region.sub_region);
								}
							}
						}
					}
					return done();
				});
		});
	});
};

export default getKindergartenNearBy;
