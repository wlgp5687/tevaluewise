import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';

import * as common from '../../../component/common';

const getMembersTest = () => {
	describe('GET /v1/admins/members/', () => {
		const request = agent(app);
		let setData = null;
		let searchfield = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			searchfield = {
				page: 1,
				limit: 10,
				id: 15,
				user_id: 'bc',
				join_site: 'naver',
				join_type: 'student',
				name: '원',
				email: 'em',
				phone: '01',
				orderby: '',
				tutor_match: 'N',
				institute_match: 'N',
				cafe_match: 'N',
			};
		});

		test('should return invalid stats if page is not number', (done) => {
			searchfield.page = 'isNotNumber';
			request
				.get(`/v1/admins/members?page=${searchfield.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchfield.page = '9999999';
			request
				.get(`/v1/admins/members?page=${searchfield.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if limit is not number', (done) => {
			searchfield.limit = 'is not number';
			request
				.get(`/v1/admins/members?limit=${searchfield.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members length 20 if limit is 20', (done) => {
			searchfield.limit = 20;
			request
				.get(`/v1/admins/members?limit=${searchfield.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(20);
					return done();
				});
		});

		test('should return invalid status if id is not number', (done) => {
			searchfield.id = 'isNotNumber';
			request
				.get(`/v1/admins/members?id=${searchfield.id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if id is null', (done) => {
			searchfield.id = null;
			request
				.get(`/v1/admins/members?id=${searchfield.id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members if searchfield id success get members', (done) => {
			request
				.get(`/v1/admins/members?id=${searchfield.id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield user_id success get members', (done) => {
			request
				.get(`/v1/admins/members?user_id=${searchfield.user_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return invalid status if searchfield join_site is google', (done) => {
			searchfield.join_site = 'google';
			request
				.get(`/v1/admins/members?join_site=${searchfield.join_site}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members if searchfield join_site is naver success get members', (done) => {
			request
				.get(`/v1/admins/members?join_site=${searchfield.join_site}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield join_site is kakao success get members', (done) => {
			searchfield.join_site = 'kakao';
			request
				.get(`/v1/admins/members?join_site=${searchfield.join_site}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield join_site is facebook success get members', (done) => {
			searchfield.join_site = 'facebook';
			request
				.get(`/v1/admins/members?join_site=${searchfield.join_site}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield join_site is site success get members', (done) => {
			searchfield.join_site = 'site';
			request
				.get(`/v1/admins/members?join_site=${searchfield.join_site}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return invalid status if searchfield join_type is human', (done) => {
			searchfield.join_type = 'human';
			request
				.get(`/v1/admins/members?join_type=${searchfield.join_type}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if searchfield join_type is null', (done) => {
			searchfield.join_type = null;
			request
				.get(`/v1/admins/members?join_type=${searchfield.join_type}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members if searchfield join_type is sutdent success get members', (done) => {
			request
				.get(`/v1/admins/members?join_type=${searchfield.join_type}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield join_type is parent success get members', (done) => {
			searchfield.join_type = 'parent';
			request
				.get(`/v1/admins/members?join_type=${searchfield.join_type}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield join_type is tutor success get members', (done) => {
			searchfield.join_type = 'tutor';
			request
				.get(`/v1/admins/members?join_type=${searchfield.join_type}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield join_type is institute success get members', (done) => {
			searchfield.join_type = 'institute';
			request
				.get(`/v1/admins/members?join_type=${searchfield.join_type}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield name is institute success get members', (done) => {
			request
				.get(encodeURI(`/v1/admins/members?name=${searchfield.name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield email is institute success get members', (done) => {
			request
				.get(`/v1/admins/members?email=${searchfield.email}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield phone is institute success get members', (done) => {
			request
				.get(`/v1/admins/members?phone=${searchfield.phone}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return invalid status if searchfield orderby is minimum', (done) => {
			searchfield.orderby = 'minimum';
			request
				.get(`/v1/admins/members?orderby=${searchfield.orderby}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members if searchfield orderby is min_connect_count', (done) => {
			searchfield.orderby = 'min_connect_count';
			request
				.get(`/v1/admins/members?orderby=${searchfield.orderby}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield orderby is max_connect_count', (done) => {
			searchfield.orderby = 'max_connect_count';
			request
				.get(`/v1/admins/members?orderby=${searchfield.orderby}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield orderby is last_join_at', (done) => {
			searchfield.orderby = 'last_join_at';
			request
				.get(`/v1/admins/members?orderby=${searchfield.orderby}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield orderby is first_join_at', (done) => {
			searchfield.orderby = 'first_join_at';
			request
				.get(`/v1/admins/members?orderby=${searchfield.orderby}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return invalid status if searchfield tutor_match is NO', (done) => {
			searchfield.tutor_match = 'NO';
			request
				.get(`/v1/admins/members?tutor_match=${searchfield.tutor_match}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members if searchfield tutor_match is N', (done) => {
			searchfield.tutor_match = 'N';
			request
				.get(`/v1/admins/members?tutor_match=${searchfield.tutor_match}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield tutor_match is Y', (done) => {
			searchfield.tutor_match = 'Y';
			request
				.get(`/v1/admins/members?tutor_match=${searchfield.tutor_match}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return invalid stauts if searchfield institute_match is NO', (done) => {
			searchfield.institute_match = 'NO';
			request
				.get(`/v1/admins/members?institute_match=${searchfield.institute_match}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return members if searchfield institute_match is N', (done) => {
			searchfield.institute_match = 'N';
			request
				.get(`/v1/admins/members?institute_match=${searchfield.institute_match}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if searchfield institute_match is Y', (done) => {
			searchfield.institute_match = 'Y';
			request
				.get(`/v1/admins/members?institute_match=${searchfield.institute_match}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return invalid stauts if searchfield cafe_match is NO', (done) => {
			searchfield.cafe_match = 'NO';
			request
				.get(`/v1/admins/members?cafe_match=${searchfield.cafe_match}`)
				.set(setData)
				.expect(500, done);
		});

		test.skip('should return members if searchfield cafe_match is N (현재 카페 기능이 개발되지 않아서 테스트 불가)', (done) => {
			searchfield.cafe_match = 'N';
			request
				.get(`/v1/admins/members?cafe_match=${searchfield.cafe_match}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test.skip('should return members if searchfield cafe_match is Y (현재 카페 기능이 개발되지 않아서 테스트 불가)', (done) => {
			searchfield.cafe_match = 'Y';
			request
				.get(`/v1/admins/members?cafe_match=${searchfield.cafe_match}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if no searchfield success get members', (done) => {
			request
				.get(`/v1/admins/members`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});

		test('should return members if all searchfield success get members', (done) => {
			searchfield.user_id = 's';
			searchfield.nickname = 's';
			searchfield.name = '이';
			searchfield.orderby = 'min_connect_count';
			request
				.get(
					encodeURI(
						`/v1/admins/members?page=${searchfield.page}&limit=${searchfield.limit}&user_id=${searchfield.user_id}&nickname=${searchfield.nickname}&name=${searchfield.name}&email=${searchfield.email}&phone=${searchfield.phone}&orderby=${searchfield.orderby}&tutor_match=${searchfield.tutor_match}&institute_match=${searchfield.institute_match}&cafe_match=${searchfield.cafe_match}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const memberList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < memberList.length; i += 1) {
						memberCheck.checkMember(memberList[i]);
						memberCheck.checkMemberAccess(memberList[i].access);
						memberCheck.checkMemberAttribute(memberList[i].attribute);
					}

					return done();
				});
		});
	});
};

export default getMembersTest;
