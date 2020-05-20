'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewAnswerChoice extends Model {
		static associate(models) {
			ReviewAnswerChoice.belongsTo(models.ReviewAnswer, { as: 'review_answer', foreignKey: 'review_answer_id', targetKey: 'id', constraints: false });
			ReviewAnswerChoice.belongsTo(models.ReviewQuestionChoice, { as: 'review_question_choice', foreignKey: 'review_question_choice_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewAnswerChoice.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_answer_id: field(DataTypes.BIGINT.UNSIGNED, 'review_answers.id(FK)', false),
			review_question_choice_id: field(DataTypes.BIGINT.UNSIGNED, 'review_question_choices.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'review_answer_choices',
			comment: '리뷰 답변 (객관식)',
			indexes: [],
			sequelize,
		},
	);

	return ReviewAnswerChoice;
};
