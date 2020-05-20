'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class TutorSubject extends Model {
		static associate(models) {
			TutorSubject.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'tutor_id', targetKey: 'id', constraints: false });
			TutorSubject.belongsTo(models.Subject, { as: 'subject', foreignKey: 'subject_id', targetKey: 'id', constraints: false });
		}
	}

	TutorSubject.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			tutor_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id(FK)', false),
			subject_id: field(DataTypes.BIGINT.UNSIGNED, 'subjects.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'tutor_subjects',
			comment: '강사 강의 과목',
			indexes: [{ unique: true, fields: ['tutor_id', 'subject_id'] }],
			sequelize,
		},
	);

	return TutorSubject;
};
