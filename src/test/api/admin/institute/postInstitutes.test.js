import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';

import * as common from '../../../component/common';

const postInstitute = () => {
	describe('POST /v1/admins/institutes/', () => {
		const request = agent(app);
		let sendData = null;
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
			sendData = {
				name_ko: '별별선생',
				name_en: '별별선생',
				campus: '본사',
				type: 'institute',
				is_deleted: 'N',
				is_confirm: 'REQUEST',
				has_online: 'N',
				has_review: 'N',
				message: '메세지',
				site_url: 'www.youtube.com',
				tags: '["태그", "태그2"]',
				address: '주소',
				post: '우편번호',
				phone: '01012341234',
				geo_latitude: '0',
				geo_longitude: '0',
				institute_parent_id: '4891',
				region_id: '3',
			};
		});

		test('should return invalid status if name_ko is null', (done) => {
			sendData.name_ko = null;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if name_ko is not exist', (done) => {
			delete sendData.name_ko;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if type is null', (done) => {
			sendData.type = null;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if type is not exist', (done) => {
			delete sendData.type;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if type is invalid', (done) => {
			sendData.type = 'invalid';
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_online is null', (done) => {
			sendData.has_online = null;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_online is not exist', (done) => {
			delete sendData.has_online;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_online is invalid', (done) => {
			sendData.has_online = 'invalid';
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_review is null', (done) => {
			sendData.has_review = null;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_review is not exist', (done) => {
			delete sendData.has_review;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_review is invalid', (done) => {
			sendData.has_review = 'invalid';
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if phone is notnumber', (done) => {
			sendData.phone = 'notnumber';
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if institute_parent_id is notnumber', (done) => {
			sendData.institute_parent_id = 'notnumber';
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if institute_parent_id is invalid', (done) => {
			sendData.institute_parent_id = 88888888888;
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if region_id is notnumber', (done) => {
			sendData.region_id = 'notnumber';
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});
		test('should return response if success post institute', (done) => {
			request
				.post(`/v1/admins/institutes/`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const Institute = res.body.institute;
					instituteCheck.checkInstitute(Institute);

					return done();
				});
		});
	});
};

export default postInstitute;
