import { agent } from 'supertest';
import app from '../../../app';
import * as boardCheck from '../../check/board';

import * as common from '../../component/common';

const postReferenceBoardPostTest = () => {
	// 카페 자료실 게시판 게시글 작성
	describe('POST /v1/admins/boards/reference', () => {
		const request = agent(app);
		let setData = null;
		let tutorId = null;
		let tutorMemberId = null;
		let followMemberId = null;
		let unFollowMemberId = null;
		let cafeId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
			tutorId = 4063;
			tutorMemberId = 6705;
			followMemberId = 133537;
			unFollowMemberId = 25;

			// 강사 회원 비밀번호 변경
			await request.patch(`/v1/admins/members/${tutorMemberId}`).set(setData).send({ password: process.env.TEST_USER_PASSWORD });

			// 팔로우 회원 비밀번호 변경
			await request.patch(`/v1/admins/members/${followMemberId}`).set(setData).send({ password: process.env.TEST_USER_PASSWORD });

			// 언팔로우 회원 비밀번호 변경
			await request.patch(`/v1/admins/members/${unFollowMemberId}`).set(setData).send({ password: process.env.TEST_USER_PASSWORD });
		});

		// 강사 회원일 때
		describe('tutor page master', () => {
			let sendData = null;

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
				sendData = {
					cafe_id: 1,
					title: '글쓰기 제목',
					contents: '글쓰기 내용',
					is_notice: 'Y',
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

			test('should return invalid stauts if cafe_id is not number', (done) => {
				sendData.cafe_id = 'isNotNumber';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if cafe_id is null', (done) => {
				sendData.cafe_id = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if cafe_id is undefined', (done) => {
				delete sendData.cafe_id;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if title is null', (done) => {
				sendData.title = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if title is blank', (done) => {
				sendData.title = '';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if contents is null', (done) => {
				sendData.contents = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if contents is blank', (done) => {
				sendData.contents = '';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if board_attached_file is blank', (done) => {
				sendData.board_attach_file = '';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if board_attached_file is not json', (done) => {
				sendData.board_attach_file = 1234;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is not number', (done) => {
				sendData.lv1_id = 'isNotNumber';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is null', (done) => {
				sendData.lv1_id = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is empty', (done) => {
				delete sendData.lv1_id;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is not exist', (done) => {
				sendData.lv1_id = 9999999;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if is_notice is empty', (done) => {
				delete sendData.is_notice;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if is_notice is null', (done) => {
				sendData.is_notice = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if is_notice is not exist', (done) => {
				sendData.is_notice = 'isNotExist';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return board post dataif no board_attach_file data success post board post', (done) => {
				delete sendData.board_attach_file;
				request
					.post(`/v1/boards/reference`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						const post = res.body;
						boardCheck.checkBoardPost(post);

						return done();
					});
			});

			test('should return board post dataif all body data success post board post', (done) => {
				request
					.post(`/v1/boards/reference`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						const post = res.body;
						boardCheck.checkBoardPost(post);

						return done();
					});
			});
		});

		// 강사 팔로우한 회원일 때
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
				await request.post(`/v1/follows/tutor`).set(setData).send({ tutor_id: tutorId, filter_id: 317 });
			});

			beforeEach(() => {
				sendData = {
					cafe_id: 1,
					title: '글쓰기 제목',
					contents: '글쓰기 내용',
					is_notice: 'Y',
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

			test('should return invalid stauts if cafe_id is not number', (done) => {
				sendData.cafe_id = 'isNotNumber';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if cafe_id is null', (done) => {
				sendData.cafe_id = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if cafe_id is undefined', (done) => {
				delete sendData.cafe_id;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if title is null', (done) => {
				sendData.title = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if title is blank', (done) => {
				sendData.title = '';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if contents is null', (done) => {
				sendData.contents = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if contents is blank', (done) => {
				sendData.contents = '';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if board_attached_file is blank', (done) => {
				sendData.board_attach_file = '';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if board_attached_file is not json', (done) => {
				sendData.board_attach_file = 1234;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is not number', (done) => {
				sendData.lv1_id = 'isNotNumber';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is null', (done) => {
				sendData.lv1_id = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is empty', (done) => {
				delete sendData.lv1_id;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if lv1_id is not exist', (done) => {
				sendData.lv1_id = 9999999;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if is_notice is empty', (done) => {
				delete sendData.is_notice;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if is_notice is null', (done) => {
				sendData.is_notice = null;
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return invalid stauts if is_notice is not exist', (done) => {
				sendData.is_notice = 'isNotExist';
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(500, done);
			});

			test('should return board post dataif no board_attach_file data success post board post', (done) => {
				delete sendData.board_attach_file;
				request
					.post(`/v1/boards/reference`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						const post = res.body;
						boardCheck.checkBoardPost(post);

						return done();
					});
			});

			test('should return board post dataif all body data success post board post', (done) => {
				request
					.post(`/v1/boards/reference`)
					.set(setData)
					.send(sendData)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						const post = res.body;
						boardCheck.checkBoardPost(post);

						return done();
					});
			});
		});

		// 강사 언팔 회원일 때
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

			beforeEach(() => {
				sendData = {
					cafe_id: 1,
					title: '글쓰기 제목',
					contents: '글쓰기 내용',
					is_notice: 'Y',
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

			test('should return invliad status if unfollow member status', (done) => {
				request.post(`/v1/boards/reference`).set(setData).send(sendData).expect(400, done);
			});
		});
	});
};

export default postReferenceBoardPostTest;
