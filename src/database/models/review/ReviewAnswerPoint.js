'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewAnswerPoint extends Model {
		static associate(models) {
			ReviewAnswerPoint.belongsTo(models.ReviewAnswer, { as: 'review_answer', foreignKey: 'review_answer_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewAnswerPoint.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_answer_id: field(DataTypes.BIGINT.UNSIGNED, 'review_answers.id(FK)', false),
			point: field(DataTypes.TINYINT.UNSIGNED, '포인트', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: false,
			tableName: 'review_answer_points',
			comment: '리뷰 답변 (포인트)',
			indexes: [],
			sequelize,
		},
	);

	return ReviewAnswerPoint;
};
