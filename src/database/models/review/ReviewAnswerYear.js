'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewAnswerYear extends Model {
		static associate(models) {
			ReviewAnswerYear.belongsTo(models.ReviewAnswer, { as: 'review_answer', foreignKey: 'review_answer_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewAnswerYear.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_answer_id: field(DataTypes.BIGINT.UNSIGNED, 'review_answers.id(FK)', false),
			answer: field(DataTypes.INTEGER(4).UNSIGNED, '답변', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'review_answer_years',
			comment: '리뷰 답변 (연도)',
			sequelize,
		},
	);

	return ReviewAnswerYear;
};
