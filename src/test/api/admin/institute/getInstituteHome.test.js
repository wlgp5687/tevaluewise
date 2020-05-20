import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';
import * as filterCheck from '../../../check/filter';

import * as common from '../../../component/common';

const getInstituteHome = () => {
	describe('Get /v1/admins/institutes/:institute_id/home', () => {
		const request = agent(app);
		let instituteId = null;
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
			instituteId = 1;
		});

		test('should return invalid status if instituteId is null', (done) => {
			instituteId = null;
			request
				.get(`/v1/admins/institutes/${instituteId}/home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is not number', (done) => {
			instituteId = 'notnumber';
			request
				.get(`/v1/admins/institutes/${instituteId}/home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is invalid', (done) => {
			instituteId = 99999999;
			request
				.get(`/v1/admins/institutes/${instituteId}/home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institute data if success get institute', (done) => {
			request
				.get(`/v1/admins/institutes/${instituteId}/home`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const instituteHome = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteHome.length; i += 1) {
						// 과목 체크
						subjectCheck.checkSubject(instituteHome[i]);

						// 필터 체크
						filterCheck.checkFilter(instituteHome[i]);

						return done();
					}
				});
		});
	});
};

export default getInstituteHome;
