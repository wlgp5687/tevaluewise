import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';

import * as common from '../../../component/common';

const getInstituteById = () => {
	describe('Get /v1/admins/institutes/:institute_id', () => {
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
				.get(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is not number', (done) => {
			instituteId = 'notnumber';
			request
				.get(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is invalid', (done) => {
			instituteId = 99999999;
			request
				.get(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institute data if success get institute', (done) => {
			request
				.get(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { institute } = res.body;
					instituteCheck.checkInstitute(institute);
					instituteCheck.checkInstituteAttribute(institute.attribute);
					if (institute.children) instituteCheck.checkInstituteChildren(institute.children);
					if (institute.region) instituteCheck.checkInstituteRegion(institute.region);
					if (institute.high_families) instituteCheck.checkInstituteFamily(institute.high_families);
					if (institute.sub_families) instituteCheck.checkInstituteFamily(institute.sub_families);
					if (institute.institute_member) instituteCheck.checkInstituteMember(institute.institute_member);
					return done();
				});
		});
	});
};

export default getInstituteById;
