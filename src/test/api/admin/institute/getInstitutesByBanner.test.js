import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';
import * as bannerCheck from '../../../check/banner';

import * as common from '../../../component/common';

const getInstitutesByBanner = () => {
	// 배너 연결 기관 조회
	describe('GET /v1/admins/institutes/banner/:banner_id', () => {
		const request = agent(app);
		let setData = null;
		let bannerId = null;
		let searchfield = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			bannerId = 1;
			searchfield = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if bannerId is not number', (done) => {
			bannerId = 'not number';
			request
				.get(`/v1/admins/institutes/banner/${bannerId}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if bannerId is invalid', (done) => {
			bannerId = 999999999;
			request
				.get(`/v1/admins/institutes/banner/${bannerId}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if bannerId is null', (done) => {
			bannerId = null;
			request
				.get(`/v1/admins/institutes/banner/${bannerId}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid stats if page is not number', (done) => {
			searchfield.page = 'isNotNumber';
			request
				.get(`/v1/admins/institutes/banner/${bannerId}?page=${searchfield.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchfield.page = '9999999';
			request
				.get(`/v1/admins/institutes/banner/${bannerId}?page=${searchfield.page}`)
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
				.get(`/v1/admins/institutes/banner/${bannerId}?limit=${searchfield.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if success get institutes belong to tutor', (done) => {
			request
				.get(encodeURI(`/v1/admins/institutes/banner/${bannerId}?page=${searchfield.page}&limit=${searchfield.limit}`))
				.set(setData)
				.send(searchfield)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutesByBanner = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutesByBanner.length; i += 1) {
						// 기관 체크
						instituteCheck.checkInstituteBanner(institutesByBanner[i]);
						instituteCheck.checkInstitute(institutesByBanner[i].institute);
						instituteCheck.checkInstituteAttribute(institutesByBanner[i].institute.attribute);

						// 배너 체크
						bannerCheck.checkBanner(institutesByBanner[i].banner);

						return done();
					}
				});
		});
	});
};

export default getInstitutesByBanner;
