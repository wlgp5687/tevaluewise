import { getModel, sequelize, Op } from '../../database';

const Calendar = getModel('Calendar');
const CalendarFilter = getModel('CalendarFilter');
const CalendarHoliday = getModel('CalendarHoliday');
const Filter = getModel('Filter');

// 일정 존재 여부
// eslint-disable-next-line no-unneeded-ternary
export const isExistCalendarId = async (calendarId) => ((await Calendar.count({ where: { id: calendarId } })) > 0 ? true : false);

// 일정 필터 존재 여부
// eslint-disable-next-line no-unneeded-ternary
export const isExistCalendarFilter = async (calendarId, filterId) => ((await CalendarFilter.count({ where: { calendar_id: calendarId, filter_id: filterId } })) > 0 ? true : false);

// 공휴일 인덱스 존재 여부
// eslint-disable-next-line no-unneeded-ternary
export const isExistHolidayById = async (holidayId) => ((await CalendarHoliday.count({ where: { id: holidayId } })) > 0 ? true : false);

// 공휴일 일자 존재 여부
// eslint-disable-next-line no-unneeded-ternary
export const isExistHoliday = async (holiday) => ((await CalendarHoliday.count({ where: { holiday } })) > 0 ? true : false);

// 일정 인덱스로 레벨 필터 구하기
export const getFiltersByCalendarId = async (calendarId) => {
	const response = await Filter.findAll({
		attributes: ['id', 'code', 'name'],
		where: { is_deleted: 'N' },
		include: [{ model: Calendar, as: 'calendar', where: { id: calendarId }, attributes: [], through: { attributes: [] }, required: true }],
	});
	return response;
};

// 일자 및 필터에 맞는 일정 조회
export const getCalendars = async (calendar, offset = 0, limitParam = 10) => {
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	let response = null;
	const values = { offset: parseInt(offset, 10), limit: parseInt(limit, 10), start_date: calendar.start_date, end_date: calendar.end_date, filter_id: calendar.filter_id };

	// prettier-ignore
	const sql = [
		'FROM `calendars` ',
		'INNER JOIN `calendar_filters` ON `calendar_filters`.`calendar_id` = `calendars`.`id` ',
		'WHERE `calendars`.`id` IS NOT NULL ',
		'AND `calendars`.`is_deleted` = "N"',
		'AND `calendar_filters`.`filter_id` = :filter_id ',
		'AND ( ',
		'	DATE_FORMAT(`calendars`.`start_date`, "%Y%m%d") IN ( ',
		'		SELECT REPLACE(`date`.`date`, "-", "") AS `date` ',
		'		FROM ( ',
		'			SELECT :end_date - INTERVAL (`a`.`a` + (10 * `b`.`a`) + (100 * `c`.`a`) + (1000 * `d`.`a`) ) DAY AS `date` ',
		'			FROM ( ',
		'				SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `a` ',
		'				CROSS JOIN (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `b` ',
		'				CROSS JOIN (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `c` ',
		'				CROSS JOIN (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `d` ',				
		'		) `date` ',
		'		WHERE `date`.`date` BETWEEN :start_date AND :end_date',
		'	) ',
		'	OR ',
		'	DATE_FORMAT(`calendars`.`end_date`, "%Y%m%d") IN ( ',
		'		SELECT REPLACE(`date`.Date, "-", "") AS `date` ',
		'		FROM ( ',
		'			SELECT :end_date - INTERVAL (`a`.`a` + (10 * `b`.`a`) + (100 * `c`.`a`) + (1000 * `d`.`a`) ) DAY AS `date` ',
		'			FROM (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `a` ',
		'			CROSS JOIN (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `b` ',
		'			CROSS JOIN (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `c` ',
		'			CROSS JOIN (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS `d` ',
		'		) `date` ',
		'		WHERE `date`.`date` BETWEEN :start_date AND :end_date',
		'	)',
		'	OR ',
		'	( DATE_FORMAT(`calendars`.`start_date`, "%Y%m%d") < REPLACE(:start_date, "-", "") AND DATE_FORMAT(`calendars`.`end_date`, "%Y%m%d") > REPLACE(:end_date, "-", "") )',
		') '
	].join(' ');

	const countSql = ['SELECT COUNT(DISTINCT `calendars`.`id`) AS total '].join(' ') + sql;

	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const calendarSql =
			// eslint-disable-next-line prefer-template
			[
				'SELECT DISTINCT `calendars`.`id`, ',
				'`calendars`.`title`, ',
				'`calendars`.`start_date`, ',
				'`calendars`.`end_date`, ',
				'`calendars`.`url`, ',
				'`calendars`.`is_blank`, ',
				'`calendars`.`is_deleted`, ',
				'`calendars`.`sort_no`, ',
				'`calendars`.`created_at` ',
			].join(' ') +
			sql +
			'ORDER BY `calendars`.`sort_no` ASC, `calendars`.`created_at` DESC, `calendars`.`id` DESC ' +
			'LIMIT :limit ' +
			'OFFSET :offset ';
		let calendars = null;
		const calendarData = [];
		calendars = await sequelize.query(calendarSql, { type: sequelize.QueryTypes.SELECT, replacements: values });

		for (let i = 0; i < calendars.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const calendarFilters = await getFiltersByCalendarId(calendars[i].id);

			calendarData[i] = {
				id: calendars[i].id,
				title: calendars[i].title,
				start_date: calendars[i].start_date,
				end_date: calendars[i].end_date,
				url: calendars[i].url,
				is_blank: calendars[i].is_blank,
				is_deleted: calendars[i].is_deleted,
				is_holiday: calendars[i].is_holiday,
				sort_no: calendars[i].sort_no,
				filter: calendarFilters,
			};
		}
		if (Object.keys(calendars).length > 0) response = { total, list: calendarData };
	}

	return response;
};

// 일자에 맞는 공휴일 가져오기
export const getAllHolidays = async (startDate, endDate) => {
	const holidays = await CalendarHoliday.findAll({
		attributes: ['id', 'holiday'],
		where: { [Op.and]: [{ holiday: { [Op.gte]: startDate } }, { holiday: { [Op.lte]: endDate } }] },
		order: [['id', 'ASC']],
	});

	return Object.keys(holidays).length > 0 ? holidays : null;
};

/**
 * @description 이재익이 작성한게 아님
 */
export const getCalenderItems = async (lv1Id, startDate, endDate) => {
	const response = await Calendar.findAll({
		attributes: ['id', 'lv1_id', 'member_id', 'start_date', 'end_date', 'title', 'contents', 'link_url'],
		where: { is_deleted: 'N', lv1_id: lv1Id, start_date: { [Op.gte]: startDate }, end_date: { [Op.lte]: endDate } },
	});
	return response;
};
