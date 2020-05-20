'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsDefault, IsDeleted } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CafeVideo extends Model {
		static associate(models) {
			CafeVideo.belongsTo(models.Cafe, { as: 'cafe', foreignKey: 'cafe_id', targetKey: 'id', constraints: false });
		}
	}

	CafeVideo.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			cafe_id: field(DataTypes.BIGINT.UNSIGNED, 'cafes.id(FK)', false),
			title: field(DataTypes.STRING(255), '카페 영상 제목', false),
			video_url: field(DataTypes.STRING(255), '영상 URL', false),
			is_default: field(DataTypes.ENUM(IsDefault.values()), '디폴트 여부', false, { defaultValue: IsDefault.N.values }),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제 여부', false, { defaultValue: IsDeleted.N.values }),
			sort_no: field(DataTypes.BIGINT.UNSIGNED, '정렬 기준', false, { defaultValue: 1 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'cafe_video',
			comment: '카페 영상',
			indexes: [
				{ name: 'cafe_video_ik_is_default', fields: ['is_default'] },
				{ name: 'cafe_video_ik_is_deleted', fields: ['is_deleted'] },
			],
			sequelize,
		},
	);

	return CafeVideo;
};
