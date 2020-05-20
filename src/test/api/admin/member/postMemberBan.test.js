import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';

import * as common from '../../../component/common';

const postMemberBanTest = () => {
	describe('POST /v1/admins/members/:member_id/ban', () => {
		const request = agent(app);
		let memberId = null;
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
			memberId = 15;
			sendData = {
				comment: '제제합니다.',
			};
		});

		test('should return invalid status if comment is null', (done) => {
			sendData.comment = null;
			request
				.post(`/v1/admins/members/${memberId}/ban`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.post(`/v1/admins/members/${memberId}/ban`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.post(`/v1/admins/members/${memberId}/ban`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.post(`/v1/admins/members/${memberId}/ban`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return ban log if success post member ban', (done) => {
			request
				.post(`/v1/admins/members/${memberId}/ban`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const banLog = res.body.member_ban_log;
					memberCheck.checkMemberBanLog(banLog);

					return done();
				});
		});
	});
};

export default postMemberBanTest;
