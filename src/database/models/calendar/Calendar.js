'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsDeleted, IsBlank } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Calendar extends Model {
		static associate(models) {
			Calendar.belongsToMany(models.Institute, { as: 'institute', through: models.CalendarInstitute, foreignKey: 'calendar_id', otherKey: 'institute_id' });
			Calendar.belongsToMany(models.Tutor, { as: 'tutor', through: models.CalendarTutor, foreignKey: 'calendar_id', otherKey: 'tutor_id' });
			Calendar.belongsToMany(models.Filter, { as: 'filter', through: models.CalendarFilter, foreignKey: 'calendar_id', otherKey: 'filter_id' });
		}
	}

	Calendar.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			title: field(DataTypes.STRING(255), '일정 제목', false),
			start_date: field(DataTypes.DATEONLY, '일정 시작 날짜', false),
			end_date: field(DataTypes.DATEONLY, '일정 종료 날짜', false),
			url: field(DataTypes.STRING(255), '링크 URL', true, { defaultValue: null }),
			is_blank: field(DataTypes.ENUM(IsBlank.values()), '새창 여부', false, { defaultValue: IsBlank.N.values }),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제 여부', false, { defaultValue: IsDeleted.N.values }),
			sort_no: field(DataTypes.INTEGER.UNSIGNED, '정렬 기준', false, { defaultValue: 1 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'calendars',
			comment: '일정 테이블',
			indexes: [{ name: 'ik_calendar_date', fields: ['start_date', 'end_date'] }],
			sequelize,
		},
	);

	return Calendar;
};
