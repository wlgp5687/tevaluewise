import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';

import * as common from '../../../component/common';

const patchInstitute = () => {
	describe('Patch /v1/admins/institutes/:institute_id', () => {
		const request = agent(app);
		let sendData = null;
		let setData = null;
		let instituteId = 100;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			instituteId = 100;
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

		test('should return invalid status if instituteId is null', (done) => {
			instituteId = null;
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is valid', (done) => {
			instituteId = 999999999;
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is not number', (done) => {
			instituteId = 'notnumber';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_online is null', (done) => {
			sendData.has_online = null;
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_online is invalid', (done) => {
			sendData.has_online = 'invalid';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is null', (done) => {
			sendData.is_deleted = null;
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is invalid', (done) => {
			sendData.is_deleted = 'invalid';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_review is null', (done) => {
			sendData.has_review = null;
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if has_review is invalid', (done) => {
			sendData.has_review = 'invalid';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if phone is notnumber', (done) => {
			sendData.phone = 'notnumber';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if institute_parent_id is notnumber', (done) => {
			sendData.institute_parent_id = 'notnumber';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if institute_parent_id is invalid', (done) => {
			sendData.institute_parent_id = 88888888888;
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if region_id is notnumber', (done) => {
			sendData.region_id = 'notnumber';
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});
		test('should return response if success patch institute', (done) => {
			request
				.patch(`/v1/admins/institutes/${instituteId}`)
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

export default patchInstitute;
