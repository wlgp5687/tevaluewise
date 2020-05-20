'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewAnswer extends Model {
		static associate(models) {
			ReviewAnswer.belongsTo(models.Review, { as: 'review', foreignKey: 'review_id', targetKey: 'id', constraints: false });
			ReviewAnswer.belongsTo(models.ReviewQuestion, { as: 'review_question', foreignKey: 'review_question_id', targetKey: 'id', constraints: false });
			ReviewAnswer.belongsTo(models.ReviewAnswerText, { as: 'review_answer', foreignKey: 'id', targetKey: 'review_answer_id', constraints: false });
		}
	}

	ReviewAnswer.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_id: field(DataTypes.BIGINT.UNSIGNED, 'reviews.id(FK)', false),
			review_question_id: field(DataTypes.INTEGER.UNSIGNED, 'review_questions.id(FK)', false),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'review_answers',
			comment: '리뷰 답변',
			indexes: [],
			sequelize,
		},
	);

	return ReviewAnswer;
};
