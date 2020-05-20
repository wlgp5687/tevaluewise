import { agent } from 'supertest';
import app from '../../../app';
import * as instituteCheck from '../../check/institute';

import * as common from '../../component/common';

const getInstitutesCampus = () => {
	describe('GET /v1/institutes/:institute_id/campus', () => {
		const request = agent(app);
		let setData = null;
		let searchField = null;
		let instituteId = null;
		let filterId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': token.token,
			};
		});

		beforeEach(() => {
			filterId = 25;
			instituteId = 927;
			searchField = {
				page: 1,
				limit: 10,
			};
		});

		test('should return invalid status if institute is not number', (done) => {
			instituteId = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is null', (done) => {
			instituteId = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if instituteId is invalid', (done) => {
			instituteId = 999999999;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is not number', (done) => {
			searchField.page = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?page=${searchField.page}&filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if page is null', (done) => {
			searchField.page = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?page=${searchField.page}&filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is not number', (done) => {
			searchField.limit = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?limit=${searchField.limit}&filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit is null', (done) => {
			searchField.limit = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?limit=${searchField.limit}&filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is not exist', (done) => {
			filterId = 9999999;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is not number', (done) => {
			filterId = 'isNotNumber';
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filterId is null', (done) => {
			filterId = null;
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(500, done);
		});

		test('should return instituteCampus if searchfield filter success get instituteCampus', (done) => {
			request
				.get(encodeURI(`/v1/institutes/${instituteId}/campus?filter_id=${filterId}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const instituteCampus = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < instituteCampus.length; i += 1) {
						instituteCheck.checkInstitute(instituteCampus[i]);
						instituteCheck.checkInstituteAttribute(instituteCampus[i].attribute);
					}
					return done();
				});
		});
	});
};
export default getInstitutesCampus;
