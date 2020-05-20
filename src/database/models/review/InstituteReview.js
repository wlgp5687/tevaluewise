'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class InstituteReview extends Model {
		static associate(models) {
			InstituteReview.belongsTo(models.Review, { as: 'review', foreignKey: 'review_id', targetKey: 'id', constraints: false });
			InstituteReview.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
			InstituteReview.belongsTo(models.Filter, { as: 'filter', foreignKey: 'filter_id', targetKey: 'id', constraints: false });
			InstituteReview.belongsTo(models.Subject, { as: 'subject', foreignKey: 'subject_id', targetKey: 'id', constraints: false });
		}
	}

	InstituteReview.init(
		// fields
		{
			review_id: field(DataTypes.BIGINT.UNSIGNED, 'reviews.id(FK)', false),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id(FK)', false),
			filter_id: field(DataTypes.INTEGER.UNSIGNED, 'filters.id(FK)', false),
			subject_id: field(DataTypes.BIGINT.UNSIGNED, 'subjects.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'institute_reviews',
			comment: '기관 리뷰',
			indexes: [],
			sequelize,
		},
	);
	InstituteReview.removeAttribute('id');

	return InstituteReview;
};
