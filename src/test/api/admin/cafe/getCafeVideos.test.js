import { agent } from 'supertest';
import app from '../../../../app';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const getCafeVideos = () => {
	// 카페 영상 목록 조회
	describe('GET /v1/admins/cafes/:cafe_id/video', () => {
		const request = agent(app);
		let setData = null;
		let cafeId = null;
		let searchfield = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			cafeId = 1;
			searchfield = {
				page: 1,
				limit: 10,
				title: '제목',
				video_url: 'www',
				is_default: 'N',
				is_deleted: 'N',
			};
		});

		test('should return invalid status if cafe_id is not number', (done) => {
			cafeId = 'not number';
			request
				.get(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is invalid', (done) => {
			cafeId = 999999;
			request
				.get(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is null', (done) => {
			cafeId = null;
			request
				.get(`/v1/admins/cafes/${cafeId}/video`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid stats if page is not number', (done) => {
			searchfield.page = 'isNotNumber';
			request
				.get(`/v1/admins/cafes/${cafeId}/video?page=${searchfield.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchfield.page = '9999999';
			request
				.get(`/v1/admins/cafes/${cafeId}/video?page=${searchfield.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if limit is not number', (done) => {
			searchfield.limit = 'is not number';
			request
				.get(`/v1/admins/cafes/${cafeId}/video?limit=${searchfield.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return cafevideos length 20 if limit is 20', (done) => {
			searchfield.limit = 20;
			request
				.get(`/v1/admins/cafes/${cafeId}/video?limit=${searchfield.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(20);
					return done();
				});
		});

		test('should return invalid status if is_deleted is invalid ', (done) => {
			searchfield.is_deleted = 'invalid';
			request
				.get(`/v1/admins/cafes/${cafeId}/video?is_deleted=${searchfield.is_deleted}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is null ', (done) => {
			searchfield.is_deleted = null;
			request
				.get(`/v1/admins/cafes/${cafeId}/video?is_deleted=${searchfield.is_deleted}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if is_default is invalid ', (done) => {
			searchfield.is_default = 'invalid';
			request
				.get(`/v1/admins/cafes/${cafeId}/video?is_default=${searchfield.is_default}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if is_default is null ', (done) => {
			searchfield.is_default = null;
			request
				.get(`/v1/admins/cafes/${cafeId}/video?is_default=${searchfield.is_default}`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return cafe videos if success get cafe videos', (done) => {
			request
				.get(
					encodeURI(
						`/v1/admins/cafes/1/video?page=${searchfield.page}&limit=${searchfield.limit}&title=${searchfield.title}&video_url=${searchfield.video_url}&is_default=${searchfield.is_default}&is_deleted=${searchfield.is_deleted}`,
					),
				)
				.set(setData)
				.send(searchfield)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const cafeVideos = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < cafeVideos.length; i += 1) cafeCheck.checkCafeVideo(cafeVideos[i]);

					return done();
				});
		});
	});
};

export default getCafeVideos;
