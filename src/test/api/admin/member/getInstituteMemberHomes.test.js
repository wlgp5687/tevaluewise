import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as regionCheck from '../../../check/region';

import * as common from '../../../component/common';

const getInstituteMemberHomes = () => {
	describe('GET /v1/admins/members/:member_id/institute-home', () => {
		const request = agent(app);
		let memberId = null;
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
			memberId = 12619;
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.get(`/v1/admins/members/${memberId}/institute-home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/institute-home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/institute-home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institute homes if success get institute member homes', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/institute-home`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteHomes = res.body.institute_home_data.list;
					const { institute } = res.body;

					expect(typeof res.body.institute_home_data.total).toEqual('number');
					instituteCheck.checkInstitute(institute);

					if (institute.regions) {
						regionCheck.checkRegion(institute.regions);
						regionCheck.checkRegion(institute.regions.region_info);
						if (institute.regions.region_info.sub_region) {
							regionCheck.checkRegion(institute.regions.region_info.sub_region);
							if (institute.regions.region_info.sub_region.sub_region) regionCheck.checkRegion(institute.regions.region_info.sub_region.sub_region);
						}
					}

					for (let i = 0; i < instituteHomes.length; i += 1) memberCheck.checkTutorMemberHome(instituteHomes[i]);

					return done();
				});
		});

		test('should return institute homes no regions if success get institute member homes', (done) => {
			memberId = 44604;
			request
				.get(`/v1/admins/members/${memberId}/institute-home`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteHomes = res.body.institute_home_data.list;
					const { institute } = res.body;

					expect(typeof res.body.institute_home_data.total).toEqual('number');
					instituteCheck.checkInstitute(institute);

					if (institute.regions) {
						regionCheck.checkRegion(institute.regions);
						regionCheck.checkRegion(institute.regions.region_info);
						if (institute.regions.region_info.sub_region) {
							regionCheck.checkRegion(institute.regions.region_info.sub_region);
							if (institute.regions.region_info.sub_region.sub_region) regionCheck.checkRegion(institute.regions.region_info.sub_region.sub_region);
						}
					}

					for (let i = 0; i < instituteHomes.length; i += 1) memberCheck.checkTutorMemberHome(instituteHomes[i]);

					return done();
				});
		});
	});
};

export default getInstituteMemberHomes;
