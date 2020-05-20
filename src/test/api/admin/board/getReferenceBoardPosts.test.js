import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as boardCheck from '../../../check/board';
import * as filterCheck from '../../../check/filter';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const getReferenceBoardPostsTest = () => {
	// 자료실 게시판 게시글 조회
	describe('GET /v1/admins/boards/reference', () => {
		const request = agent(app);
		let setData = null;
		let searchField = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			searchField = {
				page: 1,
				limit: 10,
				post_id: 18165,
				title: '33',
				contents: 'fa',
				order: 'last_at',
				start_date: '2020-02-29',
				end_date: '2020-03-02',
				tutor_name: '이',
				nickname: 'd',
			};
		});

		test('should return post list if all searchField success get reference board posts', (done) => {
			request
				.get(
					encodeURI(
						`/v1/admins/boards/reference?page=${searchField.page}&limit=${searchField.limit}&post_id=${searchField.post_id}&title=${searchField.title}&contents=${searchField.contents}&order=${searchField.order}&start_date=${searchField.start_date}&end_date=${searchField.end_date}&tutor_name=${searchField.tutor_name}&nickname=${searchField.nickname}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					return done();
				});
		});
	});
};

export default getReferenceBoardPostsTest;
