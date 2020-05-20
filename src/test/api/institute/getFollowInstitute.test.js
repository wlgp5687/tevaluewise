import { agent } from 'supertest';
import app from '../../../app';
import * as instituteCheck from '../../check/institute';
import * as filterCheck from '../../check/filter';
import * as memberCheck from '../../check/member';

import * as common from '../../component/common';

const getFollowInstitute = () => {
	// 기관 목록 조회
	describe('GET /v1/institutes/follow', () => {
		const request = agent(app);
		let setData = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': token.token,
			};
		});

		test('should return followInstitutes if success get followInstitutes', (done) => {
			request
				.get(encodeURI(`/v1/institutes/follow`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					if (res.body.list) {
						const followInstitutes = res.body.list;
						common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

						for (let i = 0; i < followInstitutes.length; i += 1) {
							// 기관 체크
							instituteCheck.checkInstitute(followInstitutes[i]);
							instituteCheck.checkInstituteAttribute(followInstitutes[i].attribute);

							// 멤버 체크
							memberCheck.checkMemberFollowInstitute(followInstitutes[i].member_follow_institute);

							// 필터 체크
							filterCheck.checkFilter(followInstitutes[i].member_follow_institute.filter);
						}
					} else {
						expect(res.body).toEqual(null);
					}
					return done();
				});
		});
	});
};
export default getFollowInstitute;
