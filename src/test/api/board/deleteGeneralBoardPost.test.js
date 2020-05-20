import { agent } from 'supertest';
import app from '../../../app';
import * as boardCheck from '../../check/board';

import * as common from '../../component/common';

const deleteGeneralBoardPostTest = () => {
	// 카페 일반 게시판 게시글 삭제
	describe('DELETE /v1/admins/boards/generals/:post_id', () => {
		const request = agent(app);
		let setData = null;
		let postId = null;

		beforeAll(async () => {
			const member = { user_id: process.env.TUTOR_USER_ID, password: process.env.TEST_USER_PASSWORD };
			const token = await common.getToken(request);
			const userToken = await common.siteLogin(request, token, member);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': userToken.token,
			};

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

		// 작성자가 삭제하기
		describe('board post owner delete', () => {
			test('should return invalid status if postId is not number', (done) => {
				request
					.delete(`/v1/boards/generals/isNotNumber`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if postId is null', (done) => {
				request
					.delete(`/v1/boards/generals/${null}`)
					.set(setData)
					.expect(500, done);
			});

			test('should return invalid status if postId is not exist', (done) => {
				request
					.delete(`/v1/boards/generals/9999999`)
					.set(setData)
					.expect(500, done);
			});

			test('should return null if success delete board post', (done) => {
				request
					.delete(`/v1/boards/generals/${postId}`)
					.set(setData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});

		// 작성자가 아닌 사람이 삭제하기
		describe('has not board post delete auth', () => {
			beforeAll(async () => {
				const member = { user_id: process.env.FOLLOW_USER_ID, password: process.env.TEST_USER_PASSWORD };
				const token = await common.getToken(request);
				const userToken = await common.siteLogin(request, token, member);
				setData = {
					'csrf-token': token.decoded_token.csrf,
					'x-access-token': userToken.token,
				};
			});

			test('should invalid status if has not board post delete auth', (done) => {
				request
					.delete(`/v1/boards/generals/${postId}`)
					.set(setData)
					.expect(500, done);
			});
		});
	});
};

export default deleteGeneralBoardPostTest;
