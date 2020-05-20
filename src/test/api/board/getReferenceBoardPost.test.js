import { agent } from 'supertest';
import app from '../../../app';
import * as boardCheck from '../../check/board';
import * as memberCheck from '../../check/member';
import * as cafeCheck from '../../check/cafe';
import * as filterCheck from '../../check/filter';

import * as common from '../../component/common';

const getReferenceBoardPostTest = () => {
	// 카페 자료실 게시판 게시글 상세 조회
	describe('GET /v1/boards/reference/:post_id', () => {
		const request = agent(app);
		let setData = null;
		let postId = null;
		let tutorId = null;
		let cafeId = null;

		beforeAll(async () => {
			const member = { user_id: process.env.TUTOR_USER_ID, password: process.env.TEST_USER_PASSWORD };
			const token = await common.getToken(request);
			const userToken = await common.siteLogin(request, token, member);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': userToken.token,
			};
			tutorId = 4063;
			cafeId = 1;

			// 글 작성 후 postId 저장
			const postResponse = await request
				.post(`/v1/boards/reference`)
				.set(setData)
				.send({
					cafe_id: 1,
					title: '글쓰기 제목',
					contents: '글쓰기 내용',
					is_notice: 'Y',
					lv1_id: 317,
				});
			postId = postResponse.body.id;
		});

		beforeEach(() => {
			cafeId = 1;
		});

		test('should return invalid status if post_id is not number', (done) => {
			cafeId = 'isNotNumber';
			request
				.get(`/v1/boards/reference/${postId}?cafe_id=${cafeId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if post_id is null', (done) => {
			cafeId = null;
			request
				.get(`/v1/boards/reference/${postId}?cafe_id=${cafeId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if post_id is not exist', (done) => {
			cafeId = 9999999;
			request
				.get(`/v1/boards/reference/${postId}?cafe_id=${cafeId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if post_id is empty', (done) => {
			cafeId = 9999999;
			request
				.get(`/v1/boards/reference/${postId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if post_id is not number', (done) => {
			request
				.get(`/v1/boards/reference/isNotNumber?cafe_id=${cafeId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if post_id is not exist', (done) => {
			request
				.get(`/v1/boards/reference/9999999?cafe_id=${cafeId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if post_id is not null', (done) => {
			request
				.get(`/v1/boards/reference/${null}?cafe_id=${cafeId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should retunr post if success get board post', (done) => {
			request
				.get(`/v1/boards/reference/${postId}?cafe_id=${cafeId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const post = res.body;

					boardCheck.checkBoardPost(post);
					memberCheck.checkMember(post.member);
					memberCheck.checkMemberAttribute(post.member.attribute);
					filterCheck.checkPostFilter(post.post_filter);

					return done();
				});
		});
	});
};

export default getReferenceBoardPostTest;
