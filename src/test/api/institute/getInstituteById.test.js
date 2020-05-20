import { agent } from 'supertest';
import app from '../../../app';
import * as instituteCheck from '../../check/institute';
import * as subjectCheck from '../../check/subject';
import * as regionCheck from '../../check/region';

import * as common from '../../component/common';

const getInstituteById = () => {
	describe('GET /v1/institutes/:institute_id', () => {
		const request = agent(app);
		let setData = null;
		let instituteId = null;
		let filterId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': token.token,
			};
		});

		beforeEach(() => {
			filterId = 317;
			instituteId = 1;
		});

		test('should return invalid status if institute is not number', (done) => {
			instituteId = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is null', (done) => {
			instituteId = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is invalid', (done) => {
			instituteId = 999999999;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is not exist', (done) => {
			filterId = 9999999;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is not number', (done) => {
			filterId = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is null', (done) => {
			filterId = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return institute if  filter success get institute', (done) => {
			request
				.get(encodeURI(`/v1/institutes/${instituteId}?filter_id=${filterId}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { institute } = res.body;
					instituteCheck.checkInstitute(institute);
					instituteCheck.checkInstituteAttribute(institute.attribute);

					for (let i = 0; i < institute.subject.length; i += 1) {
						subjectCheck.checkSubject(institute.subject[i]);
					}
					if (institute.region) {
						regionCheck.checkRegion(institute.region);
						if (institute.region.parent_region) {
							regionCheck.checkRegion(institute.region.parent_region);
							if (institute.region.parent_region.parent_region) {
								regionCheck.checkRegion(institute.region.parent_region.parent_region);
							}
						}
					}
					if (institute.children) instituteCheck.checkInstituteChildren(institute.children);
					if (institute.high_families) expect(common.confirmCheck(institute.high_families)).toEqual(true);
					if (institute.sub_families) expect(common.confirmCheck(institute.sub_families)).toEqual(true);
					return done();
				});
		});

		test('should return institute if  filter success get institute kindergerten', (done) => {
			instituteId = 111111;
			filterId = 4403;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}?filter_id=${filterId}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { institute } = res.body;
					instituteCheck.checkInstitute(institute);
					instituteCheck.checkInstituteAttribute(institute.attribute);

					for (let i = 0; i < institute.subject.length; i += 1) {
						subjectCheck.checkSubject(institute.subject[i]);
					}
					if (institute.region) {
						regionCheck.checkRegion(institute.region);
						if (institute.region.parent_region) {
							regionCheck.checkRegion(institute.region.parent_region);
							if (institute.region.parent_region.parent_region) {
								regionCheck.checkRegion(institute.region.parent_region.parent_region);
							}
						}
					}
					if (institute.children) instituteCheck.checkInstituteChildren(institute.children);
					if (institute.high_families) expect(common.confirmCheck(institute.high_families)).toEqual(true);
					if (institute.sub_families) expect(common.confirmCheck(institute.sub_families)).toEqual(true);
					return done();
				});
		});
	});
};
export default getInstituteById;
