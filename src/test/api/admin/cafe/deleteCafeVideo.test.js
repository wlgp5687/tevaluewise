import { agent } from 'supertest';
import app from '../../../../app';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const deleteCafeVideo = () => {
	// 카페 영상 삭제
	describe('DELETE /v1/admins/cafes/:cafe_id/video/:cafe_video_id', () => {
		const request = agent(app);
		let setData = null;
		let cafeId = null;
		let cafeVideoId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});
		// eslint-disable-next-line
		let sendData = null;

		beforeEach(() => {
			cafeId = 1;
			cafeVideoId = 1;
		});

		test('should return invalid status if cafe_id is not number', (done) => {
			cafeId = 'not number';
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is invalid', (done) => {
			cafeId = 999999;
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is null', (done) => {
			cafeId = null;
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafeVideoId is not number', (done) => {
			cafeVideoId = 'not number';
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafeVideoId is invalid', (done) => {
			cafeVideoId = 999999;
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafeVideoId is null', (done) => {
			cafeVideoId = null;
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return null if success delete cafe video', (done) => {
			request
				.delete(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});
	});
};

export default deleteCafeVideo;
