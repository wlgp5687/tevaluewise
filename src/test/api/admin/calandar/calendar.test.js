import { agent } from 'supertest';
import app from '../../../../app';
import * as calendarCheck from '../../../check/calendar';
import * as filterCheck from '../../../check/filter';

import * as common from '../../../component/common';

const request = agent(app);
let setData = null;

describe('ROUTER /v1/admins/calendars', () => {
	beforeAll(async () => {
		const token = await common.getToken(request);
		const adminToken = await common.adminLogin(request, token);
		setData = {
			'csrf-token': token.decoded_token.csrf,
			'x-access-token': adminToken.token,
		};
	});

	// POST Calendar test
	describe('POST /v1/admins/calendars', () => {
		test('should return invalid status if title empty', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ start_date: '2020-01-01', end_date: '2020-01-06', filter_id: '317' })
				.expect(500, done);
		});

		test('should return invalid status if wrong start date form', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ title: '제목', start_date: '2020-001-01', end_date: '2020-01-06', filter_id: '317' })
				.expect(500, done);
		});

		test('should return invalid status if wrong end date form', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ title: '제목', start_date: '2020-01-01', end_date: '2020-001-06', filter_id: '317' })
				.expect(500, done);
		});

		test('should return invalid status if start date greator then end date', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ title: '제목', start_date: '2020-01-08', end_date: '2020-01-06', filter_id: '317' })
				.expect(500, done);
		});

		test('should return invalid status if filter_id empty', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ title: '제목', start_date: '2020-01-08', end_date: '2020-01-06' })
				.expect(500, done);
		});

		test('should return invalid status if filter_id not string', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ title: '제목', start_date: '2020-01-01', end_date: '2020-01-06', filter_id: 317 })
				.expect(500, done);
		});

		test('should return calendar data if success add calendar', (done) => {
			request
				.post('/v1/admins/calendars')
				.set(setData)
				.send({ title: 'jest 테스트용 일정 넣기', start_date: '2020-01-01', end_date: '2020-01-06', filter_id: '317' })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					calendarCheck.checkCalendar(res.body);
					done();
				});
		});
	});

	// GET Calendar test
	describe('GET /v1/admins/calendars/:calendar_id', () => {
		const calendarId = 1;

		test('should return invalid statuts if calendar_id is exists', (done) => {
			request
				.get('/v1/admins/calendars/1000')
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid statuts if calendar_id not number', (done) => {
			request
				.get('/v1/admins/calendars/asdf')
				.set(setData)
				.expect(500, done);
		});

		test('should return calendar data if success get calendar', (done) => {
			request
				.get(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					let calendar = res.body.calendar;

					// filters check
					for (let i = 0; i < calendar.filter.length; i++) filterCheck.checkGetFilter(calendar.filter[i]);

					delete calendar.filter;
					calendarCheck.checkCalendar(calendar);
					done();
				});
		});
	});

	// GET Calendars list test
	describe('GET /v1/admins/calendars', () => {
		const searchFiled = {
			page: 1,
			limit: 10,
			title: '스피킹',
			start_date: '2020-01-01',
			end_date: '2020-07-11',
			is_deleted: 'N',
			filter_id: 2,
		};

		test('should return invalid status if page not number', (done) => {
			request
				.get(`/v1/admins/calendars?page=notNumber`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if limit not number', (done) => {
			request
				.get(`/v1/admins/calendars?limit=notNumber`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if wrong start date form', (done) => {
			request
				.get(`/v1/admins/calendars?start_date=2020-001-06&end_date=${searchFiled.start_date}`)
				.set(setData)
				.expect(500, done);
		});

		test('shoud return invalid status if wrong end date form', (done) => {
			request
				.get(`/v1/admins/calendars?start_date=${searchFiled.start_date}&end_date=2020-007-31`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if start date greator then end date', (done) => {
			request
				.get(`/v1/admins/calendars?start_date=${searchFiled.start_date}&end_date=2019-01-01`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id not number', (done) => {
			request
				.get(`/v1/admins/calendars?filter_id=notNumber`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if is_deleted not enum values', (done) => {
			request
				.get(`/v1/admins/calendars?is_deleted=notEnumValues`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null data if page 99999', (done) => {
			request
				.get(`/v1/admins/calendars?page=99999`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return calendars data if no search success get calendar list', (done) => {
			request
				.get('/v1/admins/calendars')
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if filter_id get calendar list', (done) => {
			request
				.get(`/v1/admins/calendars?filter_id=${searchFiled.filter_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if filter_id, title get calendar list', (done) => {
			request
				.get(encodeURI(`/v1/admins/calendars?filter_id=${searchFiled.filter_id}&title=${searchFiled.title}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if filter_id, title, start_end_date get calendar list', (done) => {
			request
				.get(encodeURI(`/v1/admins/calendars?filter_id=${searchFiled.filter_id}&title=${searchFiled.title}&start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if filter_id, title, start_end_date, deleted get calendar list', (done) => {
			request
				.get(
					encodeURI(
						`/v1/admins/calendars?filter_id=${searchFiled.filter_id}&title=${searchFiled.title}&start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}&is_deleted=${searchFiled.is_deleted}`,
					),
				)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calednars data if title get calendar list', (done) => {
			request
				.get(encodeURI(`/v1/admins/calendars?title=${searchFiled.title}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if title, start_end_date get calendar list', (done) => {
			request
				.get(encodeURI(`/v1/admins/calendars?title=${searchFiled.title}&start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if title, start_end_date, deleted get calendar list', (done) => {
			request
				.get(encodeURI(`/v1/admins/calendars?title=${searchFiled.title}&start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}&is_deleted=${searchFiled.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});

		test('should return calendars data if start_end_date, deleted get calendar list', (done) => {
			request
				.get(encodeURI(`/v1/admins/calendars?start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}&is_deleted=${searchFiled.is_deleted}`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const calendars = res.body;
					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);

					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}
					done();
				});
		});
	});

	// PATCH Calendar test
	describe('PATCH /v1/admins/calendars/:calendar_id', () => {
		const calendarId = 1;
		const sendBody = {
			title: '수정하고 싶은 제목',
			start_date: '2020-01-06',
			end_date: '2020-01-12',
			url: 'https//naver.com',
			is_blank: 'Y',
			sort_no: 2,
		};

		test('should return invalid status if title null', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ title: null })
				.expect(500, done);
		});

		test('should return invalid status if wrong start_date form', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: '2020-01-0002', end_date: '2020-01-22' })
				.expect(500, done);
		});

		test('should return invalid status if wrong end_date form', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: '2020-01-02', end_date: '2020-01-222' })
				.expect(500, done);
		});

		test('should return invalid status if start_date greator then end_date', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: '2020-01-26', end_date: '2020-01-22' })
				.expect(500, done);
		});

		test('should return invalid status if is_blank not enum value', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ is_blank: 'NO' })
				.expect(500, done);
		});

		test('should return invalid status if sort_no not number', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ sort_no: 'string' })
				.expect(500, done);
		});

		test('should return null if title patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ title: sendBody.title })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if date patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: sendBody.start_date, end_date: sendBody.end_date })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if url patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ url: sendBody.url })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if is_blank patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ is_blank: sendBody.is_blank })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if sort_no patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ sort_no: sendBody.sort_no })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if title, start,end_date patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ title: sendBody.title, start_date: sendBody.start_date, end_date: sendBody.end_date })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if title, start,end_date, url patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ title: sendBody.title, start_date: sendBody.start_date, end_date: sendBody.end_date, url: sendBody.url })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if title, start,end_date, url, is_blank patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ title: sendBody.title, start_date: sendBody.start_date, end_date: sendBody.end_date, url: sendBody.url, is_blank: sendBody.is_blank })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if title, start,end_date, url, is_blank, sort_no patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ title: sendBody.title, start_date: sendBody.start_date, end_date: sendBody.end_date, url: sendBody.url, is_blank: sendBody.is_blank, sort_no: sendBody.sort_no })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if start,end_date, url patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: sendBody.start_date, end_date: sendBody.end_date, url: sendBody.url })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if start,end_date, url, is_blank patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: sendBody.start_date, end_date: sendBody.end_date, url: sendBody.url, is_blank: sendBody.is_blank })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if start,end_date, url, is_blank, sort_no patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ start_date: sendBody.start_date, end_date: sendBody.end_date, url: sendBody.url, is_blank: sendBody.is_blank, sort_no: sendBody.sort_no })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if url, is_blank patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ url: sendBody.url, is_blank: sendBody.is_blank })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if url, is_blank, sort_no patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ url: sendBody.url, is_blank: sendBody.is_blank, sort_no: sendBody.sort_no })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if is_blank, sort_no patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send({ is_blank: sendBody.is_blank, sort_no: sendBody.sort_no })
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});

		test('should return null if all attributes patch calendar', (done) => {
			request
				.patch(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.send(sendBody)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});
	});

	// DELETE Calendar test
	describe('DELETE /v1/admins/calendars/:calendar_id', () => {
		const calendarId = 791;

		test('should return invalid status if no exists calendar', (done) => {
			request
				.delete(`/v1/admins/calendars/9999`)
				.set(setData)
				.expect(500, done);
		});
		test('should return null if success delete calendar', (done) => {
			request
				.delete(`/v1/admins/calendars/${calendarId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);
					done();
				});
		});
	});

	//POST CalendarFilter test
	describe('POST /v1/admins/calendras/:calendar_id/filter/:filter_id', () => {
		const calendarId = 1;
		const filterId = 317;

		test('should return invalid status if calendar_id not number', (done) => {
			request
				.post(`/v1/admins/calendars/afaeg/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id not number', (done) => {
			request
				.post(`/v1/admins/calendars/${calendarId}/filter/ageaf`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if no exists calendar_id', (done) => {
			request
				.post(`/v1/admins/calendars/99999/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if no exists filter_id', (done) => {
			request
				.post(`/v1/admins/calendars/${calendarId}/filter/999999`)
				.set(setData)
				.expect(500, done);
		});

		test('should return calendarFilter data if success post calendarFilter', (done) => {
			request
				.post(`/v1/admins/calendars/${calendarId}/filter/${filterId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					calendarCheck.checkCalendarFilter(res.body.calendar_filter);

					done();
				});
		});

		test('should return invalid status if exists calendarFilter', (done) => {
			request
				.post(`/v1/admins/calendars/${calendarId}/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});
	});

	// DELETE CalendrFilter test
	describe('DELETE /v1/admins/calendars/:calendar_id/filter/filter_id', () => {
		const calendarId = 1;
		const filterId = 317;

		test('should return invalid status if calendar_id not number', (done) => {
			request
				.delete(`/v1/admins/calendars/string/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id not number', (done) => {
			request
				.delete(`/v1/admins/calendars/string/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if no exists calendar_id', (done) => {
			request
				.delete(`/v1/admins/calendars/99999/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if no exists filter_id', (done) => {
			request
				.delete(`/v1/admins/calendars/${calendarId}/filter/99999`)
				.set(setData)
				.expect(500, done);
		});

		test('should return null if success delete calendar filter', (done) => {
			request
				.delete(`/v1/admins/calendars/${calendarId}/filter/${filterId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).toEqual(null);

					done();
				});
		});

		test('should return invalid status if no exists calendarFilter', (done) => {
			request
				.delete(`/v1/admins/calendars/${calendarId}/filter/${filterId}`)
				.set(setData)
				.expect(500, done);
		});
	});
});

describe('ROUTER /v1/calendars', () => {
	// GET Calendar LIST User test
	describe('GET /v1/calendars', () => {
		const searchFiled = {
			start_date: '2020-01-06',
			end_date: '2020-02-29',
			filter_id: 317,
		};

		test('should return invalid status if wrong start_date form', (done) => {
			request
				.get(`/v1/calendars?start_date='2020-01-022'&end_date=${searchFiled.end}&filter_id=${searchFiled.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if wrong end_date form', (done) => {
			request
				.get(`/v1/calendars?start_date=${searchFiled.start_date}&end_date=2020-01-222&filter_id=${searchFiled.filter_id}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if filter_id not number', (done) => {
			request
				.get(`/v1/calendars?start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}&filter_id=string`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if no exists filter_id', (done) => {
			request
				.get(`/v1/calendars?start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}&filter_id=99999`)
				.set(setData)
				.expect(500, done);
		});

		test('should retun calendars data if success get calendars', (done) => {
			request
				.get(`/v1/calendars?start_date=${searchFiled.start_date}&end_date=${searchFiled.end_date}&filter_id=${searchFiled.filter_id}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(res);
					const calendars = res.body;

					common.listAttrTypeCheck([calendars.total, calendars.limit, calendars.page]);
					for (let i = 0; i < calendars.list.length; i++) {
						let filters = calendars['list'][i]['filter'];
						if (filters && Object.keys(filters).length > 0) for (let j = 0; j < filters.length; j++) filterCheck.checkGetFilter(filters[j]);

						delete calendars['list'][i]['filter'];
						calendarCheck.checkCalendar(calendars['list'][i]);
					}

					// 공휴일 체크
					for (let i = 0; i < calendars.holiday_list.length; i++) {
						calendarCheck.checkHoliday(calendars.holiday_list[i]);
					}

					done();
				});
		});
	});
});
