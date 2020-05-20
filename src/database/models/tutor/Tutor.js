'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { Agreement, IsConfirm } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Tutor extends Model {
		static associate(models) {
			Tutor.hasOne(models.TutorAttribute, { as: 'attribute', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasOne(models.TutorCount, { as: 'count', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.belongsToMany(models.Member, { as: 'count_log_member', through: models.TutorCountLog, foreignKey: 'tutor_id', otherKey: 'member_id' });
			Tutor.hasMany(models.TutorInstitute, { as: 'tutor_institute', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasMany(models.TutorMember, { as: 'member', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasMany(models.TutorNews, { as: 'news', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.belongsToMany(models.Region, { as: 'region', through: models.TutorRegion, foreignKey: 'tutor_id', otherKey: 'region_id' });
			Tutor.belongsToMany(models.Subject, { as: 'subject', through: models.TutorSubject, foreignKey: 'tutor_id', otherKey: 'subject_id' });
			Tutor.hasOne(models.MemberFollowTutor, { as: 'member_follow_tutor', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasMany(models.TutorReview, { as: 'tutor_review', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasMany(models.TutorChangeReview, { as: 'tutor_before_change_review', foreignKey: 'before_tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasMany(models.TutorChangeReview, { as: 'tutor_after_change_review', foreignKey: 'after_tutor_id', sourceKey: 'id', constraints: false });
			Tutor.hasMany(models.TutorSort, { as: 'tutor_sort', foreignKey: 'tutor_id', sourceKey: 'id', constraints: false });
			Tutor.belongsToMany(models.Banner, { as: 'banner', through: models.TutorBanner, foreignKey: 'tutor_id', otherKey: 'banner_id' });
			Tutor.belongsToMany(models.CustomerServiceReport, { as: 'customer_service', through: models.CustomerServiceReportTutor, foreignKey: 'tutor_id', otherKey: 'customer_service_report_id' });
			Tutor.belongsToMany(models.Calendar, { as: 'calendar', through: models.CalendarTutor, foreignKey: 'tutor_id', otherKey: 'calendar_id' });
			Tutor.belongsToMany(models.Cafe, { as: 'cafe', through: models.CafeTutor, foreignKey: 'tutor_id', otherKey: 'cafe_id' });
		}
	}

	Tutor.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			name: field(DataTypes.STRING(30), '강사 이름', false),
			is_deleted: field(DataTypes.ENUM(Agreement.values()), '삭제여부', false, { defaultValue: Agreement.NO.value }),
			is_confirm: field(DataTypes.ENUM(IsConfirm.values()), '승인여부', false, { defaultValue: IsConfirm.REQUEST.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'tutors',
			comment: '강사 master',
			indexes: [{ fields: ['is_deleted'] }, { fields: ['is_confirm'] }],
			sequelize,
		},
	);

	return Tutor;
};
