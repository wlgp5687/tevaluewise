'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsDeleted, CafeType } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Cafe extends Model {
		static associate(models) {
			Cafe.belongsToMany(models.Tutor, { as: 'tutor', through: models.CafeTutor, foreignKey: 'cafe_id', otherKey: 'tutor_id' });
		}
	}

	Cafe.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			type: field(DataTypes.ENUM(CafeType.values()), '카페 유형', false),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제 여부', false, { defaultValue: IsDeleted.N.values }),
			visit_count: field(DataTypes.MEDIUMINT.UNSIGNED, '방문수', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'cafes',
			comment: '카페',
			indexes: [{ name: 'cafe_ik_is_deleted', fields: ['is_deleted'] }],
			sequelize,
		},
	);

	return Cafe;
};
