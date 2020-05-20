'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { ReviewType, IsConfirm, Agreement } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Review extends Model {
		static associate(models) {
			Review.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
			Review.hasOne(models.ReviewCount, { as: 'count', foreignKey: 'review_id', targetKey: 'id', constraints: false });
			Review.belongsTo(models.TutorReview, { as: 'tutor_review', foreignKey: 'id', targetKey: 'review_id', constraints: false });
			Review.belongsTo(models.TutorChangeReview, { as: 'tutor_change_review', foreignKey: 'id', targetKey: 'review_id', constraints: false });
			Review.belongsTo(models.InstituteReview, { as: 'institute_review', foreignKey: 'id', targetKey: 'review_id', constraints: false });
			Review.belongsTo(models.InstituteChangeReview, { as: 'institute_change_review', foreignKey: 'id', targetKey: 'review_id', constraints: false });
			Review.hasMany(models.ReviewAnswer, { as: 'review_question_answer', foreignKey: 'review_id', sourceKey: 'id', constraints: false });
			Review.hasMany(models.ReviewComment, { as: 'comment', foreignKey: 'review_id', sourceKey: 'id', constraints: false });
		}
	}

	Review.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id(FK)', false),
			review_type: field(DataTypes.ENUM(ReviewType.values()), '리뷰 유형', false),
			is_deleted: field(DataTypes.ENUM(Agreement.values()), '삭제여부', false, { defaultValue: Agreement.NO.value }),
			is_confirm: field(DataTypes.ENUM(IsConfirm.values()), '승인여부', false, { defaultValue: IsConfirm.REQUEST.value }),
			denied_comment: field(DataTypes.STRING(255), '반려사유'),
			average_point: field(DataTypes.MEDIUMINT.UNSIGNED, '리뷰 평점', true),
			created_ip: field(DataTypes.STRING(39), '작성 IP', false, { defaultValue: '' }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'reviews',
			comment: '리뷰',
			indexes: [{ fields: ['review_type'] }, { fields: ['is_deleted'] }, { fields: ['is_confirm'] }],
			sequelize,
		},
	);

	return Review;
};
