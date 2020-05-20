import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as boardCheck from '../../../check/board';
import * as filterCheck from '../../../check/filter';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const getReferenceBoardPostTest = () => {
	// 자료실 게시판 게시글 조회
	describe('GET /v1/admins/boards/reference/:post_id', () => {
		const request = agent(app);
		let setData = null;
		let postId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			postId = 18039;
		});

		test('shuld return invalid status if post_id is not number', (done) => {
			postId = 'isNotNumber';
			request
				.get(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.expect(500, done);
		});

		test('shuld return invalid status if post_id is not exist', (done) => {
			postId = 99999999;
			request
				.get(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.expect(500, done);
		});

		test('shuld return invalid status if post_id is null', (done) => {
			postId = null;
			request
				.get(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return post data if success get reference post', (done) => {
			request
				.get(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { post } = res.body;

					boardCheck.checkBoardPost(post);
					memberCheck.checkMember(post.member);
					memberCheck.checkMemberAttribute(post.member.attribute);
					filterCheck.checkPostFilter(post.post_filter);
					if (post.post_filter.lv1_filter) filterCheck.checkFilter(post.post_filter.lv1_filter);
					if (post.cafe[0]) cafeCheck.checkCafe(post.cafe[0]);
					if (post.post_file) boardCheck.checkPostFile(post.post_file[0]);

					return done();
				});
		});
	});
};

export default getReferenceBoardPostTest;
