'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class InstituteFamily extends Model {
		static associate(models) {
			InstituteFamily.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
			InstituteFamily.belongsTo(models.Institute, { as: 'institute_parent', foreignKey: 'parent_id', targetKey: 'id', constraints: false });
		}
	}

	InstituteFamily.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id(FK)', false),
			parent_id: field(DataTypes.BIGINT.UNSIGNED, '상위 기관 (institutes.id)(FK)', false),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'institute_families',
			comment: '기관 그룹',
			indexes: [],
			sequelize,
		},
	);

	return InstituteFamily;
};
