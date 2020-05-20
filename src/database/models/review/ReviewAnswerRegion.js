'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ReviewAnswerRegion extends Model {
		static associate(models) {
			ReviewAnswerRegion.belongsTo(models.ReviewAnswer, { as: 'review_answer', foreignKey: 'review_answer_id', targetKey: 'id', constraints: false });
			ReviewAnswerRegion.belongsTo(models.Region, { as: 'region', foreignKey: 'region_id', targetKey: 'id', constraints: false });
		}
	}

	ReviewAnswerRegion.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			review_answer_id: field(DataTypes.BIGINT.UNSIGNED, 'review_answers.id(FK)', false),
			region_id: field(DataTypes.BIGINT.UNSIGNED, 'region.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'review_answer_regions',
			comment: '리뷰 답변 (지역)',
			indexes: [],
			sequelize,
		},
	);

	return ReviewAnswerRegion;
};
