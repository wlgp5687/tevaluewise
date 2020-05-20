import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const request = agent(app);
let setData = null;

const patchReviewConfirm = () => {
	describe('ROUTER /v1/admins/reviews/confirm', () => {
		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		// 리뷰 승인
		describe('POST /v1/admins/reviews/confirm/:review_id/approval', () => {
			// eslint-disable-next-line
			let reviewId = 1;

			test('should return invalid status if review_id is not number', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/not number/approval`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if review_id is invalid', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/99999999/approval`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success approval review', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/${reviewId}/approval`)
					.set(setData)
					.expect(200, done);
			});
		});

		// 리뷰 반려
		describe('PATCH /v1/admins/reviews/confirm/:review_id/reject', () => {
			// eslint-disable-next-line
			let reviewId = 1;

			test('should return invalid status if review_id is not number', (done) => {
				request
					.patch(`/v1/admins/reviews/confirm/not number/reject`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if review_id is invalid', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/99999999/reject`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success reject review', (done) => {
				request
					.patch(`/v1/admins/reviews/confirm/${reviewId}/reject`)
					.set(setData)
					.expect(200, done);
			});
		});

		// 리뷰 블라인드
		describe('PATCH /v1/admins/reviews/confirm/:review_id/blind', () => {
			// eslint-disable-next-line
			let reviewId = 1;

			test('should return invalid status if review_id is not number', (done) => {
				request
					.patch(`/v1/admins/reviews/confirm/not number/blind`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if review_id is invalid', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/99999999/blind`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success blind review', (done) => {
				request
					.patch(`/v1/admins/reviews/confirm/${reviewId}/blind`)
					.set(setData)
					.expect(200, done);
			});
		});

		// 리뷰 삭제
		describe('DELETE /v1/admins/reviews/confirm/:review_id/elimination', () => {
			// eslint-disable-next-line
			let reviewId = 1;

			test('should return invalid status if review_id is not number', (done) => {
				request
					.delete(`/v1/admins/reviews/confirm/not number/elimination`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if review_id is invalid', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/99999999/elimination`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success elimination review', (done) => {
				request
					.delete(`/v1/admins/reviews/confirm/${reviewId}/elimination`)
					.set(setData)
					.expect(200, done);
			});
		});

		// 리뷰 복구
		describe('PATCH /v1/admins/reviews/confirm/:review_id/restore', () => {
			// eslint-disable-next-line
			let reviewId = 1;

			test('should return invalid status if review_id is not number', (done) => {
				request
					.patch(`/v1/admins/reviews/confirm/not number/restore`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if review_id is invalid', (done) => {
				request
					.post(`/v1/admins/reviews/confirm/99999999/restore`)
					.set(setData)
					.expect(500, done);
			});

			test('should return response data if success restore review', (done) => {
				request
					.patch(`/v1/admins/reviews/confirm/${reviewId}/restore`)
					.set(setData)
					.expect(200, done);
			});
		});
	});
};

export default patchReviewConfirm;
