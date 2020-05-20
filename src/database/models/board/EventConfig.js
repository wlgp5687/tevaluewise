'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { EventStatus } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class EventConfig extends Model {
		static associate(models) {
			EventConfig.hasOne(models.BoardConfig, { as: 'board_config', foreignKey: 'id', sourceKey: 'board_config_id', constraints: false });
			EventConfig.hasOne(models.BoardPost, { as: 'board_post', foreignKey: 'id', sourceKey: 'post_id', constraints: false });
		}
	}

	EventConfig.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			post_id: field(DataTypes.BIGINT.UNSIGNED, '게시물 인덱스', false),
			board_config_id: field(DataTypes.BIGINT.UNSIGNED, '게시판 설정 인덱스', false),
			sub_title: field(DataTypes.STRING(255), '부제목', false),
			event_start_date: field(DataTypes.DATE, '이벤트 시작일', true, { defaultValue: null }),
			event_end_date: field(DataTypes.DATE, '이벤트 종료일', true, { defaultValue: null }),
			event_status: field(DataTypes.ENUM(EventStatus.values()), '이벤트 상태', true, { defaultValue: EventStatus.PROGRESS.values }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'event_config',
			comment: '게시물 단일 필터',
			indexes: [{ fields: ['event_start_date'] }, { fields: ['event_end_date'] }, { fields: ['event_status'] }],
			sequelize,
		},
	);

	return EventConfig;
};
