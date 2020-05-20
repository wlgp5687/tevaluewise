import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const getNicknameExistTest = () => {
	describe('GET /v1/admins/members/nickname/:nickname/existence', () => {
		const request = agent(app);
		let nickname = null;
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
			nickname = '가나다라';
		});

		test('should return true if nickname exist', (done) => {
			request
				.get(encodeURI(`/v1/admins/members/nickname/${nickname}/existence`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.existence).toEqual(true);
					return done();
				});
		});

		test('should return false if nickname exist', (done) => {
			nickname = '개구리뒷다리';
			request
				.get(encodeURI(`/v1/admins/members/nickname/${nickname}/existence`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.existence).toEqual(false);
					return done();
				});
		});
	});
};

export default getNicknameExistTest;
