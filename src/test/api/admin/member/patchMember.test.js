import { agent } from 'supertest';
import app from '../../../../app';

import * as common from '../../../component/common';

const patchMemberTest = () => {
	describe('PATCH /v1/admins/members/:member_id', () => {
		const request = agent(app);
		let setData = null;
		let memberId = null;
		let sendData = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			memberId = 6705;
			sendData = {
				password: '!1abcdefghijklmn',
				member_name: '수정이름',
				sex: 'man',
				birthday: '2020-02-13',
				email: 'test@naver.com',
				phone: '010-2213-3321',
				label: '주소록명칭 수정',
				address_name: '아무개',
				address_base: '기본 주소',
				address_detail: '상세 주소',
				memo: '회원 메모',
			};
		});

		test('should return invalid status if password length 9', (done) => {
			sendData.password = '!1abcdefg';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ password: sendData.password })
				.expect(500, done);
		});

		test('should return invalid status if password length 21', (done) => {
			sendData.password = '!1abcdefgafeqwasjfiew';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ password: sendData.password })
				.expect(500, done);
		});

		test('should return invalid status if password not contain number', (done) => {
			sendData.password = '!abcdefghijklmnaf';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ password: sendData.password })
				.expect(500, done);
		});

		test('should return invalid status if password not contain english', (done) => {
			sendData.password = '!12341234566';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ password: sendData.password })
				.expect(500, done);
		});

		test('should return invalid status if password not contain special character', (done) => {
			sendData.password = '1234asgeww66';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ password: sendData.password })
				.expect(500, done);
		});

		test('should return null if password success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ password: sendData.password })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if member_name success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ member_name: sendData.member_name })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if sex is human', (done) => {
			sendData.sex = 'human';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ sex: sendData.sex })
				.expect(500, done);
		});

		test('should return null if sex is man success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ sex: sendData.sex })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if sex is woman success patch member', (done) => {
			sendData.sex = 'woman';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ sex: sendData.sex })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if sex is unknown success patch member', (done) => {
			sendData.sex = 'unknown';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ sex: sendData.sex })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if sex is unknown success patch member', (done) => {
			sendData.sex = 'unknown';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ sex: sendData.sex })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if birthday wrong date format', (done) => {
			sendData.birthday = '2020-011-01';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ birthday: sendData.birthday })
				.expect(500, done);
		});

		test('should return null if birthday success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ birthday: sendData.birthday })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if email wrong email format "2020-011-01"', (done) => {
			sendData.email = '2020-011-01';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ email: sendData.email })
				.expect(500, done);
		});

		test('should return invalid status if email wrong email format "testafs"', (done) => {
			sendData.email = 'testafs';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ email: sendData.email })
				.expect(500, done);
		});

		test('should return invalid status if email wrong email format "testafs@naver"', (done) => {
			sendData.email = 'testafs@naver';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ email: sendData.email })
				.expect(500, done);
		});

		test('should return null if email success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ email: sendData.email })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return invalid status if phone wrong phone format "phoneTest"', (done) => {
			sendData.phone = 'phoneTest';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ phone: sendData.phone })
				.expect(500, done);
		});

		test('should return invalid status if phone wrong phone format "01033111234"', (done) => {
			sendData.phone = '01033111234';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ phone: sendData.phone })
				.expect(500, done);
		});

		test('should return invalid status if phone wrong phone format "010-22331234"', (done) => {
			sendData.phone = '010-22331234';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ phone: sendData.phone })
				.expect(500, done);
		});

		test('should return invalid status if phone wrong phone format "010-22333-1234"', (done) => {
			sendData.phone = '010-22333-1234';
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ phone: sendData.phone })
				.expect(500, done);
		});

		test('should return null if phone success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ phone: sendData.phone })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if label success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ label: sendData.label })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if address_name success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ address_name: sendData.address_name })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if address_base success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ address_base: sendData.address_base })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if address_detail success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ address_detail: sendData.address_detail })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if memo success patch member', (done) => {
			request
				.patch(`/v1/admins/members/${memberId}`)
				.set(setData)
				.send({ memo: sendData.memo })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});
	});
};

export default patchMemberTest;
