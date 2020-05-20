import { agent } from 'supertest';
import app from '../../../../app';
import * as tutorCheck from '../../../check/tutor';
import * as instituteCheck from '../../../check/institute';
import * as bannerCheck from '../../../check/banner';

import * as common from '../../../component/common';

describe('ROUTER /v1/admins/tutors', () => {
	const request = agent(app);
	let setData = null;

	beforeAll(async () => {
		const token = await common.getToken(request);
		const adminToken = await common.adminLogin(request, token);
		setData = {
			'csrf-token': token.decoded_token.csrf,
			'x-access-token': adminToken.token,
		};
	});

	// 강사 상세 조회
	describe('GET /v1/admins/tutors/:tutor_id', () => {
		const memberId = 114443;

		test('should return Invalid status if wrong tutor_id', (done) => {
			request
				.get(`/v1/admins/tutors/9999999`)
				.set(setData)
				.expect(500, done);
		});

		test('should return Invalid status if tutor_id not number', (done) => {
			request
				.get(`/v1/admins/tutors/not_number`)
				.set(setData)
				.expect(500, done);
		});

		test('should return tutor data if success get tutor', (done) => {
			request
				.get(`/v1/admins/tutors/${memberId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const { tutor } = res.body;

					tutorCheck.checkTutor(tutor);
					tutorCheck.checkTutorAttribute(tutor.attribute);
					return done();
				});
		});
	});

	// 강사 등록
	describe('POST /v1/admins/tutors', () => {
		// eslint-disable-next-line
		let sendData = null;

		beforeEach(() => {
			sendData = {
				name: '이름 등록하기',
				sex: 'man',
				message: '소개 메세지',
				tags: '["실험용 데이터", "하나 더 넣기"]',
				memo: '메모 등록하기',
			};
		});

		test('should return invalid status if sex is not exist', (done) => {
			sendData.sex = 'exist';
			request
				.post(`/v1/admins/tutors`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if sex is empty', (done) => {
			delete sendData.sex;
			request
				.post(`/v1/admins/tutors`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if tags is not json', (done) => {
			sendData.tags = ['실험용 데이터'];
			request
				.post(`/v1/admins/tutors`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test.skip('should return tutor data if success create tutor', (done) => {
			request
				.post(`/v1/admins/tutors`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { tutor } = res.body;
					tutorCheck.checkTutor(tutor);

					return done();
				});
		});
	});

	// 강사 목록 조회
	describe('GET /v1/admins/tutors', () => {
		let searchField = null;

		beforeEach(() => {
			searchField = { name: '김', sex: 'man', major: 20, is_confirm: 'Y', is_match: 'N', page: 1, limit: 10 };
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'page';
			request
				.get(`/v1/admins/tutors?page=${searchField.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'limit';
			request
				.get(`/v1/admins/tutors?limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if sex is not exist', (done) => {
			searchField.sex = 'notSex';
			request
				.get(`/v1/admins/tutors?sex=${searchField.sex}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if major is not exist', (done) => {
			searchField.major = 999999;
			request
				.get(`/v1/admins/tutors?major=${searchField.major}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return tutor data if name search', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors?name=${searchField.name}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);

						// 강사가 들고 있는 과목들 검사
						for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('should return tutor data if sex search', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors?sex=${searchField.sex}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
						// 강사가 들고 있는 과목들 검사
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						if (tutorList[i].institute) for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('should return tutor data if major search', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors?major=${searchField.major}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
						// 강사가 들고 있는 과목들 검사
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						if (tutorList[i].institute) for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('should return tutor data if is_confirm search', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors?is_confirm=${searchField.is_confirm}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
						// 강사가 들고 있는 과목들 검사
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						if (tutorList[i].institute) for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('should return tutor data if is_match search', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors?is_match=${searchField.is_match}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
						// 강사가 들고 있는 과목들 검사
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						if (tutorList[i].institute) for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('should return tutor data if all search', (done) => {
			request
				.get(
					encodeURI(
						`/v1/admins/tutors?name=${searchField.name}&sex=${searchField.sex}&major=${searchField.major}&is_confirm=${searchField.is_confirm}&page=${searchField.page}&limit=${searchField.limit}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
						// 강사가 들고 있는 과목들 검사
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						if (tutorList[i].institute) for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('should return tutor data if no searchField', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						tutorCheck.checkTutorList(tutorList[i]);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
						// 강사가 들고 있는 과목들 검사
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);

						// 강사가 속한 기관들 검사
						if (tutorList[i].institute) for (let k = 0; k < tutorList[i].institute.length; k += 1) instituteCheck.checkInstitute(tutorList[i].institute[k]);
					}
					return done();
				});
		});

		test('shoud return null if page 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/tutors?page=${searchField.page}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('shoud return null if limit 20', (done) => {
			searchField.limit = 20;
			request
				.get(`/v1/admins/tutors?limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body.list.length).toEqual(20);
					return done();
				});
		});
	});

	// 강사 상세 정보 수정
	describe('PATCH /v1/admins/tutors/:tutor_id', () => {
		let tutorId = 1;
		let sendData = null;

		beforeEach(() => {
			tutorId = 1;
			sendData = {
				name: '이름 수정',
				is_deleted: 'N',
				sex: 'man',
				message: '메시지 수정',
				tags: '["태그3", "태그4", "태그5"]',
				memo: '메모 수정',
			};
		});

		test('should return invalid status if tutor_id is 9999999999', (done) => {
			tutorId = 9999999999;
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ message: null })
				.expect(500, done);
		});

		test('should return invalid status if message is null', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ message: null })
				.expect(500, done);
		});

		test('should return invalid status if tags is null', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ tags: null })
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is not exist', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ is_deleted: 'is_deleted' })
				.expect(500, done);
		});

		test('should return invalid status if is_deleted is null', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ is_deleted: null })
				.expect(500, done);
		});

		test('should return invalid status if sex is not exist', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ sex: 'sex' })
				.expect(500, done);
		});

		test('should return invalid status if sex is null', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ sex: null })
				.expect(500, done);
		});

		test('should return null if tutor memo data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ memo: sendData.memo })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if tutor tags data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ tags: sendData.tags })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if tutor message data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ message: sendData.message })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if tutor sex data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ sex: sendData.sex })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if tutor is_deleted data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ is_deleted: sendData.is_deleted })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if tutor name data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
				.set(setData)
				.send({ name: sendData.name })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test('should return null if tutor all data success update', (done) => {
			request
				.patch(`/v1/admins/tutors/${tutorId}`)
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

	// 기관 소속 강사 목록 조회
	describe('GET /v1/admins/tutors/affiliation/:institute_id/institute', () => {
		let searchField = null;

		beforeEach(() => {
			searchField = {
				instituteId: 1,
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if institute is not exist', (done) => {
			searchField.instituteId = 99999999;
			request
				.get(`/v1/admins/tutors/affiliation/${searchField.instituteId}/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'page';
			request
				.get(`/v1/admins/tutors/affiliation/${searchField.instituteId}/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'limit';
			request
				.get(`/v1/admins/tutors/affiliation/${searchField.instituteId}/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 99999999', (done) => {
			searchField.page = 99999999;
			request
				.get(`/v1/admins/tutors/affiliation/${searchField.instituteId}/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return list length 20 if limit is 20', (done) => {
			searchField.limit = 20;
			request
				.get(`/v1/admins/tutors/affiliation/${searchField.instituteId}/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body.list.length).toEqual(searchField.limit);

					return done();
				});
		});

		test('should return tutor datas if success get tutor data', (done) => {
			request
				.get(`/v1/admins/tutors/affiliation/${searchField.instituteId}/institute?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorList.length; i += 1) {
						if (tutorList[i].subject) for (let j = 0; j < tutorList[i].subject.length; j += 1) tutorCheck.checkSubject(tutorList[i].subject[j]);
						if (tutorList[i].tutor_sort) for (let j = 0; j < tutorList[i].tutor_sort.length; j += 1) tutorCheck.checkTutorSort(tutorList[i].tutor_sort[j]);
						tutorCheck.checkReviewFollowCount(tutorList[i].count);
						tutorCheck.checkTutorAttribute(tutorList[i].attribute);
					}

					return done();
				});
		});
	});

	// 강사 인덱스를 기준으로 강사 승인 상태 승인 처리
	describe('POST /v1/admins/tutors/confirm/:tutor_id/approval', () => {
		let tutorId = null;
		beforeEach(() => {
			tutorId = 1;
		});

		test('should return invalid status if tutor_id is not exist', (done) => {
			tutorId = 99999999;
			request
				.post(`/v1/admins/tutors/confirm/${tutorId}/approval`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			tutorId = 'tutorId';
			request
				.post(`/v1/admins/tutors/confirm/${tutorId}/approval`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success tutor status confirm', (done) => {
			request
				.post(`/v1/admins/tutors/confirm/${tutorId}/approval`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});
	});

	// 강사 인덱스를 기준으로 강사 승인 상태 반려 처리
	describe('PATCH /v1/admins/tutors/confirm/:tutor_id/reject', () => {
		let tutorId = null;
		beforeEach(() => {
			tutorId = 1;
		});

		test('should return invalid status if tutor_id is not exist', (done) => {
			tutorId = 99999999;
			request
				.patch(`/v1/admins/tutors/confirm/${tutorId}/reject`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			tutorId = 'tutorId';
			request
				.patch(`/v1/admins/tutors/confirm/${tutorId}/reject`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null fi success tutor status reject', (done) => {
			request
				.patch(`/v1/admins/tutors/confirm/${tutorId}/reject`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});
	});

	// 강사 인덱스를 기준으로 강사 승인 상태 블라인드 처리
	describe('PATCH /v1/admins/tutors/confirm/:tutor_id/blind', () => {
		let tutorId = null;
		beforeEach(() => {
			tutorId = 1;
		});

		test('should return invalid status if tutor_id is not exist', (done) => {
			tutorId = 99999999;
			request
				.patch(`/v1/admins/tutors/confirm/${tutorId}/blind`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			tutorId = 'tutorId';
			request
				.patch(`/v1/admins/tutors/confirm/${tutorId}/blind`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null fi success tutor status reject', (done) => {
			request
				.patch(`/v1/admins/tutors/confirm/${tutorId}/blind`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});
	});

	// 강사에 연결된 기관 연결 정보 삭제
	describe('DELETE /v1/admins/tutors/institute/:tutor_institute_id/elimination', () => {
		let tutorInstituteId = null;

		beforeEach(() => {
			tutorInstituteId = 119195;
		});

		test('should return invalid status if tutor_institute_id is not exist', (done) => {
			tutorInstituteId = 9999999;
			request
				.delete(`/v1/admins/tutors/institute/${tutorInstituteId}/elimination`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_institute_id is not number', (done) => {
			tutorInstituteId = 'tutor_insititute_id';
			request
				.delete(`/v1/admins/tutors/institute/${tutorInstituteId}/elimination`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success delete tutor institute', (done) => {
			request
				.delete(`/v1/admins/tutors/institute/${tutorInstituteId}/elimination`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});
	});

	// 강사명 존재 여부 확인
	describe('GET /v1/admins/tutors/name/:name/existence', () => {
		let tutorName = null;

		beforeEach(() => {
			tutorName = '이선재';
		});

		test('should return true if tutor name is not exist', (done) => {
			tutorName = '절대있을수없는강사이름';
			request
				.get(encodeURI(`/v1/admins/tutors/name/${tutorName}/existence`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const exist = res.body.existence;

					expect(exist).toEqual(false);
					return done();
				});
		});

		test('should return true if tutor name exist', (done) => {
			request
				.get(encodeURI(`/v1/admins/tutors/name/${tutorName}/existence`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const exist = res.body.existence;

					expect(exist).toEqual(true);
					return done();
				});
		});
	});

	// 강사 메이저 레벨 수정
	describe('PATCH /v1/admins/tutors/major/:tutor_id/filter/:filter_id', () => {
		let ids = null;
		beforeEach(() => {
			ids = {
				tutor_id: 1,
				filter_id: 317,
			};
		});

		test('should return invalid status if tutor_id is not exist', (done) => {
			ids.tutor_id = 9999999;
			request
				.patch(`/v1/admins/tutors/major/${ids.tutor_id}/filter/${ids.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			ids.tutor_id = 'tutor_id';
			request
				.patch(`/v1/admins/tutors/major/${ids.tutor_id}/filter/${ids.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not exist', (done) => {
			ids.filter_id = 9999999;
			request
				.patch(`/v1/admins/tutors/major/${ids.tutor_id}/filter/${ids.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id is not number', (done) => {
			ids.filter_id = 'filter_id';
			request
				.patch(`/v1/admins/tutors/major/${ids.tutor_id}/filter/${ids.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success tutor update major filter', (done) => {
			request
				.patch(`/v1/admins/tutors/major/${ids.tutor_id}/filter/${ids.filter_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});
	});

	// 강사 기관 연결
	describe.skip('POST /v1/admins/tutors/:tutor_id/institute/:institute_id', () => {
		const ids = {
			tutor_id: 20,
			institute_id: 18,
		};
		let sendData = null;
		beforeEach(() => {
			ids.tutor_id += 1;

			sendData = {
				is_current: 'Y',
				join_at: '2019-01-01',
				retire_at: '2019-02-03',
				sort_no: 1,
			};
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			request
				.post(`/v1/admins/tutors/tutor_id/institute/${ids.institute_id}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is not exist', (done) => {
			request
				.post(`/v1/admins/tutors/9999999/institute/${ids.institute_id}`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if insitute_id is not number', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/institute_id`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if insitute_id is not exist', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/9999999`)
				.set(setData)
				.send(sendData)
				.expect(500, done);
		});

		test('should return invalid status if join_at is wrong date format', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ join_at: '20191-01-01' })
				.expect(500, done);
		});

		test('should return invalid status if retire_at is wrong date format', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ retire_at: '20191-01-01' })
				.expect(500, done);
		});

		test('should return invalid status if is_current is not exist data', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ is_current: 'is_current' })
				.expect(500, done);
		});

		test('should return invalid status if sort_no is not number', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ sort_no: 'sort_no' })
				.expect(500, done);
		});

		test('should return null if success all sendData post tutor institute', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send(sendData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if success is_current sendData post tutor institute', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ is_current: sendData.is_current })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if success join_at sendData post tutor institute', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ join_at: sendData.join_at })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if success retire_at sendData post tutor institute', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ retire_at: sendData.retire_at })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if success sort_no sendData post tutor institute', (done) => {
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.send({ sort_no: sendData.sort_no })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});

		test('should return null if success no sendData post tutor institute', (done) => {
			ids.institute_id += 1;
			request
				.post(`/v1/admins/tutors/${ids.tutor_id}/institute/${ids.institute_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					return done();
				});
		});
	});

	// 배너 인덱스로 배너에 연결된 강사 목록 조회
	describe('POST /v1/admins/tutors/banner/:banner_id', () => {
		let bannerId = null;
		let searchField = null;
		beforeEach(() => {
			bannerId = 13;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return null if page is 9999999', (done) => {
			searchField.page = 9999999;
			request
				.get(`/v1/admins/tutors/banner/${bannerId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.body).toEqual(null);
					return done();
				});
		});

		test.skip('should return tutors length 20 if limit is 20(배너에 묶여 있는 강사가 각 하나씩 밖에 없어서 테스트 불가능)', (done) => {
			searchField.limit = 20;
			request
				.get(`/v1/admins/tutors/banner/${bannerId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					const tutorList = res.body.list;

					expect(tutorList.length).toEqual(searchField.limit);
					return done();
				});
		});

		test('should return invalid status if banner_id is not exist', (done) => {
			bannerId = 9999999;
			request
				.get(`/v1/admins/tutors/banner/${bannerId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return tutors if success get tutor datas', (done) => {
			request
				.get(`/v1/admins/tutors/banner/${bannerId}?page=${searchField.page}&limit=${searchField.limit}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const tutorBannerList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < tutorBannerList.length; i += 1) {
						tutorCheck.checkTutorBannerList(tutorBannerList[i]);
						tutorCheck.checkTutor(tutorBannerList[i].tutor);
						tutorCheck.checkTutorAttribute(tutorBannerList[i].tutor.attribute);
						bannerCheck.checkBanner(tutorBannerList[i].banner);
					}
					return done();
				});
		});
	});
});
