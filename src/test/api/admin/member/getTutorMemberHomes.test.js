import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as instituteCheck from '../../../check/institute';
import * as tutorCheck from '../../../check/tutor';

import * as common from '../../../component/common';

const getTutorMemberHomes = () => {
	describe('GET /v1/admins/members/:member_id/tutor-home', () => {
		const request = agent(app);
		let memberId = null;
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
			memberId = 6709;
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'isNotNumber';
			request
				.get(`/v1/admins/members/${memberId}/tutor-home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is null', (done) => {
			memberId = null;
			request
				.get(`/v1/admins/members/${memberId}/tutor-home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if member_id is not exist', (done) => {
			memberId = 9999999;
			request
				.get(`/v1/admins/members/${memberId}/tutor-home`)
				.set(setData)
				.expect(500, done);
		});

		test('should return tutor homes if success get tutor member homes', (done) => {
			request
				.get(`/v1/admins/members/${memberId}/tutor-home`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const tutorHomes = res.body.list;

					expect(typeof res.body.total).toEqual('number');
					for (let i = 0; i < tutorHomes.length; i += 1) memberCheck.checkTutorMemberHome(tutorHomes[i]);

					return done();
				});
		});
	});
};

export default getTutorMemberHomes;
