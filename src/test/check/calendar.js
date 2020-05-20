import * as common from '../component/common';
import { throwError } from '../../services';

// 일정 등록 체크
export const checkCalendar = (calendar) => {
	expect(typeof calendar.id).toEqual('number');
	expect(typeof calendar.title).toEqual('string');
	expect(common.dateFormatCheck(calendar.start_date)).toEqual(true);
	expect(common.dateFormatCheck(calendar.end_date)).toEqual(true);
	expect(typeof calendar.is_blank).toEqual('string');
	expect(typeof calendar.is_deleted).toEqual('string');
	expect(typeof calendar.sort_no).toEqual('number');

	return null;
};

// 일정 필터 연결 체크
export const checkCalendarFilter = (calendarFilter) => {
	expect(typeof calendarFilter.id).toEqual('number');
	expect(typeof calendarFilter.calendar_id).toEqual('string');
	expect(typeof calendarFilter.filter_id).toEqual('string');

	return null;
};

// 공휴일 체크
export const checkHoliday = (holiday) => {
	expect(typeof holiday.id).toEqual('number');
	expect(common.dateFormatCheck(holiday.holiday)).toEqual(true);

	return null;
};

// 일정 체크
export const checkGetCalendar = async (calendar, calendarData) => {
	expect(typeof calendar.id).toEqual('number');
	expect(calendar.id).toEqual(calendarData.id);

	for (let i = 0; i < calendar.filter.length; i++) {
		expect(calendar.filter[i].id).toEqual(calendarData.filter[i].id);
	}

	return null;
};
