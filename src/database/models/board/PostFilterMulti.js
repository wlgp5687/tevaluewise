'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { PostFilterMultiType } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class PostFilterMulti extends Model {
		static associate(models) {
			PostFilterMulti.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'post_filter_id', targetKey: 'id', constraints: false });
			PostFilterMulti.belongsTo(models.BoardPost, { as: 'board_post', foreignKey: 'post_id', targetKey: 'id', constraints: false });
		}
	}

	PostFilterMulti.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			post_id: field(DataTypes.BIGINT.UNSIGNED, '게시물 인덱스', false),
			board_config_id: field(DataTypes.BIGINT.UNSIGNED, '게시판 설정 인덱스', false),
			post_filter_type: field(DataTypes.ENUM(PostFilterMultiType.values()), '필터 타입', true, { defaultValue: null }),
			post_filter_id: field(DataTypes.BIGINT.UNSIGNED, '필터 인덱스', true, { defaultValue: null }),
		},
		// options
		{
			timestamps: true,
			createdAt: false,
			updatedAt: false,
			tableName: 'post_filter_multi',
			comment: '게시물 다중 필터',
			indexes: [{ fields: ['post_id'] }, { fields: ['board_config_id'] }, { fields: ['post_filter_id'] }],
			sequelize,
		},
	);

	return PostFilterMulti;
};
