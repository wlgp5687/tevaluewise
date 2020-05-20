import { agent } from 'supertest';
import app from '../../../../app';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const patchCafeVideo = () => {
	// 카페 영상 수정
	describe('PATCH /v1/admins/cafes/:cafe_id/video', () => {
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
			sendData = {
				title: '제목제목',
				video_url: 'wwwwwwwwww',
				is_default: 'Y',
				sort_no: 2,
			};
		});

		test('should return invalid status if cafe_id is not number', (done) => {
			cafeId = 'not number';
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is invalid', (done) => {
			cafeId = 999999;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is null', (done) => {
			cafeId = null;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafeVideoId is not number', (done) => {
			cafeVideoId = 'not number';
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafeVideoId is invalid', (done) => {
			cafeVideoId = 999999;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafeVideoId is null', (done) => {
			cafeVideoId = null;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_default is null ', (done) => {
			sendData.is_default = null;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_default is invalid ', (done) => {
			sendData.is_default = 123;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if sort_no is not number ', (done) => {
			sendData.sort_no = 'notnumber';
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if sort_no is null ', (done) => {
			sendData.sort_no = null;
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return cafe video if success patch cafe video', (done) => {
			request
				.patch(`/v1/admins/cafes/${cafeId}/video/${cafeVideoId}`)
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

export default patchCafeVideo;
