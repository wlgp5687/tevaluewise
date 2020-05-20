import * as calendarComponent from '../../component/calendar/calendar';

// 일정 존재 여부
export const isExistCalendarId = async (id) => {
	const response = await calendarComponent.isExistCalendarId(id);
	return response;
};

// 일정 필터 존재 여부
export const isExistCalendarFilter = async (calendarId, filterId) => {
	const response = await calendarComponent.isExistCalendarFilter(calendarId, filterId);
	return response;
};

// 공휴일 일정 인덱스 존재 여부
export const isExistHolidayById = async (id) => {
	const response = await calendarComponent.isExistHolidayById(id);
	return response;
};

// 공휴일 일정 일자 존재 여부
export const isExistHoliday = async (holiday) => {
	const response = await calendarComponent.isExistHoliday(holiday);
	return response;
};

// 일자 및 필터에 맞는 일정 조회
export const getCalendars = async (calendar, offset = 0, limit = 10) => {
	let response = {};
	const calendars = await calendarComponent.getCalendars(calendar, offset, limit);
	const holidays = await calendarComponent.getAllHolidays(calendar.start_date, calendar.end_date);

	if (calendars) {
		response = calendars;
	} else {
		response.list = null;
	}
	response.holiday_list = holidays;

	return Object.keys(response).length > 0 ? response : null;
};

/**
 * @description 이재익이 작성한게 아님
 */
export const getCalenderItems = async (lv1Id, startDate, endDate) => {
	const response = await calendarComponent.getCalenderItems(lv1Id, startDate, endDate);
	return response;
};
