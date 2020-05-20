'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class InstituteSubject extends Model {
		static associate(models) {}
	}

	InstituteSubject.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id(FK)', false),
			subject_id: field(DataTypes.BIGINT.UNSIGNED, 'subjects.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'institute_subjects',
			comment: '기관 취급 과목',
			indexes: [{ unique: true, fields: ['institute_id', 'subject_id'] }],
			sequelize,
		},
	);

	return InstituteSubject;
};
