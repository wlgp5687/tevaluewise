import { agent } from 'supertest';
import app from '../../../app';

import * as common from '../../component/common';

const getIsExistFamiliesInstitute = () => {
	// 기관 목록 조회
	describe('GET /v1/institute/familes/existance', () => {
		const request = agent(app);
		let setData = null;
		let instituteId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': token.token,
			};
		});

		beforeEach(() => {
			instituteId = 1;
		});

		// 상위 기관 존재 확인
		describe('Get /v1/institutes/sub-families/:institute_id/existence', () => {
			test('should return invalid status if institute_id is not number', (done) => {
				instituteId = 'notnumber';
				request
					.get(`/v1/institutes/sub-families/${instituteId}/existence`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				instituteId = 99999999;
				request
					.get(`/v1/institutes/sub-families/${instituteId}/existence`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success get existance', (done) => {
				request
					.get(`/v1/institutes/sub-families/${instituteId}/existence`)
					.set(setData)
					.expect(200, done);
			});
		});

		// 하위 기관 존재 확인
		describe('Get /v1/institutes/high-families/:institute_id/existence', () => {
			test('should return invalid status if institute_id is not number', (done) => {
				instituteId = 'notnumber';
				request
					.get(`/v1/institutes/high-families/${instituteId}/existence`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				instituteId = 99999999;
				request
					.get(`/v1/institutes/high-families/${instituteId}/existence`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success get existance', (done) => {
				request
					.get(`/v1/institutes/high-families/${instituteId}/existence`)
					.set(setData)
					.expect(200, done);
			});
		});
	});
};
export default getIsExistFamiliesInstitute;
