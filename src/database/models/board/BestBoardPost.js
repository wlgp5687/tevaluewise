'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class BestBoardPost extends Model {
		static associate(models) {
			BestBoardPost.hasOne(models.BoardConfig, { as: 'board_config', foreignKey: 'id', sourceKey: 'board_config_id', constraints: false });
			BestBoardPost.hasOne(models.BoardPost, { as: 'board_post', foreignKey: 'id', sourceKey: 'id', constraints: false });
		}
	}

	BestBoardPost.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			board_config_id: field(DataTypes.BIGINT.UNSIGNED, '게시판 설정 인덱스', false),
			comment_count: field(DataTypes.INTEGER.UNSIGNED, '리플 카운트', false, { defaultValue: 0 }),
			read_count: field(DataTypes.INTEGER.UNSIGNED, '열람 횟수', false, { defaultValue: 0 }),
			like_count: field(DataTypes.INTEGER.UNSIGNED, '추천 카운트', false, { defaultValue: 0 }),
			board_post_total: field(DataTypes.BIGINT.UNSIGNED, '총점', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'best_board_post',
			comment: '게시물 best',
			sequelize,
		},
	);

	return BestBoardPost;
};
