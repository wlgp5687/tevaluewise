import { agent } from 'supertest';
import app from '../../../../app';
import { getModel } from '../../../../database';

import * as common from '../../../component/common';

const MemberAccess = getModel('MemberAccess');

const deleteMemberDormantClearTest = () => {
	describe('DELETE /v1/admins/members/:member_id/dormant', () => {
		const request = agent(app);
		let memberId = null;
		let setData = null;

		beforeEach(() => {
			memberId = 15;
		});

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
			const nowDate = await common.nowDateTime();
			memberId = 15;
			await MemberAccess.update({ is_dormant: 'Y', dormant_at: nowDate }, { where: { member_id: memberId } });
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotnNumber';
			request
				.delete(`/v1/admins/members/${memberId}/dormant`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.delete(`/v1/admins/members/${memberId}/dormant`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.delete(`/v1/admins/members/${memberId}/dormant`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not dormant', (done) => {
			memberId = 25;
			request
				.delete(`/v1/admins/members/${memberId}/dormant`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success delete member dormant', (done) => {
			request
				.delete(`/v1/admins/members/${memberId}/dormant`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});
	});
};

export default deleteMemberDormantClearTest;
