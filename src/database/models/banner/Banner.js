'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { BannerPage, BannerPosition, BannerTarget, DeviceType, IsDeleted, IsBlank } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Banner extends Model {
		static associate(models) {
			Banner.belongsToMany(models.Tutor, { as: 'tutor', through: models.TutorBanner, foreignKey: 'banner_id', otherKey: 'tutor_id' });
			Banner.belongsToMany(models.Institute, { as: 'institute', through: models.InstituteBanner, foreignKey: 'banner_id', otherKey: 'institute_id' });
			Banner.belongsToMany(models.Filter, { as: 'filter', through: models.FilterBanner, foreignKey: 'banner_id', otherKey: 'filter_id' });
		}
	}

	Banner.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			title: field(DataTypes.STRING(255), '배너 제목', false),
			banner_page: field(DataTypes.ENUM(BannerPage.values()), '배너 페이지', false),
			position: field(DataTypes.ENUM(BannerPosition.values()), '배너 포지션', false),
			target: field(DataTypes.ENUM(BannerTarget.values()), '배너 타겟', true, { defaultValue: null }),
			device: field(DataTypes.ENUM(DeviceType.values()), '기기 타입', false),
			file_url: field(DataTypes.STRING(512), '파일 URL', false),
			s3_key: field(DataTypes.STRING(512), 's3_key', false),
			url: field(DataTypes.STRING(255), 'URL', true, { defaultValue: null }),
			alt_text: field(DataTypes.STRING(255), '파일 설명', true, { defaultValue: null }),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제여부', false, { defaultValue: IsDeleted.N.values }),
			is_blank: field(DataTypes.ENUM(IsBlank.values()), '새창여부', false, { defaultValue: IsBlank.Y.values }),
			sort_no: field(DataTypes.INTEGER.UNSIGNED, '정열순서', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'banners',
			comment: '배너',
			indexes: [{ fields: ['banner_page'] }, { fields: ['position'] }, { fields: ['target'] }, { fields: ['is_deleted'] }],
			sequelize,
		},
	);

	return Banner;
};
