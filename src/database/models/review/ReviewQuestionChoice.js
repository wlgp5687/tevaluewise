'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewQuestionChoice extends Model {
		static associate(models) {
			ReviewQuestionChoice.belongsTo(models.ReviewQuestion, { as: 'review_question', foreignKey: 'review_question_id', targetKey: 'id', constraints: false });
			ReviewQuestionChoice.hasOne(models.ReviewAnswerChoice, { as: 'review_answer_choice', foreignKey: 'review_question_choice_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewQuestionChoice.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_question_id: field(DataTypes.INTEGER.UNSIGNED, 'review_questions.id', false),
			answer: field(DataTypes.STRING(255), '답변', false),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'review_question_choices',
			comment: '리뷰 선택형 답변',
			indexes: [],
			sequelize,
		},
	);

	return ReviewQuestionChoice;
};
