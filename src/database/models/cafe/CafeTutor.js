'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CafeTutor extends Model {
		static associate(models) {
			CafeTutor.belongsTo(models.Cafe, { as: 'cafe', foreignKey: 'cafe_id', targetKey: 'id', constraints: false });
			CafeTutor.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'tutor_id', targetKey: 'id', constraints: false });
		}
	}

	CafeTutor.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			cafe_id: field(DataTypes.BIGINT.UNSIGNED, 'cafes.id(FK)', false),
			tutor_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'cafe_tutors',
			comment: '카페 강사',
			indexes: [{ unique: true, name: 'uk_cafe_tutors', fields: ['cafe_id', 'tutor_id'] }],
			sequelize,
		},
	);

	return CafeTutor;
};
