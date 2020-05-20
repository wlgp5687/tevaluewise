'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { ReviewType, Agreement } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewQuestionFilter extends Model {
		static associate(models) {
			ReviewQuestionFilter.belongsTo(models.ReviewQuestion, { as: 'review_question', foreignKey: 'review_question_id', targetKey: 'id', constraints: false });
			ReviewQuestionFilter.belongsTo(models.Filter, { as: 'filter', foreignKey: 'filter_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewQuestionFilter.init(
		// fields
		{
			id: field(DataTypes.INTEGER.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_question_id: field(DataTypes.INTEGER.UNSIGNED, 'review_questions.id(FK)', false),
			filter_id: field(DataTypes.INTEGER.UNSIGNED, 'filters.id(FK)', false),
			review_type: field(DataTypes.ENUM(ReviewType.values()), '리뷰 유형', false),
			sort: field(DataTypes.SMALLINT, '정렬 순서', false, { defaultValue: 0 }),
			step: field(DataTypes.SMALLINT(5).UNSIGNED, '페이지 스탭', false, { defaultValue: 0 }),
			is_deleted: field(DataTypes.ENUM(Agreement.values()), '삭제여부', false, { defaultValue: Agreement.NO.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'review_question_filters',
			comment: '리뷰 질문 분야',
			indexes: [{ fields: ['review_type'] }, { fields: ['sort'] }],
			sequelize,
		},
	);

	return ReviewQuestionFilter;
};
