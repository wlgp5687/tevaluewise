import { agent } from 'supertest';
import app from '../../../../app';
import { getModel } from '../../../../database';

import * as common from '../../../component/common';

const Member = getModel('Member');

const patchNicknameTest = () => {
	describe('PATCH /v1/admins/members/nickname/:nickname/existence', () => {
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
			memberId = 6075;
			sendData = {
				nickname: '수정할닉네임',
			};
		});

		afterAll(async () => {
			await Member.update({ nickname: '수정전닉네임' }, { where: { id: memberId } });
		});

		test('shoudl return invalid stauts if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.patch(`/v1/admins/members/nickname/${memberId}`)
				.set(setData)
				.send({ nickname: sendData.nickname })
				.expect(500, done);
		});

		test('shoudl return invalid stauts if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.patch(`/v1/admins/members/nickname/${memberId}`)
				.set(setData)
				.send({ nickname: sendData.nickname })
				.expect(500, done);
		});

		test('shoudl return invalid stauts if nickname exist', (done) => {
			sendData.nickname = '가나다라';
			request
				.patch(`/v1/admins/members/nickname/${memberId}`)
				.set(setData)
				.send({ nickname: sendData.nickname })
				.expect(500, done);
		});

		test('shoudl return invalid stauts if nickname length 1', (done) => {
			sendData.nickname = '뛸';
			request
				.patch(`/v1/admins/members/nickname/${memberId}`)
				.set(setData)
				.send({ nickname: sendData.nickname })
				.expect(500, done);
		});

		test('shoudl return invalid stauts if nickname length 11', (done) => {
			sendData.nickname = '뛸다로다네로푸바바열열';
			request
				.patch(`/v1/admins/members/nickname/${memberId}`)
				.set(setData)
				.send({ nickname: sendData.nickname })
				.expect(500, done);
		});

		test('shoudl return null if success patch nickname', (done) => {
			request
				.patch(`/v1/admins/members/nickname/${memberId}`)
				.set(setData)
				.send({ nickname: sendData.nickname })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});
	});
};

export default patchNicknameTest;
