import { agent } from 'supertest';
import app from '../../../../app';
import * as instituteCheck from '../../../check/institute';
import * as subjectCheck from '../../../check/subject';

import * as common from '../../../component/common';

const getInstituteBelongToTutor = () => {
	// 강사 소속 기관 조회
	describe('GET /v1/admins/institutes/affiliation/:tutor_id/tutor', () => {
		const request = agent(app);
		let setData = null;
		let tutorId = null;
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
			tutorId = 3;
			searchfield = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if tutor_id is not number', (done) => {
			tutorId = 'not number';
			request
				.get(`/v1/admins/institutes/affiliation/${tutorId}/tutor`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is invalid', (done) => {
			tutorId = 999999999;
			request
				.get(`/v1/admins/institutes/affiliation/${tutorId}/tutor`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid status if tutor_id is null', (done) => {
			tutorId = null;
			request
				.get(`/v1/admins/institutes/affiliation/${tutorId}/tutor`)
				.set(setData)
				.send(searchfield)
				.expect(500, done);
		});

		test('should return invalid stats if page is not number', (done) => {
			searchfield.page = 'isNotNumber';
			request
				.get(`/v1/admins/institutes/affiliation/${tutorId}/tutor?page=${searchfield.page}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if page is 9999999', (done) => {
			searchfield.page = '9999999';
			request
				.get(`/v1/admins/institutes/affiliation/${tutorId}/tutor?page=${searchfield.page}`)
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
				.get(`/v1/admins/institutes/affiliation/${tutorId}/tutor?limit=${searchfield.limit}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return institutes if success get institutes belong to tutor', (done) => {
			request
				.get(encodeURI(`/v1/admins/institutes/affiliation/${tutorId}/tutor?page=${searchfield.page}&limit=${searchfield.limit}`))
				.set(setData)
				.send(searchfield)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const institutesBelongTutor = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < institutesBelongTutor.length; i += 1) {
						// 기관 체크
						instituteCheck.checkInstitute(institutesBelongTutor[i]);
						instituteCheck.checkInstituteAttribute(institutesBelongTutor[i].attribute);
						instituteCheck.checkInstituteCount(institutesBelongTutor[i].count);
						instituteCheck.checkInstituteSort(institutesBelongTutor[i].institute_sort);

						// 과목 체크
						if (institutesBelongTutor[i].subject) for (let j = 0; j < institutesBelongTutor[i].subject.length; j += 1) subjectCheck.checkSubject(institutesBelongTutor[i].subject[j]);

						return done();
					}
				});
		});
	});
};

export default getInstituteBelongToTutor;
