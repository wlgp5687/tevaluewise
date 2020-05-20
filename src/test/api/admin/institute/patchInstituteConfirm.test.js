import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const request = agent(app);
let setData = null;

const patchInstituteConfirm = () => {
	describe('ROUTER /v1/admins/institutes/confirm', () => {
		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		// 기관 승인
		describe('Post /v1/admins/institutes/confirm/:institute_id/approval', () => {
			// eslint-disable-next-line
			let instituteId = 15000;

			test('should return invalid status if institute_id is not number', (done) => {
				request
					.post(`/v1/admins/institutes/confirm/not number/approval`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				request
					.post(`/v1/admins/institutes/confirm/99999999/approval`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success approval review', (done) => {
				request
					.post(`/v1/admins/institutes/confirm/${instituteId}/approval`)
					.set(setData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});

		// 기관 반려
		describe('PATCH /v1/admins/institutes/confirm/:institute_id/reject', () => {
			// eslint-disable-next-line
			let instituteId = 2;

			test('should return invalid status if institute_id is not number', (done) => {
				request
					.patch(`/v1/admins/institutes/confirm/not number/reject`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				request
					.patch(`/v1/admins/institutes/confirm/99999999/reject`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success reject review', (done) => {
				request
					.patch(`/v1/admins/institutes/confirm/${instituteId}/reject`)
					.set(setData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});

		// 기관 블라인드
		describe('PATCH /v1/admins/institutes/confirm/:institute_id/blind', () => {
			// eslint-disable-next-line
			let instituteId = 15;

			test('should return invalid status if institute_id is not number', (done) => {
				request
					.patch(`/v1/admins/institutes/confirm/not number/blind`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				request
					.patch(`/v1/admins/institutes/confirm/99999999/blind`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success blind review', (done) => {
				request
					.patch(`/v1/admins/institutes/confirm/${instituteId}/blind`)
					.set(setData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});

		// 기관 삭제
		describe('DELETE /v1/admins/institutes/:institute_id/elimination', () => {
			// eslint-disable-next-line
			let instituteId = 1;

			test('should return invalid status if institute_id is not number', (done) => {
				request
					.delete(`/v1/admins/institutes/not number/elimination`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				request
					.delete(`/v1/admins/institutes/99999999/elimination`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success elimination review', (done) => {
				request
					.delete(`/v1/admins/institutes/${instituteId}/elimination`)
					.set(setData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});

		// 기관 복구
		describe('PATCH /v1/admins/institutes/confirm/:institute_id/restore', () => {
			// eslint-disable-next-line
			let instituteId = 1;

			test('should return invalid status if institute_id is not number', (done) => {
				request
					.patch(`/v1/admins/institutes/not number/restore`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if institute_id is invalid', (done) => {
				request
					.patch(`/v1/admins/institutes/99999999/restore`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success restore review', (done) => {
				request
					.patch(`/v1/admins/institutes/${instituteId}/restore`)
					.set(setData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});
	});
};
export default patchInstituteConfirm;
