'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { ReviewAnswerType, ReviewQuestionTextAnswerType, ReviewQuestionPentagon, Agreement } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewQuestion extends Model {
		static associate(models) {
			ReviewQuestion.hasMany(models.ReviewQuestionFilter, { as: 'review_question', foreignKey: 'review_question_id', sourceKey: 'id', constraints: false });
			ReviewQuestion.hasMany(models.ReviewAnswer, { as: 'review_answer', foreignKey: 'review_question_id', sourceKey: 'id', constraints: false });
		}
	}

	ReviewQuestion.init(
		// fields
		{
			id: field(DataTypes.INTEGER.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			answer_type: field(DataTypes.ENUM(ReviewAnswerType.values()), '질문 유형', false),
			question: field(DataTypes.STRING(255), '질문', false),
			placeholder: field(DataTypes.STRING(255), '안내문', true),
			text_answer_type: field(DataTypes.ENUM(ReviewQuestionTextAnswerType.values()), '주관식 리뷰 답변 유형', false, { defaultValue: ReviewQuestionTextAnswerType.UNKNOWN.value }),
			pentagon: field(DataTypes.ENUM(ReviewQuestionPentagon.values()), '오각형 요소', false, { defaultValue: ReviewQuestionPentagon.UNKNOWN.value }),
			collection_question_id: field(DataTypes.INTEGER.UNSIGNED, '사전 질문 id'),
			collection_answer_id: field(DataTypes.JSON, '사전 답변 id'),
			min_point: field(DataTypes.TINYINT.UNSIGNED, '최소 포인트', false, { defaultValue: 0 }),
			max_point: field(DataTypes.TINYINT.UNSIGNED, '최대 포인트', false, { defaultValue: 0 }),
			is_collection: field(DataTypes.ENUM(Agreement.values()), '사전 질문 여부', false, { defaultValue: Agreement.NO.value }),
			is_deleted: field(DataTypes.ENUM(Agreement.values()), '삭제여부', false, { defaultValue: Agreement.NO.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'review_questions',
			comment: '리뷰 질문',
			indexes: [{ fields: ['answer_type'] }, { fields: ['is_deleted'] }],
			sequelize,
		},
	);

	return ReviewQuestion;
};
