import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const getIsExitsInstituteName = () => {
	describe('GET /v1/admins/institutes/name-ko/:name_ko/existence', () => {
		const request = agent(app);
		let nameKo = null;
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
			nameKo = 'ebsi';
		});

		test('should return true data if exist nameKo', (done) => {
			request
				.get(`/v1/admins/institutes/name-ko/${nameKo}/existence`)
				.set(setData)
				.expect(200, done);
		});

		test('should return false data if not exist nameKo', (done) => {
			nameKo = '1324135';
			request
				.get(`/v1/admins/institutes/name-ko/${nameKo}/existence`)
				.set(setData)
				.expect(200, done);
		});
	});
};

export default getIsExitsInstituteName;
