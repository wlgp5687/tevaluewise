import { agent } from 'supertest';
import app from '../../../app';
import * as boardCheck from '../../check/board';
import * as memberCheck from '../../check/member';
import * as cafeCheck from '../../check/cafe';
import * as filterCheck from '../../check/filter';

import * as common from '../../component/common';

const getGeneralBoardPostTest = () => {
	// 카페 일반 게시판 상세 조회
	describe('GET /v1/boards/generals/:post_id', () => {
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
				.post(`/v1/boards/generals`)
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

		// 강사 페이지 주인일 때 상세 조회
		describe('tutor page master', () => {
			beforeAll(async () => {
				const member = { user_id: process.env.TUTOR_USER_ID, password: process.env.TEST_USER_PASSWORD };
				const token = await common.getToken(request);
				const userToken = await common.siteLogin(request, token, member);

				setData = {
					'csrf-token': token.decoded_token.csrf,
					'x-access-token': userToken.token,
				};
			});

			beforeEach(() => {
				cafeId = 1;
			});

			test('should return invalid status if post_id is not number', (done) => {
				cafeId = 'isNotNumber';
				request
					.get(`/v1/boards/generals/${postId}?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is null', (done) => {
				cafeId = null;
				request
					.get(`/v1/boards/generals/${postId}?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is not exist', (done) => {
				cafeId = 9999999;
				request
					.get(`/v1/boards/generals/${postId}?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is empty', (done) => {
				cafeId = 9999999;
				request
					.get(`/v1/boards/generals/${postId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is not number', (done) => {
				request
					.get(`/v1/boards/generals/isNotNumber?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is not exist', (done) => {
				request
					.get(`/v1/boards/generals/9999999?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is not null', (done) => {
				request
					.get(`/v1/boards/generals/${null}?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should retunr post if success get board post', (done) => {
				request
					.get(`/v1/boards/generals/${postId}?cafe_id=${cafeId}`)
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

		// 강사 팔로우일 때 상세 조회
		describe('tutor follow member', () => {
			let sendData = null;

			beforeAll(async () => {
				const member = { user_id: process.env.FOLLOW_USER_ID, password: process.env.TEST_USER_PASSWORD };
				const token = await common.getToken(request);
				const userToken = await common.siteLogin(request, token, member);

				setData = {
					'csrf-token': token.decoded_token.csrf,
					'x-access-token': userToken.token,
				};

				// 회원이 강사 팔로우 하기
				await request
					.post(`/v1/follows/tutor`)
					.set(setData)
					.send({ tutor_id: tutorId, filter_id: 317 });
			});

			test('should return invalid status if post_id is not number', (done) => {
				request
					.get(`/v1/boards/generals/isNotNumber?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is not exist', (done) => {
				request
					.get(`/v1/boards/generals/9999999?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if post_id is not null', (done) => {
				request
					.get(`/v1/boards/generals/${null}?cafe_id=${cafeId}`)
					.set(setData)
					.expect(500, done);
			});

			test('should retunr post if success get board post', (done) => {
				request
					.get(`/v1/boards/generals/${postId}?cafe_id=${cafeId}`)
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

		// 언팔로우일 떄 상세 조회
		describe('tutor unFollow member', () => {
			let sendData = null;

			beforeAll(async () => {
				const member = { user_id: process.env.UNFOLLOW_USER_ID, password: process.env.TEST_USER_PASSWORD };
				const token = await common.getToken(request);
				const userToken = await common.siteLogin(request, token, member);

				setData = {
					'csrf-token': token.decoded_token.csrf,
					'x-access-token': userToken.token,
				};
			});

			test('should return invalid status if tutor unFollow member', (done) => {
				request
					.get(`/v1/boards/generals/${postId}?cafe_id=${cafeId}`)
					.set(setData)
					.expect(400, done);
			});
		});
	});
};

export default getGeneralBoardPostTest;
