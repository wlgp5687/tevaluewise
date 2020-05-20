import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as boardCheck from '../../../check/board';
import * as filterCheck from '../../../check/filter';
import * as cafeCheck from '../../../check/cafe';

import * as common from '../../../component/common';

const patchReferenceBoardPostTest = () => {
	// 자료실 게시판 게시글 수정
	describe('PATCH /v1/admins/boards/reference/:post_id', () => {
		const request = agent(app);
		let setData = null;
		let sendData = null;
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
			sendData = {
				is_notice: 'N',
				allow_scroll: 'N',
				title: '제목 수정해보기',
				contents: '내용 수정해보기',
				lv1_id: 317,
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

		test('should return invalid status if is_notice is not string', (done) => {
			sendData.is_notice = 1234;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if is_notice is not exist', (done) => {
			sendData.is_notice = 'isNotExist';
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if is_notice is null', (done) => {
			sendData.is_notice = null;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if allow_scroll is not string', (done) => {
			sendData.allow_scroll = 1234;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if allow_scroll is not exist', (done) => {
			sendData.allow_scroll = 'isNotExist';
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if allow_scroll is null', (done) => {
			sendData.allow_scroll = null;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if title is not string', (done) => {
			sendData.title = 1234;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if title is null', (done) => {
			sendData.title = null;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if contents is not string', (done) => {
			sendData.contents = 1234;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if contents is null', (done) => {
			sendData.contents = null;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if lv1_id is not number', (done) => {
			sendData.lv1_id = 'isNotNumber';
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if lv1_id is not exist', (done) => {
			sendData.lv1_id = 9999999;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if lv1_id is null', (done) => {
			sendData.lv1_id = null;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if board_attach_file is null', (done) => {
			sendData.board_attach_file = null;
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return invalid status if board_attach_file is not json', (done) => {
			sendData.board_attach_file = JSON.parse(sendData.board_attach_file);
			request.patch(`/v1/admins/boards/reference/${postId}`).set(setData).send(sendData).expect(500, done);
		});

		test('should return null if no is_notice success patch reference', (done) => {
			delete sendData.is_notice;
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if no allow_scroll success patch reference', (done) => {
			delete sendData.allow_scroll;
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if no title success patch reference', (done) => {
			delete sendData.title;
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if no contents success patch reference', (done) => {
			delete sendData.contents;
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if no lv1_id success patch reference', (done) => {
			delete sendData.lv1_id;
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if no board_attach_file success patch reference', (done) => {
			delete sendData.board_attach_file;
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if is_notice is "Y" success patch reference', (done) => {
			sendData.is_notice = 'Y';
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if allow_scroll is "Y" success patch reference', (done) => {
			sendData.allow_scroll = 'Y';
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if all body success patch reference', (done) => {
			request
				.patch(`/v1/admins/boards/reference/${postId}`)
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
};

export default patchReferenceBoardPostTest;
