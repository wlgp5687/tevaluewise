'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsDeleted } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class CafeBoardConfig extends Model {
		static associate(models) {
			CafeBoardConfig.belongsTo(models.Cafe, { as: 'cafe', foreignKey: 'cafe_id', targetKey: 'id', constraints: false });
			CafeBoardConfig.belongsTo(models.BoardConfig, { as: 'board_config', foreignKey: 'board_config_id', targetKey: 'id', constraints: false });
		}
	}

	CafeBoardConfig.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			cafe_id: field(DataTypes.BIGINT.UNSIGNED, 'cafes.id(FK)', false),
			board_config_id: field(DataTypes.BIGINT.UNSIGNED, 'board_config.id(FK)', false),
			name: field(DataTypes.STRING(255), '게시판 이름', false),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제 여부', false, { defaultValue: IsDeleted.N.values }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'cafe_board_config',
			comment: '카페 게시판 설정',
			indexes: [
				{ name: 'board_config_id', fields: ['staboard_config_idrt_date'] },
				{ name: 'cafe_board_config_ik_is_deleted', fields: ['is_deleted'] },
			],
			sequelize,
		},
	);

	return CafeBoardConfig;
};
