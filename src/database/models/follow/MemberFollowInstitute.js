'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { Agreement } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberFollowInstitute extends Model {
		static associate(models) {
			MemberFollowInstitute.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
			MemberFollowInstitute.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
		}
	}

	MemberFollowInstitute.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id(FK)', false),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id(FK)', false),
			filter_id: field(DataTypes.INTEGER.UNSIGNED, 'filter_id', false),
			is_confirm: field(DataTypes.ENUM(Agreement.values()), '승인 여부', false, { defaultValue: Agreement.NO.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'member_follow_institutes',
			comment: '회원의 기관 follow',
			indexes: [{ fields: ['member_id', 'institute_id'], method: 'unique' }],
			sequelize,
		},
	);

	return MemberFollowInstitute;
};
