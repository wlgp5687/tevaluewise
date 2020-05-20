import { agent } from 'supertest';
import app from '../../../app';
import * as boardCheck from '../../check/board';
import * as memberCheck from '../../check/member';
import * as cafeCheck from '../../check/cafe';
import * as filterCheck from '../../check/filter';

import * as common from '../../component/common';

const getGeneralBoardPostsTest = () => {
	// 카페 일반 게시판 목록 조회
	describe('GET /v1/admins/boards/generals', () => {
		const request = agent(app);
		let setData = null;
		let searchField = null;

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
			searchField = {
				page: 1,
				limit: 10,
				lv1_id: 317,
				cafe_id: 1,
				order: 'last_at',
				search_keyword: '제',
			};
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(encodeURI(`/v1/boards/generals?page=${searchField.page}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(encodeURI(`/v1/boards/generals?page=${searchField.page}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(encodeURI(`/v1/boards/generals?limit=${searchField.limit}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(encodeURI(`/v1/boards/generals?limit=${searchField.limit}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if order is null', (done) => {
			searchField.order = null;
			request
				.get(encodeURI(`/v1/boards/generals?order=${searchField.order}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if order is not exist', (done) => {
			searchField.order = 'isNotExist';
			request
				.get(encodeURI(`/v1/boards/generals?order=${searchField.order}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if lv1_id is not exist', (done) => {
			searchField.lv1_id = 9999999;
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if lv1_id is not number', (done) => {
			searchField.lv1_id = 'isNotNumber';
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if lv1_id is null', (done) => {
			searchField.lv1_id = null;
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if lv1_id is empty', (done) => {
			delete searchField.lv1_id;
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is not exist', (done) => {
			searchField.cafe_id = 9999999;
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is not number', (done) => {
			searchField.cafe_id = 'isNotNumber';
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is null', (done) => {
			searchField.cafe_id = null;
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if cafe_id is empty', (done) => {
			delete searchField.cafe_id;
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return null status if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(encodeURI(`/v1/boards/generals?page=${searchField.page}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return posts length 1 status if limit is 1', (done) => {
			searchField.limit = 1;
			request
				.get(encodeURI(`/v1/boards/generals?limit=${searchField.limit}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return posts if no searchField success get board posts', (done) => {
			request
				.get(encodeURI(`/v1/boards/generals?lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if order is view_count searchField success get board posts', (done) => {
			searchField.order = 'view_count';
			request
				.get(encodeURI(`/v1/boards/generals?order=${searchField.order}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if order is recommend_count searchField success get board posts', (done) => {
			searchField.order = 'recommend_count';
			request
				.get(encodeURI(`/v1/boards/generals?order=${searchField.order}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if order is comment_count searchField success get board posts', (done) => {
			searchField.order = 'comment_count';
			request
				.get(encodeURI(`/v1/boards/generals?order=${searchField.order}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if page searchField success get board posts', (done) => {
			request
				.get(encodeURI(`/v1/boards/generals?page=${searchField.page}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if limit searchField success get board posts', (done) => {
			request
				.get(encodeURI(`/v1/boards/generals?limit=${searchField.limit}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if order searchField success get board posts', (done) => {
			request
				.get(encodeURI(`/v1/boards/generals?order=${searchField.order}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if search_keyword searchField success get board posts', (done) => {
			request
				.get(encodeURI(`/v1/boards/generals?search_keyword=${searchField.search_keyword}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});

		test('should return posts if all searchField success get board posts', (done) => {
			request
				.get(
					encodeURI(
						`/v1/boards/generals?page=${searchField.page}&limit=${searchField.limit}&lv1_id=${searchField.lv1_id}&cafe_id=${searchField.cafe_id}&order=${searchField.order}&search_keyword=${searchField.search_keyword}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const posts = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < posts.length; i += 1) {
						boardCheck.checkBoardPost(posts[i]);
						memberCheck.checkMember(posts[i].member);
						memberCheck.checkMemberAttribute(posts[i].member.attribute);
						filterCheck.checkPostFilter(posts[i].post_filter);
						if (posts[i].cafe) for (let j = 0; j < posts[i].cafe.length; j += 1) cafeCheck.checkCafe(posts[i].cafe[j]);
					}
					return done();
				});
		});
	});
};

export default getGeneralBoardPostsTest;
