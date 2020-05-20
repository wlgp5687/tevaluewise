'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CafePost extends Model {
		static associate(models) {
			CafePost.belongsTo(models.Cafe, { as: 'cafe', foreignKey: 'cafe_id', targetKey: 'id', constraints: false });
			CafePost.belongsTo(models.BoardPost, { as: 'board_post', foreignKey: 'board_posts_id', targetKey: 'id', constraints: false });
		}
	}

	CafePost.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			cafe_id: field(DataTypes.BIGINT.UNSIGNED, 'cafes.id(FK)', false),
			board_posts_id: field(DataTypes.BIGINT.UNSIGNED, 'board_posts.id(FK)', false),
		},
		// options
		{
			timestamps: false,
			tableName: 'cafe_posts',
			comment: '카페 소속 게시물',
			indexes: [{ name: 'ik_board_posts_id', fields: ['board_posts_id'] }],
			sequelize,
		},
	);

	return CafePost;
};
