'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CafeInstitute extends Model {
		static associate(models) {
			CafeInstitute.belongsTo(models.Cafe, { as: 'cafe', foreignKey: 'cafe_id', targetKey: 'id', constraints: false });
			CafeInstitute.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
		}
	}

	CafeInstitute.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			cafe_id: field(DataTypes.BIGINT.UNSIGNED, 'cafes.id(FK)', false),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'cafe_institutes',
			comment: '카페 기관',
			indexes: [{ unique: true, name: 'uk_cafe_institutes', fields: ['cafe_id', 'institute_id'] }],
			sequelize,
		},
	);

	return CafeInstitute;
};
