'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsDeleted } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class BoardConfig extends Model {
		static associate(models) {}
	}

	BoardConfig.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id(PK)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			board_name: field(DataTypes.STRING(128), '게시판 이름', false),
			board_desc: field(DataTypes.STRING(255), '게시판 설명', true),
			board_type: field(DataTypes.INTEGER.UNSIGNED, '', false),
			creater_member_id: field(DataTypes.BIGINT.UNSIGNED, '생성자 아이디', false),
			admin_member_id: field(DataTypes.BIGINT.UNSIGNED, '관리자 아이디', false),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제여부', false, { defaultValue: IsDeleted.N.values }),
			seo_title: field(DataTypes.STRING(128), '검색 노출용 타이틀 태그', true),
			seo_desc: field(DataTypes.STRING(255), '검색 노출용 디스크립션', true),
			seo_keywords: field(DataTypes.STRING(255), '검색 노출용 키워드', true),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'board_config',
			comment: '게시판 설정',
			indexes: [],
			sequelize,
		},
	);

	return BoardConfig;
};
