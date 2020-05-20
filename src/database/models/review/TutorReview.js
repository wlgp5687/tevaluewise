'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class TutorReview extends Model {
		static associate(models) {
			TutorReview.belongsTo(models.Review, { as: 'review', foreignKey: 'review_id', targetKey: 'id', constraints: false });
			TutorReview.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'tutor_id', targetKey: 'id', constraints: false });
			TutorReview.belongsTo(models.Institute, { as: 'institute', foreignKey: 'institute_id', targetKey: 'id', constraints: false });
			TutorReview.belongsTo(models.Filter, { as: 'filter', foreignKey: 'filter_id', targetKey: 'id', constraints: false });
			TutorReview.belongsTo(models.Subject, { as: 'subject', foreignKey: 'subject_id', targetKey: 'id', constraints: false });
		}
	}

	TutorReview.init(
		// fields
		{
			review_id: field(DataTypes.BIGINT.UNSIGNED, 'reviews.id(FK)', false),
			tutor_id: field(DataTypes.BIGINT.UNSIGNED, 'tutors.id(FK)', false),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, 'institutes.id(FK)', false),
			filter_id: field(DataTypes.INTEGER.UNSIGNED, 'filters.id(FK)', false),
			subject_id: field(DataTypes.BIGINT.UNSIGNED, 'subjects.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'tutor_reviews',
			comment: '강사 리뷰',
			indexes: [],
			sequelize,
		},
	);
	TutorReview.removeAttribute('id');

	return TutorReview;
};
