'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CalendarFilter extends Model {
		static associate(models) {
			CalendarFilter.belongsTo(models.Calendar, { as: 'calendar', foreignKey: 'calendar_id', targetKey: 'id', constraints: false });
			CalendarFilter.belongsTo(models.Filter, { as: 'filter', foreignKey: 'filter_id', targetKey: 'id', constraints: false });
		}
	}

	CalendarFilter.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			calendar_id: field(DataTypes.BIGINT.UNSIGNED, 'calendars.id', false),
			filter_id: field(DataTypes.BIGINT.UNSIGNED, 'filters.id', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'calendar_filters',
			comment: '일정 필터 테이블',
			indexes: [{ unique: true, name: 'uk_calendar_filters_calendar_id', fields: ['calendar_id', 'filter_id'] }],
			sequelize,
		},
	);

	return CalendarFilter;
};
