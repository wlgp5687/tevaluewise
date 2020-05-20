'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { InstituteType, Agreement, IsConfirm } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Institute extends Model {
		static associate(models) {
			Institute.hasOne(models.InstituteAttribute, { as: 'attribute', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.hasOne(models.InstituteChildren, { as: 'children', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.hasOne(models.InstituteCount, { as: 'count', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.belongsToMany(models.Member, { as: 'count_log_member', through: models.InstituteCountLog, foreignKey: 'institute_id', otherKey: 'member_id' });
			Institute.hasOne(models.InstituteFamily, { as: 'sub_family', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.hasOne(models.InstituteFamily, { as: 'high_family', foreignKey: 'parent_id', sourceKey: 'id', constraints: false });
			Institute.hasMany(models.InstituteMember, { as: 'member', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.belongsToMany(models.Region, { as: 'region', through: models.InstituteRegion, foreignKey: 'institute_id', otherKey: 'region_id' });
			Institute.belongsToMany(models.Subject, { as: 'subject', through: models.InstituteSubject, foreignKey: 'institute_id', otherKey: 'subject_id' });
			Institute.hasMany(models.InstituteSubject, { as: 'institute_subject', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.hasMany(models.TutorInstitute, { as: 'tutor_institute', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.hasOne(models.MemberFollowInstitute, { as: 'member_follow_institute', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.hasMany(models.InstituteSort, { as: 'institute_sort', foreignKey: 'institute_id', sourceKey: 'id', constraints: false });
			Institute.belongsToMany(models.Banner, { as: 'banner', through: models.InstituteBanner, foreignKey: 'institute_id', otherKey: 'banner_id' });
			Institute.belongsToMany(models.CustomerServiceReport, {
				as: 'customer_service',
				through: models.CustomerServiceReportInstitute,
				foreignKey: 'institute_id',
				otherKey: 'customer_service_report_id',
			});
			Institute.belongsToMany(models.Calendar, { as: 'calendar', through: models.CalendarInstitute, foreignKey: 'institute_id', otherKey: 'calendar_id' });
		}
	}

	Institute.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			name_ko: field(DataTypes.STRING(255), '기관명 (국문)', false),
			name_en: field(DataTypes.STRING(255), '기관명 (영문)', false),
			campus: field(DataTypes.STRING(255), '캠퍼스명', false),
			type: field(DataTypes.ENUM(InstituteType.values()), '기관유형', false, { defaultValue: InstituteType.ETC.value }),
			is_deleted: field(DataTypes.ENUM(Agreement.values()), '삭제여부', false, { defaultValue: Agreement.NO.value }),
			is_confirm: field(DataTypes.ENUM(IsConfirm.values()), '승인여부', false, { defaultValue: IsConfirm.REQUEST.value }),
			has_online: field(DataTypes.ENUM(Agreement.values()), '인강여부'),
			has_review: field(DataTypes.ENUM(Agreement.values()), '기관 리뷰 사용여부'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'institutes',
			comment: '기관 master',
			indexes: [{ fields: ['type'] }, { fields: ['is_deleted'] }, { fields: ['is_confirm'] }, { fields: ['has_online'] }, { fields: ['has_review'] }],
			sequelize,
		},
	);

	return Institute;
};
