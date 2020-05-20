import { agent } from 'supertest';
import app from '../../../app';
import * as boardCheck from '../../check/board';
import * as memberCheck from '../../check/member';
import * as cafeCheck from '../../check/cafe';
import * as filterCheck from '../../check/filter';

import * as common from '../../component/common';

const patchReferenceBoardPostTest = () => {
	// 카페 자료실 게시판 게시글 수정
	describe('PATCH /v1/boards/reference/:post_id', () => {
		const request = agent(app);
		let setData = null;
		let sendData = null;
		let postId = null;

		beforeAll(async () => {
			const member = { user_id: process.env.TUTOR_USER_ID, password: process.env.TEST_USER_PASSWORD };
			const token = await common.getToken(request);
			const userToken = await common.siteLogin(request, token, member);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': userToken.token,
			};

			const postResponse = await request.post(`/v1/boards/reference`).set(setData).send({
				cafe_id: 1,
				title: '글쓰기 제목',
				contents: '글쓰기 내용',
				is_notice: 'Y',
				lv1_id: 317,
			});
			postId = postResponse.body.id;
		});

		// 작성자가 수정하기
		describe('board post owner patch', () => {
			beforeEach(() => {
				sendData = {
					cafe_id: 1,
					title: '수정 제목',
					contents: '수정 내용',
					is_notice: 'N',
					board_attach_file: JSON.stringify([
						{
							file_type: 'attache',
							org_file_name: '65919400_945260969144881_7620561594279264256_o.jpg',
							s3_file_name: 'f8588603efee0d5adc20c1609ad31dcec77b83fcf369912780f21bf6ca2abc5053d14ae91d96e7bfabf131526540155614d278ebc93a719e22a6947a47197d22',
							file_ext: 'image/jpeg',
							file_url: 'f8588603efee0d5adc20c1609ad31dcec77b83fcf369912780f21bf6ca2abc5053d14ae91d96e7bfabf131526540155614d278ebc93a719e22a6947a47197d22',
							link: 'f8588603efee0d5adc20c1609ad31dcec77b83fcf369912780f21bf6ca2abc5053d14ae91d96e7bfabf131526540155614d278ebc93a719e22a6947a47197d22',
							s3_key: 'board/f8588603efee0d5adc20c1609ad31dcec77b83fcf369912780f21bf6ca2abc5053d14ae91d96e7bfabf131526540155614d278ebc',
							byte_size: 283833,
						},
					]),
				};
			});

			test('should return invalid status if cafe_id is empty', (done) => {
				delete sendData.cafe_id;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if cafe_id is null', (done) => {
				sendData.cafe_id = null;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if cafe_id is not number', (done) => {
				sendData.cafe_id = 'isNotNumber';
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if cafe_id is not exist', (done) => {
				sendData.cafe_id = 999999;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if title is null', (done) => {
				sendData.title = null;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if title is blank', (done) => {
				sendData.title = '';
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if contents is null', (done) => {
				sendData.contents = null;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if contents is blank', (done) => {
				sendData.contents = '';
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if is_notice is blank', (done) => {
				sendData.is_notice = '';
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if is_notice is null', (done) => {
				sendData.is_notice = null;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if is_notice is not exist', (done) => {
				sendData.is_notice = 'isNotExist';
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if board_attach_file is not json', (done) => {
				sendData.board_attach_file = 'isNotJson';
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid status if board_attach_file is null', (done) => {
				sendData.board_attach_file = null;
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});

			test('should return null if no title success patch board post', (done) => {
				delete sendData.title;
				request
					.patch(`/v1/boards/reference/${postId}`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});

			test('should return null if no contents success patch board post', (done) => {
				delete sendData.contents;
				request
					.patch(`/v1/boards/reference/${postId}`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});

			test('should return null if no is_notice success patch board post', (done) => {
				delete sendData.is_notice;
				request
					.patch(`/v1/boards/reference/${postId}`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});

			test('should return null if no board_attach_file success patch board post', (done) => {
				delete sendData.board_attach_file;
				request
					.patch(`/v1/boards/reference/${postId}`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});

			test('should return null if success patch board post', (done) => {
				request
					.patch(`/v1/boards/reference/${postId}`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).toEqual(null);

						return done();
					});
			});
		});

		// 작성자가 아닌 사람이 수정하기
		describe('board post has not auth', () => {
			beforeAll(async () => {
				const member = { user_id: process.env.FOLLOW_USER_ID, password: process.env.TEST_USER_PASSWORD };
				const token = await common.getToken(request);
				const userToken = await common.siteLogin(request, token, member);
				setData = {
					'csrf-token': token.decoded_token.csrf,
					'x-access-token': userToken.token,
				};
			});

			test('should return invalid status if patch board post', (done) => {
				request.patch(`/v1/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
			});
		});
	});
};

export default patchReferenceBoardPostTest;
