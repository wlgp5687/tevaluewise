'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CalendarTutor extends Model {
		static associate(models) {
			CalendarTutor.belongsTo(models.Calendar, { as: 'calendar', foreignKey: 'calendar_id', targetKey: 'id', constraints: false });
			CalendarTutor.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'tutor_id', targetKey: 'id', constraints: false });
		}
	}

	CalendarTutor.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			calendar_id: field(DataTypes.BIGINT.UNSIGNED, 'calendars.id', false),
			tutor_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'calendar_tutors',
			comment: '일정 강사 테이블',
			indexes: [{ unique: true, name: 'uk_calendar_tutors_calendar_id', fields: ['calendar_id', 'tutor_id'] }],
			sequelize,
		},
	);

	return CalendarTutor;
};
