'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { Agreement } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class TutorInstitute extends Model {
		static associate(models) {
			TutorInstitute.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'tutor_id', targetKey: 'id', constraints: false });
			TutorInstitute.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
		}
	}

	TutorInstitute.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			tutor_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id(FK)', false),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id(FK)', false),
			is_current: field(DataTypes.ENUM(Agreement.values()), '현재 소속 여부', false, { defaultValue: Agreement.YES.value }),
			join_at: field(DataTypes.DATE, '입사일'),
			retire_at: field(DataTypes.DATE, '퇴사일'),
			sort_no: field(DataTypes.BIGINT.UNSIGNED, 'sort_id', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: false,
			tableName: 'tutor_institutes',
			comment: '강사 소속 기관',
			indexes: [
				{ fields: ['tutor_id', 'is_current', 'sort_no', 'institute_id'], method: 'BTREE' },
				{ fields: ['institute_id', 'is_current', 'tutor_id'], method: 'BTREE' },
				{ unique: true, fields: ['tutor_id', 'institute_id'] },
			],
			sequelize,
		},
	);

	return TutorInstitute;
};
