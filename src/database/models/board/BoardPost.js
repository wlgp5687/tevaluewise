'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsDeleted, IsNotice, IsSecret, BlameStatus, AllowScroll, IsBlank } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class BoardPost extends Model {
		static associate(models) {
			BoardPost.hasOne(models.BoardConfig, { as: 'board_config', foreignKey: 'id', sourceKey: 'board_config_id', constraints: false });
			BoardPost.hasOne(models.Member, { as: 'member', foreignKey: 'id', sourceKey: 'member_id', constraints: false });
			BoardPost.hasOne(models.PostFilter, { as: 'post_filter', foreignKey: 'post_id', sourceKey: 'id', constraints: false });
			BoardPost.hasOne(models.BestBoardPost, { as: 'best_board_post', foreignKey: 'id', sourceKey: 'id', constraints: false });
			BoardPost.hasOne(models.EventConfig, { as: 'event_config', foreignKey: 'post_id', sourceKey: 'id', constraints: false });
			BoardPost.hasMany(models.PostFilterMulti, { as: 'post_filter_multi', foreignKey: 'post_id', sourceKey: 'id', constraints: false });
			BoardPost.hasMany(models.PostFile, { as: 'post_file', foreignKey: 'post_id', sourceKey: 'id', constraints: false });
			BoardPost.belongsToMany(models.Cafe, { as: 'cafe', through: models.CafePost, foreignKey: 'board_posts_id', otherKey: 'cafe_id' });
		}
	}

	BoardPost.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, '게시물 아이디(id)', false, { unique: true, primaryKey: true, autoIncrement: true }),
			board_config_id: field(DataTypes.BIGINT.UNSIGNED, '게시판 설정 아이디', true),
			member_id: field(DataTypes.BIGINT.UNSIGNED, '작성자 회원 아이디', false),
			parent_post_id: field(DataTypes.BIGINT.UNSIGNED, '부모 게시물 아이디', true, { defaultValue: null }),
			group_id: field(DataTypes.BIGINT.UNSIGNED, '게시물 그룹 id', true, { defaultValue: null }),
			depth: field(DataTypes.TINYINT(1).UNSIGNED, '게시물 깊이', false, { defaultValue: 1 }),
			sort_no: field(DataTypes.BIGINT.UNSIGNED, 'sort_id', false),
			is_deleted: field(DataTypes.ENUM(IsDeleted.values()), '삭제여부', false, { defaultValue: IsDeleted.N.values }),
			is_notice: field(DataTypes.ENUM(IsNotice.values()), '공지여부', false, { defaultValue: IsNotice.N.values }),
			is_secret: field(DataTypes.ENUM(IsSecret.values()), '비밀글여부', false, { defaultValue: IsSecret.N.values }),
			blame_status: field(DataTypes.ENUM(BlameStatus.values()), '신고상태', false, { defaultValue: BlameStatus.NORMAL.values }),
			allow_scroll: field(DataTypes.ENUM(AllowScroll.values()), '비회원 스크롤 승인 여부', false, { defaultValue: AllowScroll.N.values }),
			title: field(DataTypes.STRING(255), '제목', false),
			contents: field(DataTypes.TEXT, '내용', false),
			link_url: field(DataTypes.STRING(255), '링크 URL', true),
			is_blank: field(DataTypes.ENUM(IsBlank.values()), '새창여부', false, { defaultValue: IsBlank.Y.values }),
			author: field(DataTypes.STRING(50), '소유자', true, { defaultValue: '' }),
			comment_count: field(DataTypes.INTEGER.UNSIGNED, '리플 카운트', false, { defaultValue: 0 }),
			read_count: field(DataTypes.INTEGER.UNSIGNED, '열람 횟수', false, { defaultValue: 0 }),
			attached_file_count: field(DataTypes.TINYINT(4).UNSIGNED, '첨부파일 수', false, { defaultValue: 0 }),
			content_file_count: field(DataTypes.TINYINT(4).UNSIGNED, '컨텐츠 파일 수', false, { defaultValue: 0 }),
			thumbnail_file_count: field(DataTypes.TINYINT(4).UNSIGNED, '썸네일 파일 수', false, { defaultValue: 0 }),
			like_count: field(DataTypes.INTEGER.UNSIGNED, '추천 카운트', false, { defaultValue: 0 }),
			dislike_count: field(DataTypes.INTEGER.UNSIGNED, '비추천 카운트', false, { defaultValue: 0 }),
			device_info: field(DataTypes.STRING(128), '작성 기기 정보', false, { defaultValue: '' }),
			created_ip: field(DataTypes.STRING(39), '작성 IP', false, { defaultValue: '' }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'board_posts',
			comment: '게시물 테이블',
			indexes: [{ fields: ['board_config_id'] }, { fields: ['member_id'] }],
			sequelize,
		},
	);

	return BoardPost;
};
