'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CalendarInstitute extends Model {
		static associate(models) {
			CalendarInstitute.belongsTo(models.Calendar, { as: 'calendar', foreignKey: 'calendar_id', targetKey: 'id', constraints: false });
			CalendarInstitute.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
		}
	}

	CalendarInstitute.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			calendar_id: field(DataTypes.BIGINT.UNSIGNED, 'calendars.id', false),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'calendar_institutes',
			comment: '일정 기관 테이블',
			indexes: [{ unique: true, name: 'uk_calendar_institutes_calendar_id', fields: ['calendar_id', 'institute_id'] }],
			sequelize,
		},
	);

	return CalendarInstitute;
};
