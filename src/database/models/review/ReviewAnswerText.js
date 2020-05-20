'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewAnswerText extends Model {
		static associate(models) {
			ReviewAnswerText.belongsTo(models.ReviewAnswer, { as: 'review_answer', foreignKey: 'review_answer_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewAnswerText.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_answer_id: field(DataTypes.BIGINT.UNSIGNED, 'review_answer.id(FK)', false),
			answer: field(DataTypes.TEXT, '답변', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'review_answer_texts',
			comment: '리뷰 답변 (텍스트)',
			indexes: [],
			sequelize,
		},
	);

	return ReviewAnswerText;
};
