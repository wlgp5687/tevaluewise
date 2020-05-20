'use strict'; // eslint-disable-line strict, lines-around-directive

import Sequelize, { Model } from 'sequelize';
import { Agreement } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberFollowTutor extends Model {
		static associate(models) {
			MemberFollowTutor.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
			MemberFollowTutor.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'tutor_id', targetKey: 'id', constraints: false });
		}
	}

	MemberFollowTutor.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id(FK)', false),
			tutor_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id(FK)', false),
			filter_id: field(DataTypes.INTEGER.UNSIGNED, 'filter_id', false),
			is_confirm: field(DataTypes.ENUM(Agreement.values()), '승인 여부', false, { defaultValue: Agreement.NO.value }),
			visit_count: field(DataTypes.MEDIUMINT.UNSIGNED, '방문수', false, { defaultValue: 0 }),
			last_visit_at: field(DataTypes.DATE, '최종방문일시', false, { defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'member_follow_tutors',
			comment: '회원의 강사 follow',
			indexes: [{ fields: ['member_id', 'tutor_id'], method: 'unique' }],
			sequelize,
		},
	);

	return MemberFollowTutor;
};
