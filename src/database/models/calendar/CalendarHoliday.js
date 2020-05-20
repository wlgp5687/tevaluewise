'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CalendarHoliday extends Model {
		static associate(models) {}
	}

	CalendarHoliday.init(
		// fields
		{
			id: field(DataTypes.INTEGER.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			holiday: field(DataTypes.DATEONLY, '공휴일', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'calendar_holidays',
			comment: '일정 공휴일 테이블',
			indexes: [{ name: 'uk_calendar_holidays_holiday', fields: ['holiday'], unique: true }],
			sequelize,
		},
	);

	return CalendarHoliday;
};
