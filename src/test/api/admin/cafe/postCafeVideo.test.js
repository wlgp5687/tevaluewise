import { agent } from 'supertest';
import app from '../../../../app';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const postCafeVideo = () => {
	// 카페 영상 등록
	describe('POST /v1/admins/cafes/:cafe_id/video', () => {
		const request = agent(app);
		let setData = null;
		let cafeId = null;

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
			sendData = {
				title: '제목제목',
				video_url: 'wwwwwwwwww',
				is_default: 'N',
				sort_no: 2,
			};
		});

		test('should return invalid status if cafe_id is not number', (done) => {
			cafeId = 'not number';
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is invalid', (done) => {
			cafeId = 999999;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is null', (done) => {
			cafeId = null;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if title is empty', (done) => {
			delete sendData.title;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if video_url is empty ', (done) => {
			delete sendData.video_url;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_default is null ', (done) => {
			sendData.is_default = null;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_default is invalid ', (done) => {
			sendData.is_default = 123;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if sort_no is not number ', (done) => {
			sendData.sort_no = 'notnumber';
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if sort_no is null ', (done) => {
			sendData.sort_no = null;
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return cafe video if success post cafe video', (done) => {
			request
				.post(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const cafeVideo = res.body;
					cafeCheck.checkCafeVideo(cafeVideo);

					return done();
				});
		});
	});
};

export default postCafeVideo;
