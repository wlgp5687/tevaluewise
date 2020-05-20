import { getModel, sequelize, Op } from '../../database';

import * as instituteComponent from '../institute/institute';
import * as regionComponent from '../region/region';
import * as tutorComponent from '../tutor/tutor';
import * as subjectComponent from '../subject/subject';
import * as cafeComponent from '../cafe/cafe';

const BoardPost = getModel('BoardPost');
const PostFilter = getModel('PostFilter');
const PostFilterMulti = getModel('PostFilterMulti');
const PostFile = getModel('PostFile');
const PostFileCountLog = getModel('PostFileCountLog');
const PostCountLog = getModel('PostCountLog');
const PostComment = getModel('PostComment');
const PostCommentCountLog = getModel('PostCommentCountLog');
const Member = getModel('Member');
const MemberAttribute = getModel('MemberAttribute');
const Institute = getModel('Institute');
const InstituteAttribute = getModel('InstituteAttribute');
const Tutor = getModel('Tutor');
const TutorAttribute = getModel('TutorAttribute');
const Filter = getModel('Filter');
const EventConfig = getModel('EventConfig');
const Cafe = getModel('Cafe');
const BestBoardPost = getModel('BestBoardPost');

/**
 * @description postId로 첨부파일 조회
 * @param {Int} postId
 */
export const getPostFilesByPostId = async (postId) => {
	const response = await PostFile.findAll({
		attributes: ['id', 'post_id', 'file_type', 'org_file_name', 's3_file_name', 'file_ext', 'file_url', 's3_key', 'is_deleted', 'byte_size', 'img_width', 'img_height', 'download_count'],
		where: { post_id: postId, is_deleted: 'N' },
	});
	return response;
};

/**
 * @description 언론속의 선생님 목록 조회
 * @param {Int} targetId
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getTutorPressBoardPosts = async (targetId, offset = 0, limitParam = 5) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const boardConfigId = 1;

	const sql = {
		where: { parent_post_id: null, depth: 1, is_deleted: 'N' },
		include: [
			{
				model: PostFilterMulti,
				as: 'post_filter_multi',
				attributes: [],
				where: { board_config_id: boardConfigId, post_filter_type: 'tutor', [Op.or]: [{ post_filter_id: targetId }, { post_filter_id: null }] },
				required: true,
			},
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'author',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'created_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = [
			['attached_file_count', 'DESC'],
			['is_notice', 'ASC'],
			['created_at', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);

		// eslint-disable-next-line no-await-in-loop
		for (let i = 0; i < postsData.length; i += 1) postsData[i].dataValues.post_file = await getPostFilesByPostId(postsData[i].dataValues.id);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response;
};

/**
 * @description 언론속의 학원 & 학교소식 목록 조회
 * @param {Int} targetId
 * @param {Int} offset
 * @param {Int} limitparam
 */
export const getInstitutePressBoardPosts = async (targetId, offset = 0, limitparam = 5) => {
	// 최대 조회수 제한
	const limit = parseInt(limitparam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitparam;

	let response = null;
	const boardConfigId = 1;

	const sql = {
		where: { is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: [], where: { board_config_id: boardConfigId, [Op.or]: [{ institute_id: targetId }, { institute_id: null }] }, required: true },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'author',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'created_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = [
			['attached_file_count', 'DESC'],
			['is_notice', 'ASC'],
			['created_at', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);

		// eslint-disable-next-line no-await-in-loop
		for (let i = 0; i < postsData.length; i += 1) postsData[i].dataValues.post_file = await getPostFilesByPostId(postsData[i].dataValues.id);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description 별별수다 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getTalkBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	const common = searchFields.common ? searchFields.common : null;

	let response = null;
	const boardConfigId = boardPost && boardPost.is_notice === 'Y' ? [2] : [2, 11];

	// 검색 조건
	const values = { board_config_id: boardConfigId, offset: parseInt(offset, 10), limit: parseInt(limit, 10) };
	if (postFilter) {
		values.is_talk = postFilter.is_talk || null;
		values.lv1_id = postFilter.lv1_id || null;
		values.institute_id = postFilter.institute_id || null;
	}
	if (boardPost) {
		values.is_notice = boardPost.is_notice || null;
		values.is_deleted = boardPost.is_deleted || null;
	}
	if (common) {
		values.post_auth = common.post_auth || null;
		values.keyword = common.keyword ? `%${common.keyword}%` : null;
		values.order = common.order ? `%${common.order}%` : null;
	}

	// prettier-ignore
	const sql = [
		'FROM ( ',
		'	SELECT  ',
		'   	`board_posts`.`id`, ',
		'		`board_posts`.`board_config_id`, ',
		'		`board_posts`.`parent_post_id`, ',
		'		`board_posts`.`group_id`, ',
		'		`board_posts`.`depth`, ',
		'		`board_posts`.`sort_no`, ',
		'		`board_posts`.`member_id`, ',
		'		`board_posts`.`is_deleted`, ',
		'		`board_posts`.`is_notice`, ',
		'		`board_posts`.`is_secret`, ',
		'		`board_posts`.`blame_status`, ',
		'		`board_posts`.`title`, ',
		'		`board_posts`.`comment_count`, ',
		'		`board_posts`.`read_count`, ',
		'		`board_posts`.`attached_file_count`, ',
		'		`board_posts`.`content_file_count`, ',
		'		`board_posts`.`thumbnail_file_count`, ',
		'		`board_posts`.`like_count`, ',
		'		`board_posts`.`dislike_count`, ',
		'		`board_posts`.`device_info`, ',
		'		`board_posts`.`created_at`, ',
		'        ( ',
		'			SELECT COUNT(`post_filter_multi`.`id`)  ',
		'            FROM `post_filter_multi`  ',
		'            WHERE `post_filter_multi`.`post_id` = `board_posts`.`id` ',
		'		) AS `tutor_count` ',
		'   FROM `board_posts` ',
		') AS `board_posts` ',
		'INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'INNER JOIN `members` ON `members`.`id` = `board_posts`.`member_id` ',
		'INNER JOIN `member_attributes` ON `member_attributes`.`member_id` = `members`.`id` ',
		'LEFT JOIN `institutes` ON `institutes`.`id` = `post_filter`.`institute_id` ',
		'WHERE `board_posts`.`id` IS NOT NULL ',
		values.board_config_id ? 'AND `post_filter`.`board_config_id` IN ( :board_config_id ) ' : ' ',
		// eslint-disable-next-line no-nested-ternary
		values.is_talk ? (values.lv1_id ? ('AND (`post_filter`.`lv1_id` = :lv1_id OR `post_filter`.`lv1_id` IS NULL) ') : ('AND `post_filter`.`lv1_id` IS NULL ')) : 
		// eslint-disable-next-line no-nested-ternary
		(values.lv1_id === 'talk' ? ('AND `post_filter`.`lv1_id` IS NULL ' ) :( ( values.lv1_id ) ? ( 'AND `post_filter`.`lv1_id` = :lv1_id ' ): (' '))), 
		values.institute_id ? 'AND `post_filter`.`institute_id` = :institute_id ' : ' ',
		// eslint-disable-next-line no-nested-ternary
		values.post_auth ? (
			// eslint-disable-next-line no-nested-ternary
			values.post_auth === 'normal_post' ?
				('AND `board_posts`.`tutor_count` < 1 ') :
				(values.post_auth === 'tutor_post' ?
					('AND `board_posts`.`tutor_count` > 0 ') :
					' ')
		) : ' ',
		'AND `board_posts`.`is_deleted` = "N" ',
		'AND `board_posts`.`parent_post_id` IS NULL ',
		'AND `board_posts`.`depth` = 1 ',
		values.is_notice ? 'AND `board_posts`.`is_notice` = :is_notice ' : ' ',
		values.is_deleted ? 'AND `board_posts`.`is_deleted` = :is_deleted ' : ' ',
		values.keyword ? 'AND ( `board_posts`.`title` like :keyword ) ' : ' ',
		// eslint-disable-next-line no-nested-ternary
		values.order ? (
			// eslint-disable-next-line no-nested-ternary
			values.order === 'last_at' ?
				('ORDER BY `board_posts`.`created_at` DESC, `board_posts`.`id` DESC ') :
				// eslint-disable-next-line no-nested-ternary
				(values.order === 'view_count' ?
					('ORDER BY `board_posts`.`read_count` DESC, `board_posts`.`id` DESC ') :
					(values.order === 'recommend_count' ?
						('ORDER BY `board_posts`.`like_count` DESC, `board_posts`.`id` DESC ') :
						' ')
				)
		) : 'ORDER BY `board_posts`.`created_at` DESC, `board_posts`.`id` DESC '
	].join(' ');

	const countSql = ['SELECT ', '	COUNT(`board_posts`.`id`) AS `total` '].join(' ') + sql;

	// Total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const boardPostSql =
			[
				'SELECT  ',
				'	`board_posts`.`*`, ',
				'	`post_filter`.`board_config_id`, ',
				'	`post_filter`.`lv05_id`, ',
				'	`post_filter`.`lv1_id`, ',
				'	`post_filter`.`institute_id`, ',
				'	`members`.`user_id`, ',
				'	`members`.`nickname`, ',
				'	`members`.`join_site`, ',
				'	`members`.`join_type`, ',
				'	`members`.`join_ip`, ',
				'	`member_attributes`.`name`, ',
				'	`member_attributes`.`thumbnail`, ',
				'	`member_attributes`.`sex`, ',
				'	`institutes`.`name_ko` AS `institutes.name_ko`, ',
				'	`institutes`.`name_en` AS `institutes.name_en`, ',
				'	`institutes`.`campus` AS `institutes.campus`, ',
				'	`institutes`.`type` AS `institutes.type`, ',
				'	`institutes`.`is_deleted` AS `institutes.is_deleted`, ',
				'	`institutes`.`is_confirm` AS `institutes.is_confirm`, ',
				'	`institutes`.`has_online` AS `institutes.has_online`, ',
				'	`institutes`.`has_review` AS `institutes.has_review` ',
			].join(' ') +
			sql +
			(values.is_notice !== 'Y' ? 'LIMIT :offset, :limit; ' : ' ');

		// 게시물 정보 조회
		const postsData = await sequelize.query(boardPostSql, { type: sequelize.QueryTypes.SELECT, replacements: values });

		const posts = [];

		for (let i = 0; i < postsData.length; i += 1) {
			let institute = null;

			if (postsData[i].institute_id != null) {
				// eslint-disable-next-line no-await-in-loop
				institute = await instituteComponent.getInstituteById(postsData[i].institute_id);
				delete institute.id;
				delete institute.attribute.dataValues.address;
				delete institute.attribute.dataValues.post;
				delete institute.attribute.dataValues.phone;
				delete institute.attribute.dataValues.geo_latitude;
				delete institute.attribute.dataValues.geo_longitude;
				delete institute.region;
				delete institute.subject;
				delete institute.children;
				delete institute.has_high_families;
				delete institute.has_sub_families;
				delete institute.is_follow;
			}

			let tutor = null;
			if (postsData[i].board_config_id === 11) {
				const cafeId = await cafeComponent.getCafeIdBypostId(postsData[i].id); // eslint-disable-line no-await-in-loop
				const tutorId = await cafeComponent.getTutorIdByCafeId(cafeId); // eslint-disable-line no-await-in-loop
				const subjects = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(tutorId, postsData[i].lv1_id); // eslint-disable-line no-await-in-loop
				tutor = await tutorComponent.getTutorDataById(tutorId); // eslint-disable-line no-await-in-loop
				if (tutor) tutor = { ...tutor, subject: subjects };
			}

			const tmpData = {
				id: postsData[i].id,
				board_config_id: postsData[i].board_config_id,
				parent_post_id: postsData[i].parent_post_id,
				group_id: postsData[i].group_id,
				depth: postsData[i].depth,
				sort_no: postsData[i].sort_no,
				member_id: postsData[i].member_id,
				is_deleted: postsData[i].is_deleted,
				is_notice: postsData[i].is_notice,
				is_secret: postsData[i].is_secret,
				blame_status: postsData[i].blame_status,
				title: postsData[i].title,
				contents: postsData[i].contents,
				comment_count: postsData[i].comment_count,
				read_count: postsData[i].read_count,
				attached_file_count: postsData[i].attached_file_count,
				content_file_count: postsData[i].content_file_count,
				thumbnail_file_count: postsData[i].thumbnail_file_count,
				like_count: postsData[i].like_count,
				dislike_count: postsData[i].dislike_count,
				device_info: postsData[i].device_info,
				created_at: postsData[i].created_at,
				post_filter: { lv05_id: postsData[i].lv05_id, lv1_id: postsData[i].lv1_id, institute_id: postsData[i].institute_id, institute: institute || null },
				member: {
					user_id: postsData[i].user_id,
					nickname: postsData[i].nickname,
					join_site: postsData[i].join_site,
					join_type: postsData[i].join_type,
					join_ip: postsData[i].join_ip,
					attribute: { name: postsData[i].name, thumbnail: postsData[i].thumbnail, sex: postsData[i].sex },
				},
				tutor,
			};
			posts[i] = tmpData;
		}
		response = { total, list: posts };
	}

	// Return
	return response || null;
};

/**
 * @description 합격수기 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getEssayBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	const postFilterMulti = searchFields.post_filter_multi ? searchFields.post_filter_multi : null;

	let response = null;
	const boardConfigId = 3;
	let tutorId = null;

	// 검색 필터
	const boardPostAttr = { board_config_id: boardConfigId, parent_post_id: null, depth: 1 };
	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
	}

	// postFilter
	const postFilterAttr = { board_config_id: boardConfigId, lv1_id: postFilter.lv1_id };
	if (postFilter) {
		if (postFilter.year) {
			if (postFilter.year.split('|').includes('2015') || postFilter.year.split('|').includes(2015)) {
				postFilterAttr.year = { [Op.or]: [{ [Op.in]: postFilter.year.split('|') }, { [Op.lte]: '2015' }] };
			} else {
				postFilterAttr.year = { [Op.in]: postFilter.year.split('|') };
			}
		}
		if (postFilter.subject_filter_id) postFilterAttr.subject_filter_id = { [Op.in]: postFilter.subject_filter_id.split('|') };
		if (postFilter.lecture_type) postFilterAttr.lecture_type = { [Op.in]: postFilter.lecture_type.split('|') };
		if (postFilter.gong_grade_filter_id) postFilterAttr.gong_grade_filter_id = { [Op.in]: postFilter.gong_grade_filter_id.split('|') };
		if (postFilter.gong_local_region) postFilterAttr.gong_local_region = { [Op.in]: postFilter.gong_local_region.split('|') };
		if (postFilter.sub_filter_id) postFilterAttr.sub_filter_id = { [Op.in]: postFilter.sub_filter_id.split('|') };
		if (postFilter.certificate_filter_id) postFilterAttr.certificate_filter_id = { [Op.in]: postFilter.certificate_filter_id.split('|') };
		if (postFilter.gong_serial_filter_id) postFilterAttr.gong_serial_filter_id = { [Op.in]: postFilter.gong_serial_filter_id.split('|') };
		if (postFilter.sex) postFilterAttr.sex = { [Op.in]: postFilter.sex.split('|') };
		if (postFilter.gong_speciality_part_filter_id) postFilterAttr.gong_speciality_part_filter_id = { [Op.in]: postFilter.gong_speciality_part_filter_id.split('|') };
		if (postFilter.appointment_subtype) postFilterAttr.appointment_subtype = { [Op.in]: postFilter.appointment_subtype.split('|') };
		if (postFilter.appointment_local_region) postFilterAttr.appointment_local_region = { [Op.in]: postFilter.appointment_local_region.split('|') };
		if (postFilter.transfer_filter_id) postFilterAttr.transfer_filter_id = { [Op.in]: postFilter.transfer_filter_id.split('|') };
		if (postFilter.institute_id) tutorId = await tutorComponent.getTutorIdsByFilterIdAndInstituteId(postFilter.lv1_id, postFilter.institute_id);
	}

	// postFilterMulti
	const postFIlterMultiAttr = {};
	if (postFilterMulti) {
		postFIlterMultiAttr.post_filter_type = 'tutor';
		postFIlterMultiAttr.post_filter_id = postFilterMulti.post_filter_id;
	}

	if (tutorId && !postFilterMulti) {
		postFIlterMultiAttr.post_filter_type = 'tutor';
		postFIlterMultiAttr.post_filter_id = { [Op.in]: tutorId };
	}

	const sql = {
		where: boardPostAttr,
		include: [
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: [
					'lv05_id',
					'lv1_id',
					'lecture_type',
					'sex',
					'transfer_filter_id',
					'appointment_subtype',
					'appointment_local_region',
					'subject_filter_id',
					'year',
					'gong_local_region',
					'gong_speciality_part_filter_id',
					'gong_grade_filter_id',
					'gong_serial_filter_id',
					'sub_filter_id',
					'certificate_filter_id',
				],
				where: postFilterAttr,
				required: true,
			},
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
			// eslint-disable-next-line no-unneeded-ternary
			{ model: PostFilterMulti, as: 'post_filter_multi', attributes: [], where: postFIlterMultiAttr, required: postFilterMulti ? true : false },
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'device_info',
			'created_ip',
			'created_at',
			'updated_at',
		];

		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description 별별질문 / Q&A 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getQnaBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	const postFilterMulti = searchFields.post_filter_multi ? searchFields.post_filter_multi : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;
	const boardConfigId = 4;

	// 검색 필터
	let boardPostAttr = { board_config_id: boardConfigId, parent_post_id: null, depth: 1 };
	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
	}

	const postFilterAttr = {};
	if (postFilter) {
		if (postFilter.lv1_id) postFilterAttr.lv1_id = postFilter.lv1_id;
		if (postFilter.answer_status) postFilterAttr.answer_status = postFilter.answer_status;
	}

	let postFilterMultiAttr = {};
	if (postFilterMulti && postFilterMulti.tutor_id)
		postFilterMultiAttr = { ...postFilterMultiAttr, board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: postFilterMulti.tutor_id };

	if (common && common.keyword) boardPostAttr = { ...boardPostAttr, [Op.or]: [{ title: { [Op.like]: `%${common.keyword}%` } }, { contents: { [Op.like]: `%${common.keyword}%` } }] };

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'answer_status'], where: postFilterAttr, required: true },
			{
				model: PostFilterMulti,
				as: 'post_filter_multi',
				attributes: ['post_filter_type', 'post_filter_id'],
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
				],
				where: postFilterMultiAttr,
				required: postFilterMulti ? true : false, // eslint-disable-line no-unneeded-ternary
			},
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'device_info',
			'created_ip',
			'created_at',
			'updated_at',
		];

		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}

		if (common && common.order) {
			if (common.order === 'last_at')
				sql.order = [
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (common.order === 'view_count')
				sql.order = [
					['read_count', 'DESC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (common.order === 'recommend_count')
				sql.order = [
					['like_count', 'DESC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (common.order === 'comment_count')
				sql.order = [
					['comment_count', 'DESC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
		} else {
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		}

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description 별별정보 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getInfoBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;
	const boardConfigId = 5;

	let boardPostAttr = { board_config_id: boardConfigId, parent_post_id: null, depth: 1 };
	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
	}

	if (common && common.keyword) boardPostAttr = { ...boardPostAttr, [Op.or]: [{ title: { [Op.like]: common.keyword } }] };

	const postFilterAttr = { board_config_id: boardConfigId };
	if (postFilter) {
		if (postFilter.lv1_id) postFilterAttr.lv1_id = postFilter.lv1_id;
		if (postFilter.info_category) postFilterAttr.info_category = postFilter.info_category;
	}

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'info_category'], where: postFilterAttr, required: true },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'device_info',
			'created_ip',
			'created_at',
			'updated_at',
		];

		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}

		if (common && common.order) {
			if (common.order === 'last_at')
				sql.order = [
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (common.order === 'view_count')
				sql.order = [
					['read_count', 'DESC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (common.order === 'recommend_count')
				sql.order = [
					['like_count', 'DESC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
		} else {
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		}

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description 별별Best 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getBestBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const dateFilter = searchFields.date_filter ? searchFields.date_filter : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;

	let response = null;

	const values = {
		board_config_id: [2, 5, 10, 11],
		is_deleted: boardPost.is_deleted || null,
		is_notice: boardPost.is_notice || null,
		lv1_id: postFilter ? postFilter.lv1_id : null,
		date: dateFilter ? dateFilter.thisweek : null,
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	};

	const sql = [
		'SELECT  ',
		'	`board_posts`.`*`, ',
		'	`members`.`user_id`, ',
		'	`members`.`nickname`, ',
		'	`members`.`join_type`, ',
		'	`member_attributes`.`name`, ',
		'	`member_attributes`.`sex`, ',
		'	`member_attributes`.`thumbnail`, ',
		'	`member_attributes`.`default_thumbnail`, ',
		'	`tutors`.`id` as `tutor_id`, ',
		'	`tutors`.`name` as `tutor_name`, ',
		'	`tutor_attributes`.`sex` as `tutor_sex`, ',
		'	`tutor_attributes`.`profile` as `tutor_profile` ',
		'FROM ( ',
		'	SELECT ',
		'		`board_posts`.`id`, ',
		'		`board_posts`.`board_config_id`, ',
		'		`board_posts`.`member_id`, ',
		'		`board_posts`.`sort_no`, ',
		'		`board_posts`.`created_ip`, ',
		'		`board_posts`.`created_at`, ',
		'		`board_posts`.`updated_at`, ',
		'		`board_posts`.`is_deleted`, ',
		'		`board_posts`.`is_notice`, ',
		'		`board_posts`.`title`, ',
		'		`board_posts`.`comment_count`, ',
		'		`board_posts`.`read_count`, ',
		'		`board_posts`.`like_count`, ',
		'		`post_filter`.`lv05_id`, ',
		'		`post_filter`.`lv1_id`, ',
		'		`best_board_post`.`board_post_total` ',
		'	FROM `board_posts` ',
		'	INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'	INNER JOIN `best_board_post` ON `best_board_post`.`id` = `board_posts`.`id` ',
		'	WHERE `board_posts`.`id` IS NOT NULL ',
		'	AND `board_posts`.`board_config_id` IN (:board_config_id) ',
		values.is_deleted ? '	AND `board_posts`.`is_deleted` = :is_deleted ' : ' ',
		values.is_notice ? '	AND `board_posts`.`is_notice` = :is_notice ' : ' ',
		values.lv1_id ? '	AND `post_filter`.`lv1_id` = :lv1_id ' : ' ',
		values.date ? '	AND `board_posts`.`created_at` >= :date ' : ' ',
		'	ORDER BY `best_board_post`.`board_post_total` DESC ',
		'	LIMIT 0, 10 ',
		') AS `board_posts` ',
		'INNER JOIN `members` ON `members`.`id` = `board_posts`.`member_id` ',
		'INNER JOIN `member_attributes` ON `member_attributes`.`member_id` = `members`.`id` ',
		'INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'LEFT JOIN `cafe_posts` ON `cafe_posts`.`board_posts_id` = `board_posts`.`id` ',
		'LEFT JOIN `cafes` ON `cafes`.`id` = `cafe_posts`.`cafe_id` ',
		'LEFT JOIN `cafe_tutors` ON `cafe_tutors`.`cafe_id` = `cafe_posts`.`cafe_id` ',
		'LEFT JOIN `tutors` ON `tutors`.`id` = `cafe_tutors`.`tutor_id` ',
		'LEFT JOIN `tutor_attributes` ON `tutor_attributes`.`tutor_id` = `tutors`.`id` ',
		'ORDER BY `board_posts`.`board_post_total` DESC; ',
	].join(' ');

	const bestPostData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	const bestPosts = [];
	for (let i = 0; i < bestPostData.length; i += 1) {
		const tutorSubject = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(bestPostData[i].tutor_id, bestPostData[i].lv1_id); // eslint-disable-line no-await-in-loop
		const tmpbestPost = {
			id: bestPostData[i].id,
			board_config_id: bestPostData[i].board_config_id,
			member_id: bestPostData[i].member_id,
			sort_no: bestPostData[i].sort_no,
			created_ip: bestPostData[i].created_ip,
			created_at: bestPostData[i].created_at,
			updated_at: bestPostData[i].updated_at,
			is_deleted: bestPostData[i].is_deleted,
			is_notice: bestPostData[i].is_notice,
			title: bestPostData[i].title,
			comment_count: bestPostData[i].comment_count,
			read_count: bestPostData[i].read_count,
			like_count: bestPostData[i].like_count,
			post_filter: { lv05_id: bestPostData[i].lv05_id, lv1_id: bestPostData[i].lv1_id },
			member: {
				user_id: bestPostData[i].user_id,
				nickname: bestPostData[i].nickname,
				join_type: bestPostData[i].join_type,
				attribute: { name: bestPostData[i].name, sex: bestPostData[i].sex, thumbnail: bestPostData[i].thumbnail, default_thumbnail: bestPostData[i].default_thumbnail },
			},
			board_post_total: bestPostData[i].board_post_total,
			tutor: { id: bestPostData[i].tutor_id, name: bestPostData[i].tutor_name, attribute: { sex: bestPostData[i].tutor_sex, profile: bestPostData[i].tutor_profile }, subject: tutorSubject },
		};
		bestPosts.push(tmpbestPost);
	}
	if (Object.keys(bestPosts).length > 0) response = { list: bestPosts };

	return response;
};

/**
 * @description 기출문제 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getExamBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	let response = null;
	const boardConfigId = 6;

	const boardPostAttr = { board_config_id: boardConfigId, parent_post_id: null, depth: 1 };
	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
	}

	const postFilterAttr = { board_config_id: boardConfigId, lv1_id: postFilter.lv1_id };
	if (postFilter) {
		if (postFilter.subject_filter_id) postFilterAttr.subject_filter_id = { [Op.in]: postFilter.subject_filter_id.split('|') };
		if (postFilter.gong_grade_filter_id) postFilterAttr.gong_grade_filter_id = { [Op.in]: postFilter.gong_grade_filter_id.split('|') };
		if (postFilter.gong_local_region) postFilterAttr.gong_local_region = { [Op.in]: postFilter.gong_local_region.split('|') };
		if (postFilter.year) {
			const years = postFilter.year.split('|');
			if (years.includes('2015')) {
				// 2015 remove
				years.splice(years.indexOf('2015'), 1);
				postFilterAttr.year = { [Op.or]: [{ [Op.in]: years }, { [Op.lte]: '2015' }] };
			} else {
				postFilterAttr.year = { [Op.in]: years };
			}
		}
	}

	const sql = {
		where: boardPostAttr,
		include: [
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'subject_filter_id', 'year', 'gong_local_region', 'gong_grade_filter_id'],
				where: postFilterAttr,
				required: true,
			},
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'device_info',
			'created_ip',
			'created_at',
			'updated_at',
		];

		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description 적폐청산 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getReportBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;
	const boardConfigId = 7;

	let boardPostAttr = { board_config_id: boardConfigId, parent_post_id: null, depth: 1 };

	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
	}
	if (common && common.keyword) boardPostAttr = { ...boardPostAttr, [Op.or]: [{ title: { [Op.like]: common.keyword } }] };

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'answer_status'], required: true },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'device_info',
			'created_ip',
			'created_at',
			'updated_at',
		];

		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description FAQ 목록 조회
 * @param {Array} faqCategory
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getFaqBoardPosts = async (faqCategory, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const boardConfigId = 8;

	// boardPost
	const boardPostAttr = { parent_post_id: null, depth: 1, is_deleted: 'N' };

	// postFilter
	const postFilterAttr = { board_config_id: boardConfigId };
	if (faqCategory) postFilterAttr.faq_category = faqCategory;

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'faq_category'], where: postFilterAttr, required: true },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'created_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = [
			['is_notice', 'ASC'],
			['created_at', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

/**
 * @description 이벤트 목록 조회
 * @param {String} eventStatus
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getEventBoardPosts = async (eventStatus, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const boardConfigId = 9;

	// boardPost
	const boardPostAttr = { parent_post_id: null, depth: 1, is_deleted: 'N' };

	// postFilter
	const postFilterAttr = { board_config_id: boardConfigId };

	// eventConfir
	const eventConfigAttr = {};
	if (eventStatus) eventConfigAttr.event_status = eventStatus;

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id'], where: postFilterAttr, required: true },
			{ model: EventConfig, as: 'event_config', attributes: ['sub_title', 'event_start_date', 'event_end_date', 'event_status'], where: eventConfigAttr, required: true },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				required: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'created_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = [
			['is_notice', 'ASC'],
			['created_at', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		for (let i = 0; i < postsData.length; i += 1) postsData[i].dataValues.post_file = await getPostFilesByPostId(postsData[i].dataValues.id); // eslint-disable-line no-await-in-loop
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

// 게시물 추천 & 비추천 로그 삭제
export const deleteBoardPostCount = async (postId, type, memberId, t) => {
	const response = await PostCountLog.destroy({ where: { post_id: postId, post_count_log_type: type, member_id: memberId }, transaction: t });
	return response;
};

// 게시물 추천 카운트 감소
export const postMinusBoardPostLike = async (postId, t) => {
	const response = await BoardPost.update({ like_count: sequelize.literal(`like_count - 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

// 게시물 비추천 카운트 감소
export const postMinusBoardPostDislike = async (postId, t) => {
	const response = await BoardPost.update({ dislike_count: sequelize.literal(`dislike_count - 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

// 게시물 댓글 수 감소
export const postMinusBoardPostCommentCount = async (postId, t) => {
	const response = await BoardPost.update({ comment_count: sequelize.literal(`comment_count - 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

// 게시물 조회수 카운트 증가
export const postPlusBoardPostReadCount = async (postId, t) => {
	const response = await BoardPost.update({ read_count: sequelize.literal(`read_count + 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

/**
 * @description 게시물 Depth 1의 마지막 sort_no 반환
 */
export const getBoardPostDepthOneLastSort = async () => {
	const response = await BoardPost.findOne({ where: { depth: 1 }, attributes: ['sort_no'], order: [['sort_no', 'DESC']] });
	return response;
};

// 게시물 댓글 Depth 1의 마지막 sort_no 반환
export const getBoardPostCommentDepthOneLastSortNoByPostId = async (postId) => {
	const response = await PostComment.findOne({ where: { post_id: postId, depth: 1 }, order: [['sort_no', 'DESC']] });
	return response;
};

// 게시물 댓글 목록 조회
export const getBoardPostCommentBySearchFields = async (searchFields, offset = 0, limitParam = 10, loginMemberId) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const postComment = searchFields.post_comment ? searchFields.post_comment : null;
	let response = null;

	// 검색조건
	const values = { post_id: postComment.post_id, is_deleted: postComment ? postComment.is_deleted : null, offset: parseInt(offset, 10), limit: parseInt(limit, 10) };

	const sql = [
		'FROM `post_comments` AS `comment` ',
		'LEFT JOIN `members` AS `member` ON `comment`.`member_id` = `member`.`id` ',
		'LEFT JOIN `member_attributes` AS `attribute` ON `member`.`id` = `attribute`.`member_id` ',
		'WHERE `comment`.`id` IS NOT NULL ',
		'AND `comment`.`post_id` = :post_id ',
		'AND `comment`.`depth` < 3 ',
		values.is_deleted ? 'AND `comment`.`is_deleted` = :is_deleted ' : ' ',
		'ORDER BY `group_id` DESC, `sort_no` ASC ',
	].join(' ');

	const countSql = ['SELECT ', '	COUNT(`comment`.`id`) AS `total` '].join(' ') + sql;

	// Total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const postCommentSql =
			// eslint-disable-next-line prefer-template
			[
				'SELECT ',
				'	`comment`.`id`, ',
				'	`comment`.`post_id`, ',
				'	`comment`.`parent_comment_id`, ',
				'	CASE ',
				'		WHEN ',
				'			`comment`.`group_id` IS NULL ',
				'		THEN ',
				'			`comment`.`id` ',
				'		ELSE ',
				'			`comment`.`group_id` ',
				'	END `group_id`, ',
				'	`comment`.`depth`, ',
				'	`comment`.`sort_no`, ',
				'	`comment`.`member_id`, ',
				'	`comment`.`nickname`, ',
				'	`comment`.`is_anonymous`, ',
				'	`comment`.`anonymous_email`, ',
				'	`comment`.`is_secret`, ',
				'	`comment`.`secret_password`, ',
				'	`comment`.`is_deleted`, ',
				'	`comment`.`blame_status`, ',
				'	`comment`.`content`, ',
				'	`comment`.`like_count`, ',
				'	`comment`.`dislike_count`, ',
				'	`comment`.`created_ip`, ',
				'	`comment`.`created_at`, ',
				'	`comment`.`updated_at`, ',
				'	`member`.`user_id`, ',
				'	`member`.`nickname`, ',
				'	`member`.`join_site`, ',
				'	`member`.`join_type`, ',
				'	`member`.`join_ip`, ',
				'	`attribute`.`name`, ',
				'	`attribute`.`sex`, ',
				'	`attribute`.`email`, ',
				'	`attribute`.`phone`, ',
				'	`attribute`.`thumbnail` ',
			].join(' ') +
			sql +
			'LIMIT :offset, :limit; ';

		// 게시판 댓글 목록 조회
		const postCommentData = await sequelize.query(postCommentSql, { type: sequelize.QueryTypes.SELECT, replacements: values });

		const postComments = [];

		for (let i = 0; i < postCommentData.length; i += 1) {
			const tmpData = {
				id: postCommentData[i].id,
				post_id: postCommentData[i].post_id,
				group_id: postCommentData[i].group_id,
				depth: postCommentData[i].depth,
				sort_no: postCommentData[i].sort_no,
				member_id: postCommentData[i].member_id,
				nickname: postCommentData[i].nickname,
				is_anonymous: postCommentData[i].is_anonymous,
				anonymous_email: postCommentData[i].anonymous_email,
				is_secret: postCommentData[i].is_secret,
				secret_password: postCommentData[i].secret_password,
				is_deleted: postCommentData[i].is_deleted,
				blame_status: postCommentData[i].blame_status,
				content: postCommentData[i].content,
				like_count: postCommentData[i].like_count,
				dislike_count: postCommentData[i].dislike_count,
				created_ip: postCommentData[i].created_ip,
				created_at: postCommentData[i].created_at,
				updated_at: postCommentData[i].updated_at,
				member: {
					user_id: postCommentData[i].user_id,
					nickname: postCommentData[i].nickname,
					join_site: postCommentData[i].join_site,
					join_type: postCommentData[i].join_type,
					join_ip: postCommentData[i].join_ip,
					attribute: {
						name: postCommentData[i].name,
						sex: postCommentData[i].sex,
						birthday: postCommentData[i].birthday,
						email: postCommentData[i].email,
						phone: postCommentData[i].phone,
						thumbnail: postCommentData[i].thumbnail,
					},
				},
			};
			postComments[i] = tmpData;
		}
		if (Object.keys(postComments).length > 0) response = { total, list: postComments };
	}
	// Return
	return response || null;
};

/**
 * @description post_id 로 게시물 조회
 * @param {Int} postId
 */
export const getBoardPostByBoardPostId = async (postId) => {
	const response = await BoardPost.findOne({
		attributes: [
			`id`,
			`board_config_id`,
			`member_id`,
			`parent_post_id`,
			`group_id`,
			`depth`,
			`sort_no`,
			`created_ip`,
			`created_at`,
			`updated_at`,
			`is_deleted`,
			`is_notice`,
			`is_secret`,
			`title`,
			`contents`,
			`link_url`,
			`is_blank`,
			`author`,
			`comment_count`,
			`read_count`,
			`attached_file_count`,
			`content_file_count`,
			`thumbnail_file_count`,
			`like_count`,
			`dislike_count`,
			`device_info`,
			`blame_status`,
			`allow_scroll`,
		],
		where: { id: postId },
	});
	return response;
};

// post_comment_id 로 게시물 댓글 조회
export const getBoardPostCommentByBoardPostCommentId = async (postCommentId) => {
	const response = await PostComment.findOne({
		attributes: [
			'id',
			'post_id',
			'parent_comment_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'nickname',
			'is_anonymous',
			'anonymous_email',
			'is_secret',
			'secret_password',
			'created_ip',
			'is_deleted',
			'blame_status',
			'content',
			'like_count',
			'dislike_count',
			'created_at',
			'updated_at',
		],
		where: { id: postCommentId },
	});
	return response;
};

// parent_post_id 로 게시물 답글 목록 조회
export const getReplyBoardPostByParentBoardPostId = async (parentPostId) => {
	const response = await BoardPost.findAll({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'depth',
			'sort_no',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'link_url',
			'is_blank',
			'comment_count',
			'read_count',
			'attached_file_count',
			'like_count',
			'dislike_count',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { parent_post_id: parentPostId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
		order: [
			['sort_no', 'DESC'],
			['created_at', 'DESC'],
		],
	});
	return response;
};

// post_comments 에서 같은 group_id 에 속해있는 댓글 수 조회
export const getPostCommentGroupCountByGroupId = async (groupId) => {
	const response = await PostComment.count({ where: { group_id: groupId } });
	return response;
};

/**
 * @description board_post 에서 같은 group_id 에 속해있는 게시물 수 조회
 * @param {Int} groupId
 */
export const getBoardPostGroupCountByGroupId = async (groupId) => {
	const response = await BoardPost.count({ where: { group_id: groupId } });
	return response;
};

// 게시물 댓글 비추천 카운트 증가
export const postMinusBoardPostCommentDislike = async (postCommentId, t) => {
	const response = await PostComment.update({ dislike_count: sequelize.literal(`dislike_count - 1`) }, { where: { id: postCommentId }, transaction: t });
	return response;
};

// 게시물 댓글 추천 여부 확인
export const isExistBoardPostCommentLike = async (postCommentId, memberId) => {
	// 게시물 댓글 추천 여부 조회
	const memberBoardPostCommentLike = await PostCommentCountLog.findOne({ where: { comment_id: postCommentId, post_comment_count_log_type: 'like', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberBoardPostCommentLike ? true : false;
};

// 게시물 댓글 비추천 여부 확인
export const isExistBoardPostCommentDislike = async (postCommentId, memberId) => {
	// 게시물 댓글 비추천 여부 조회
	const memberBoardPostCommentDislike = await PostCommentCountLog.findOne({ where: { comment_id: postCommentId, post_comment_count_log_type: 'dislike', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberBoardPostCommentDislike ? true : false;
};

// 게시물 추천 여부 확인
export const isExistBoardPostLike = async (postId, memberId) => {
	// 게시물 추천 여부 조회
	const memberBoardPostLike = await PostCountLog.findOne({ where: { post_id: postId, post_count_log_type: 'like', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberBoardPostLike ? true : false;
};

// 게시물 비추천 여부 확인
export const isExistBoardPostDislike = async (postId, memberId) => {
	// 게시물 비추천 여부 조회
	const memberBoardPostDislike = await PostCountLog.findOne({ where: { post_id: postId, post_count_log_type: 'dislike', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberBoardPostDislike ? true : false;
};

// 별별수다 & 맘톡 게시물 조회
export const getTalkBoardPostById = async (postId) => {
	const boardConfigId = 2;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'institute_id'],
				include: [
					{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
				],
				required: true,
			},
			{
				model: PostFilterMulti,
				as: 'post_filter_multi',
				attributes: ['id', 'post_filter_type', 'post_filter_id'],
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
				],
			},
		],
	});

	// Retrun
	return response;
};

// 합격수기 & 수험후기 게시물 조회
export const getEssayBoardPostById = async (postId) => {
	const boardConfigId = 3;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: [
					'lv05_id',
					'lv1_id',
					'sex',
					'transfer_filter_id',
					'appointment_subtype',
					'appointment_local_region',
					'subject_filter_id',
					'year',
					'gong_local_region',
					'gong_speciality_part_filter_id',
					'gong_grade_filter_id',
					'gong_serial_filter_id',
					'sub_filter_id',
					'certificate_filter_id',
				],
				include: [
					{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'transfer_type_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'subject_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'speciality_part_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'grade_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'serial_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'certificate_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
				],
				required: true,
			},
		],
	});

	// Retrun
	return response;
};

// 별별질문 & Q&A 게시물 조회
export const getQnaBoardPostById = async (postId) => {
	const boardConfigId = 4;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'answer_status'],
				include: [{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] }],
				required: true,
			},
			{
				model: PostFilterMulti,
				as: 'post_filter_multi',
				attributes: ['id', 'post_filter_type', 'post_filter_id'],
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
				],
			},
		],
	});

	// Retrun
	return response;
};

// 별별정보 게시물 조회
export const getInfoBoardPostById = async (postId) => {
	const boardConfigId = 5;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'info_category'],
				include: [{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] }],
				required: true,
			},
		],
	});

	// Retrun
	return response;
};

// 기출문제 & 해설 게시물 조회
export const getExamBoardPostById = async (postId) => {
	const boardConfigId = 6;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'subject_filter_id', 'year', 'gong_local_region', 'gong_grade_filter_id'],
				include: [
					{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'subject_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Filter, as: 'grade_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] },
				],
				required: true,
			},
		],
	});

	// Retrun
	return response;
};

// 적폐청산 게시물 조회
export const getReportBoardPostById = async (postId) => {
	const boardConfigId = 7;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'link_url',
			'is_blank',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'answer_status'],
				include: [{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] }],
				required: true,
			},
		],
	});

	// Retrun
	return response;
};

// 이벤트 게시물 조회
export const getEventBoardPostById = async (postId) => {
	const boardConfigId = 9;
	const response = await BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'link_url',
			'is_blank',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'answer_status'],
				include: [{ model: Filter, as: 'lv1_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'] }],
				required: true,
			},
			{
				model: EventConfig,
				as: 'event_config',
				attributes: ['sub_title', 'event_start_date', 'event_end_date', 'event_status'],
				required: true,
			},
		],
	});

	// Return
	return response;
};

// 게시물 인덱스와 강사 인덱스 연결여부 조회
export const isExistRelationTutor = async (postId, tutorIds = []) => {
	const existNum = await PostFilterMulti.count({ where: { post_id: postId, post_filter_type: 'tutor', post_filter_id: { [Op.in]: tutorIds } } });

	// Return
	return existNum > 0 ? true : false; // eslint-disable-line no-unneeded-ternary
};

/**
 * postId 에 연결된 파일 인덱스 반환
 * @param {Int} postId
 */
export const getBoardPostFileIdsByPostId = async (postId) => {
	let ids = [];
	const postFileData = await PostFile.findAll({ attributes: ['id'], where: { post_id: postId } });
	ids = postFileData.map((postFileData) => postFileData.id);

	// Return
	return ids;
};

// Lv1_Id 와 강사 인덱스로 합격수기 & 수험후기 목록 조회
export const getEssayBoardPostByLv1IdAndTutorIds = async (lv1Id, tutorIds, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const boardConfigId = 3;
	const sql = {
		where: { board_config_id: boardConfigId, is_deleted: 'N', blame_status: 'normal', parent_post_id: null, depth: 1 },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'], required: true }],
				required: true,
			},
			{ model: PostFilter, as: 'post_filter', attributes: [], where: { board_config_id: boardConfigId, lv1_id: lv1Id }, required: true },
			{
				model: PostFilterMulti,
				as: 'post_filter_multi',
				attributes: [],
				where: { board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: { [Op.in]: tutorIds } },
				required: true,
			},
		],
		distinct: true,
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'board_config_id', 'member_id', 'title', 'contents', 'created_at'];

		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	// Return
	return response || null;
};

// 게시물 첨부파일 존재여부 확인
export const isExistPostFile = async (postFileId) => {
	const existNum = await PostFile.count({ where: { id: postFileId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

// 게시물 첨부파일 다운로드 로그 존재여부 확인
export const getPostFileLog = async (postFileId, memberId, postFileCountLogType) => {
	const response = await PostFileCountLog.findOne({ where: { post_file_id: postFileId, member_id: memberId, post_file_count_log_type: postFileCountLogType } });
	return response;
};

// 게시물 첨부파일 다운로드 로그 작성
export const postPostFileLog = async (postFileLog, isGetId = false, t) => {
	const response = await PostFileCountLog.create(
		{
			post_file_id: postFileLog.post_file_id,
			member_id: postFileLog.member_id,
			post_file_count_log_type: postFileLog.post_file_count_log_type,
			created_ip: postFileLog.created_ip,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.id : response;
};

// 게시물 첨부파일 다운로드 로그 수정
export const updatePostFileLog = async (postFileCountLog, t) => {
	const response = await PostFileCountLog.update(
		{
			post_file_id: postFileCountLog.post_file_id,
			member_id: postFileCountLog.member_id,
			post_file_count_log_type: postFileCountLog.post_file_count_log_type,
			created_ip: postFileCountLog.created_ip,
			created_at: postFileCountLog.created_at,
			updated_at: postFileCountLog.updated_at,
		},
		{ where: { id: postFileCountLog.id } },
		{ transaction: t },
	);
	return response;
};

// 게시물 다운로드 카운트 증가
export const postPlusBoardPostDownloadCount = async (postFileId, t) => {
	const response = await PostFile.update({ download_count: sequelize.literal(`download_count + 1`) }, { where: { id: postFileId }, transaction: t });
	return response;
};

// postId 로 postFilterMulti 데이터 조회
export const getPostMultiFilterByPostId = async (postId) => {
	const response = await PostFilterMulti.findAll({
		where: { post_id: postId },
		attributes: ['id', 'post_filter_type', 'post_filter_id'],
		include: [
			{
				model: Tutor,
				as: 'tutor',
				attributes: ['name', 'is_deleted', 'is_confirm'],
				where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
				include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
				required: true,
			},
		],
	});
	return response;
};

// 검색 항목에 따른 메인페이지 별별수다 게시물 조회
export const getMainPageTalkBoardPostsBySearchFields = async (searchFields = [], offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	// 검색필터
	const boardPostAttr = { board_config_id: { [Op.in]: [2, 11] }, depth: 1, is_deleted: 'N', is_notice: 'N', is_secret: 'N', blame_status: 'NORMAL' };

	const postFilterAttr = {};
	if (searchFields.filter_id === 4403) {
		postFilterAttr.lv1_id = searchFields.filter_id;
	} else {
		postFilterAttr.lv1_id = { [Op.or]: [searchFields.filter_id, null] };
	}

	const sql = {
		where: boardPostAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'institute_id'],
				where: postFilterAttr,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
				],
				required: true,
			},
		],
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'member_id',
			'parent_post_id',
			'group_id',
			'depth',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'created_at',
		];

		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 정렬순서
		if (searchFields.order === 'last_at')
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		else
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];

		// 게시물 정보 조회
		const posts = await BoardPost.findAll(sql);

		for (let i = 0; i < posts.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const postFilterMulti = await getPostMultiFilterByPostId(posts[i].dataValues.id);
			posts[i].dataValues.post_filter_multi = Object.keys(postFilterMulti).length > 0 ? postFilterMulti : null;

			let region = null;
			if (posts[i].dataValues.post_filter.dataValues.institute_id) {
				// eslint-disable-next-line no-await-in-loop
				const relationRegion = await regionComponent.getRegionInfoByInstituteId(posts[i].dataValues.post_filter.dataValues.institute_id);
				// eslint-disable-next-line no-await-in-loop
				if (relationRegion) region = await regionComponent.getFullRegionInfoById(relationRegion.dataValues.region_id);
				posts[i].dataValues.post_filter.dataValues.institute.dataValues.region = region;
			}

			let tutor = null;
			if (posts[i].dataValues.board_config_id === 11) {
				const cafeId = await cafeComponent.getCafeIdBypostId(posts[i].dataValues.id); // eslint-disable-line no-await-in-loop
				const tutorId = await cafeComponent.getTutorIdByCafeId(cafeId); // eslint-disable-line no-await-in-loop
				const subjects = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(tutorId, posts[i].dataValues.post_filter.dataValues.lv1_id); // eslint-disable-line no-await-in-loop
				tutor = await tutorComponent.getTutorDataById(tutorId); // eslint-disable-line no-await-in-loop
				if (tutor) tutor = { ...tutor, subject: subjects };
			}
			posts[i].dataValues.tutor = tutor;
		}
		if (Object.keys(posts).length > 0) response = { total, list: posts };
	}

	// Return
	return response || null;
};

// 검색 항목에 따른 메인페이지 별별정보 게시물 조회
export const getMainPageInfoBoardPostsBySearchFields = async (searchFields = [], offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	// 검색필터
	const boardPostAttr = { board_config_id: 5, depth: 1, is_deleted: 'N', is_notice: 'N', is_secret: 'N', blame_status: 'NORMAL' };

	const sql = {
		where: boardPostAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'info_category'],
				where: { [Op.or]: [{ lv1_id: searchFields.filter_id }, { lv1_id: null }] },
				required: true,
			},
		],
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'member_id',
			'parent_post_id',
			'group_id',
			'depth',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'created_at',
		];

		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 정렬순서
		sql.order =
			searchFields.order === 'last_at'
				? [
						['created_at', 'DESC'],
						['id', 'DESC'],
				  ]
				: [
						['created_at', 'DESC'],
						['id', 'DESC'],
				  ];

		// 게시물 정보 조회
		const posts = await BoardPost.findAll(sql);
		if (Object.keys(posts).length > 0) response = { total, list: posts };
	}

	// Return
	return response || null;
};

// 검색 항목에 따른 메인페이지 언론속의 선생님 게시물 조회
export const getMainPagePressBoardPostsBySearchFields = async (searchFields = [], offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	// 검색필터
	const boardPostAttr = { board_config_id: 1, depth: 1, is_deleted: 'N', is_secret: 'N', blame_status: 'NORMAL' };

	const sql = {
		where: boardPostAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{
				model: PostFilter,
				as: 'post_filter',
				attributes: ['lv05_id', 'lv1_id', 'institute_id'],
				where: { [Op.or]: [{ lv1_id: searchFields.filter_id }, { lv1_id: null }] },
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
				],
				required: true,
			},
		],
	};

	// Total
	const total = await BoardPost.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'member_id',
			'parent_post_id',
			'group_id',
			'depth',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'author',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'created_at',
		];

		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 정렬순서
		sql.order =
			searchFields.order === 'last_at'
				? [
						['created_at', 'DESC'],
						['id', 'DESC'],
				  ]
				: [
						['is_notice', 'ASC'],
						['created_at', 'DESC'],
						['id', 'DESC'],
				  ];

		// 게시물 정보 조회
		const posts = await BoardPost.findAll(sql);
		for (let i = 0; i < posts.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const postFilterMulti = await getPostMultiFilterByPostId(posts[i].dataValues.id);
			posts[i].dataValues.post_filter_multi = Object.keys(postFilterMulti).length > 0 ? postFilterMulti : null;
		}
		if (Object.keys(posts).length > 0) response = { total, list: posts };
	}

	// Return
	return response || null;
};

// 검색 항목에 따른 메인페이지 별별질문 게시물 조회
export const getMainPageQnaBoardPostsBySearchFields = async (searchFields = [], offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	// 검색 조건
	const values = {
		board_config_id: 4,
		board_post_is_deleted: 'N',
		is_notice: 'N',
		is_secret: 'N',
		blame_status: 'NORMAL',
		lv1_id: searchFields.filter_id,
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	};

	// prettier-ignore
	const sql = [
		'FROM ( ',
		'	SELECT ',
		'		`board_posts`.`id`, ',
		'		`board_posts`.`board_config_id`, ',
		'		`board_posts`.`member_id`, ',
		'		`board_posts`.`parent_post_id`, ',
		'		CASE  ',
		'			WHEN ',
		'				`board_posts`.`group_id` IS NULL ',
		'			THEN ',
		'				`board_posts`.`id` ',
		'			ELSE ',
		'				`board_posts`.`group_id` ',
		'		END `group_id`, ',
		'		`board_posts`.`depth`, ',
		'		`board_posts`.`sort_no`, ',
		'		`board_posts`.`is_deleted`, ',
		'		`board_posts`.`is_notice`, ',
		'		`board_posts`.`is_secret`, ',
		'		`board_posts`.`blame_status`, ',
		'		(SELECT COUNT(`id`) FROM `board_posts` AS `child_board_posts` WHERE `child_board_posts`.`parent_post_id` = `board_posts`.`id`) AS `child_post_count` ',
		'	FROM `board_posts` ',
		'	WHERE `board_posts`.`id` IS NOT NULL ',
		'	AND `board_posts`.`board_config_id` = :board_config_id ',
		'	AND `board_posts`.`is_deleted` = :board_post_is_deleted ',
		'	AND `board_posts`.`is_notice` = :is_notice ',
		'	AND `board_posts`.`is_secret` = :is_secret ',
		'	AND `board_posts`.`blame_status` = :blame_status ',
		') AS `board_posts` ',
		'LEFT JOIN `members` AS `member` ON `member`.`id` = `board_posts`.`member_id` ',
		'LEFT JOIN `member_attributes` AS `attribute` ON `attribute`.`member_id` = `member`.`id` ',
		'LEFT JOIN `post_filter` AS `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'WHERE ( (`board_posts`.`depth` = 1 AND `child_post_count` > 0) OR (`board_posts`.`depth` > 1) ) ',
		'AND `post_filter`.`lv1_id` = :lv1_id',
		'ORDER BY `group_id` DESC, `depth` ASC, `sort_no` DESC ',
	].join(' ');

	const countSql = ['SELECT ', '	COUNT(`board_posts`.`id`) AS `total` '].join(' ') + sql;

	// Total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const boardPostSql =
			// eslint-disable-next-line prefer-template
			[
				'SELECT ',
				'	`board_posts`.`*`, ',
				'	`member`.`user_id`, ',
				'	`member`.`nickname`, ',
				'	`member`.`join_site`, ',
				'	`member`.`join_type`, ',
				'	`member`.`join_ip`, ',
				'	`attribute`.`name`, ',
				'	`attribute`.`thumbnail`, ',
				'	`post_filter`.`lv05_id`, ',
				'	`post_filter`.`lv1_id`, ',
				'	`post_filter`.`answer_status` ',
			].join(' ') +
			sql +
			'LIMIT :offset, :limit;';

		// 게시물 목록 조회
		const boardPostData = await sequelize.query(boardPostSql, { type: sequelize.QueryTypes.SELECT, replacements: values });

		const boardPosts = [];

		for (let i = 0; i < boardPostData.length; i += 1) {
			const tmpBoardPostData = await getBoardPostByBoardPostId(boardPostData[i].id); // eslint-disable-line no-await-in-loop
			const tmpData = {
				id: boardPostData[i].id,
				board_config_id: boardPostData[i].board_config_id,
				member_id: boardPostData[i].member_id,
				parent_post_id: boardPostData[i].parent_post_id,
				group_id: boardPostData[i].group_id,
				depth: boardPostData[i].depth,
				sort_no: boardPostData[i].sort_no,
				is_deleted: boardPostData[i].is_deleted,
				is_notice: boardPostData[i].is_notice,
				is_secret: boardPostData[i].is_secret,
				title: tmpBoardPostData.dataValues.title,
				contents: tmpBoardPostData.dataValues.contents,
				link_url: tmpBoardPostData.dataValues.link_url,
				is_blank: tmpBoardPostData.dataValues.is_blank,
				comment_count: tmpBoardPostData.dataValues.comment_count,
				read_count: tmpBoardPostData.dataValues.read_count,
				attached_file_count: tmpBoardPostData.dataValues.attached_file_count,
				content_file_count: tmpBoardPostData.dataValues.content_file_count,
				thumbnail_file_count: tmpBoardPostData.dataValues.thumbnail_file_count,
				like_count: tmpBoardPostData.dataValues.like_count,
				dislike_count: tmpBoardPostData.dataValues.dislike_count,
				blame_status: boardPostData[i].blame_status,
				child_post_count: boardPostData[i].child_post_count,
				created_ip: tmpBoardPostData.dataValues.created_ip,
				created_at: tmpBoardPostData.dataValues.created_at,
				updated_at: tmpBoardPostData.dataValues.updated_at,
				member: {
					user_id: boardPostData[i].user_id,
					nickname: boardPostData[i].nickname,
					join_site: boardPostData[i].join_site,
					join_type: boardPostData[i].join_type,
					join_ip: boardPostData[i].join_ip,
					attribute: {
						name: boardPostData[i].name,
						thumbnail: boardPostData[i].thumbnail,
					},
				},
				post_filter: {
					lv05_id: boardPostData[i].lv05_id,
					lv1_id: boardPostData[i].lv1_id,
					answer_status: boardPostData[i].answer_status,
				},
			};
			boardPosts[i] = tmpData;
		}

		for (let i = 0; i < boardPosts.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const postFilterMulti = await getPostMultiFilterByPostId(boardPosts[i].id);
			boardPosts[i].post_filter_multi = Object.keys(postFilterMulti).length > 0 ? postFilterMulti : null;
		}
		if (Object.keys(boardPosts).length > 0) response = { total, list: boardPosts };
	}

	// Return
	return response || null;
};

// parent_post_id 로 게시물 답변수 조회
export const getReplyBoardPostCountByBoardPostId = async (parentPostId) => {
	const response = await BoardPost.count({ where: { parent_post_id: parentPostId, is_deleted: 'N' } });
	return response;
};

// 별별맘톡 게시물 & 게시물 댓글 조회
export const getTalkBoardPostsAndComment = async (instituteId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 검색 조건
	const values = { institute_id: instituteId, offset: parseInt(offset, 10), limit: parseInt(limit, 10) };

	// prettier-ignore
	const sql = [
		'SELECT `post_and_comment`.`*` ',
		'FROM ( ',
		'	SELECT `board_posts`.`id` AS `post_id`, "post" AS `content_type`, null AS `comment_id`, `board_posts`.`created_at` ',
		'	FROM `board_posts` ',
		'	INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'	WHERE `board_posts`.`id` IS NOT NULL ',
		'	AND `board_posts`.`board_config_id` = 2 ',
		'	AND `board_posts`.`depth` = 1 ',
		'	AND `board_posts`.`is_deleted` = "N" ',
		'	AND `board_posts`.`is_notice` = "N" ',
		'	AND (`post_filter`.`institute_id` = :institute_id OR `post_filter`.`institute_id` IS NULL) ',
		'	AND (`post_filter`.`lv1_id` = 4403) ',
		'	UNION ',
		'	SELECT `post_comments`.`post_id` AS `post_id`, "comment" AS `content_type`, `post_comments`.`id` AS `comment_id`, `post_comments`.`created_at` ',
		'	FROM `post_comments` ',
		'	WHERE `post_comments`.`id` IS NOT NULL ',
		'	AND `post_comments`.`depth` = 1 ',
		'	AND `post_comments`.`is_deleted` = "N" ',
		'	AND `post_comments`.`post_id` IN ( ',
		'		SELECT `board_posts`.`id` ',
		'		FROM `board_posts` ',
		'		INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'		WHERE `board_posts`.`id` IS NOT NULL ',
		'		AND `board_posts`.`board_config_id` = 2 ',
		'		AND `board_posts`.`depth` = 1 ',
		'		AND `board_posts`.`is_deleted` = "N" ',
		'		AND `board_posts`.`is_notice` = "N" ',
		'		AND (`post_filter`.`institute_id` = :institute_id OR `post_filter`.`institute_id` IS NULL) ',
		'		AND (`post_filter`.`lv1_id` = 4403) ',
		'	) ',
		') AS `post_and_comment` ',
		'ORDER BY `post_and_comment`.`created_at` DESC ',
		'LIMIT :offset, :limit; '
	].join(' ');

	const postAndCommentList = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });

	return postAndCommentList;
};

/**
 * @description 일반 게시판 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getGeneralBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const boardConfigId = 11;
	const order = [];

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const cafe = searchFields.cafe ? searchFields.cafe : null;
	const common = searchFields.common ? searchFields.common : null;

	// 게시글 조건 검사
	const boardPostAttr = { board_config_id: boardConfigId };
	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.search_keyword) boardPostAttr.title = { [Op.like]: `%${boardPost.search_keyword}%` };
	}

	// cafe
	const cafeAttr = {};
	if (cafe) if (cafe.cafe_id) cafeAttr.id = cafe.cafe_id;

	// 정렬 조건
	if (common && common.order) {
		if (common.order === 'last_at') order.push(['is_notice', 'ASC'], ['created_at', 'DESC']);
		if (common.order === 'view_count') order.push(['is_notice', 'ASC'], ['read_count', 'DESC']);
		if (common.order === 'recommend_count') order.push(['is_notice', 'ASC'], ['like_count', 'DESC']);
		if (common.order === 'comment_count') order.push(['is_notice', 'ASC'], ['comment_count', 'DESC']);
		if (common.order === 'newest') order.push(['created_at', 'DESC']);
	}
	order[order.length] = ['id', 'DESC'];

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'institute_id'], required: true },
			{ model: Member, as: 'member', attributes: ['user_id', 'nickname', 'join_type'], include: [{ model: MemberAttribute, as: 'attribute', attributes: ['sex', 'thumbnail'] }], required: true },
			{ model: Cafe, as: 'cafe', through: { attributes: [] }, where: cafeAttr, required: true },
		],
		distinct: true,
	};

	// total
	const total = await BoardPost.count(sql);
	if (total && total > 0) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'author',
			'attached_file_count',
			'content_file_count',
			'thumbnail_file_count',
			'like_count',
			'dislike_count',
			'read_count',
			'comment_count',
			'created_at',
		];

		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}
		sql.order = order;

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		if (Object.keys(postsData).length > 0) response = { total, list: postsData };
	}

	return response;
};
/**
 * @description 자유 게시판 게시글 조회
 * @param {Int} postId
 */
export const getGeneralBoardPostById = async (postId) => {
	const boardConfigId = 11;
	const response = BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'institute_id'], required: true },
		],
	});

	return response;
};

/**
 * @description 자료실 게시판 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getResourceBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const boardConfigId = 10;
	const order = [['is_notice', 'ASC']];

	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const cafe = searchFields.cafe ? searchFields.cafe : null;
	const common = searchFields.common ? searchFields.common : null;

	// 게시글 조건 검사
	const boardPostAttr = { board_config_id: boardConfigId };
	if (boardPost) {
		if (boardPost.is_notice) boardPostAttr.is_notice = boardPost.is_notice;
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.search_keyword) boardPostAttr.title = { [Op.like]: `%${boardPost.search_keyword}%` };
	}

	// cafe
	const cafeAttr = {};
	if (cafe) if (cafe.cafe_id) cafeAttr.id = cafe.cafe_id;

	// 정렬 조건
	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC']);
		if (common.order === 'view_count') order.push(['read_count', 'DESC']);
		if (common.order === 'recommend_count') order.push(['like_count', 'DESC']);
		if (common.order === 'comment_count') order.push(['comment_count', 'DESC']);
		if (common.order === 'download_count') order.push([{ model: PostFile, as: 'post_file' }, 'download_count', 'DESC']);
	}
	order[order.length] = ['id', 'DESC'];

	const sql = {
		where: boardPostAttr,
		include: [
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'institute_id'], required: true },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{ model: PostFile, as: 'post_file', attributes: ['download_count'] },
			{
				model: Cafe,
				as: 'cafe',
				through: { attributes: [] },
				where: cafeAttr,
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'default_profile', 'message'] }],
						through: { attributes: [] },
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						required: true,
					},
				],
			},
		],
		distinct: true,
	};

	const total = await BoardPost.count(sql);

	if (total) {
		sql.attributes = [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'author',
			'attached_file_count',
			'content_file_count',
			'thumbnail_file_count',
			'like_count',
			'dislike_count',
			'read_count',
			'comment_count',
			'created_at',
		];
		if (boardPostAttr.is_notice !== 'Y') {
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);
		}
		sql.order = order;

		// 게시물 정보 조회
		const postsData = await BoardPost.findAll(sql);
		const posts = [];
		if (Object.keys(postsData).length > 0) {
			for (let i = 0; i < postsData.length; i += 1) {
				const cafeData = postsData[i].cafe[0];
				const tutorCafeData = postsData[i].cafe[0].tutor[0];
				const tmpPost = {
					id: postsData[i].id,
					board_config_id: postsData[i].board_config_id,
					parent_post_id: postsData[i].parent_post_id,
					group_id: postsData[i].group_id,
					depth: postsData[i].depth,
					sort_no: postsData[i].sort_no,
					member_id: postsData[i].member_id,
					is_deleted: postsData[i].is_deleted,
					is_notice: postsData[i].is_notice,
					is_secret: postsData[i].is_secret,
					blame_status: postsData[i].blame_status,
					title: postsData[i].title,
					link_url: postsData[i].link_url,
					is_blank: postsData[i].is_blank,
					author: postsData[i].author,
					attached_file_count: postsData[i].attached_file_count,
					content_file_count: postsData[i].content_file_count,
					thumbnail_file_count: postsData[i].thumbnail_file_count,
					like_count: postsData[i].like_count,
					dislike_count: postsData[i].dislike_count,
					read_count: postsData[i].read_count,
					comment_count: postsData[i].comment_count,
					created_at: postsData[i].created_at,
					post_filter: { lv05_id: postsData[i].post_filter.lv05_id, lv1_id: postsData[i].post_filter.lv1_id, institute_id: postsData[i].post_filter.institute_id },
					member: {
						user_id: postsData[i].member.user_id,
						nickname: postsData[i].member.nickname,
						join_type: postsData[i].member.join_type,
						attribute: { name: postsData[i].member.attribute.name, sex: postsData[i].member.attribute.sex, thumbnail: postsData[i].member.attribute.thumbnail },
					},
					post_file: postsData[i].post_file,
					cafe: { id: cafeData.id, type: cafeData.type, is_deleted: cafeData.is_deleted, created_at: cafeData.created_at },
					tutor: {
						id: tutorCafeData.id,
						name: tutorCafeData.name,
						is_deleted: tutorCafeData.is_deleted,
						is_confirm: tutorCafeData.is_confirm,
						attribute: {
							sex: tutorCafeData.attribute.sex,
							profile: tutorCafeData.attribute.profile,
							default_profile: tutorCafeData.attribute.default_profile,
							message: tutorCafeData.attribute.message,
						},
						subject: await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(tutorCafeData.id, postsData[i].post_filter.lv1_id), // eslint-disable-line no-await-in-loop
					},
				};
				posts.push(tmpPost);
			}
			response = { total, list: posts };
		}
	}

	return response;
};

/**
 * @description 자료실 상세 조회
 * @param {Int} postId
 */
export const getResourceBoardPostById = async (postId) => {
	const boardConfigId = 10;
	const response = BoardPost.findOne({
		attributes: [
			'id',
			'board_config_id',
			'parent_post_id',
			'group_id',
			'depth',
			'sort_no',
			'member_id',
			'is_deleted',
			'is_notice',
			'is_secret',
			'blame_status',
			'title',
			'link_url',
			'is_blank',
			'author',
			'contents',
			'comment_count',
			'read_count',
			'attached_file_count',
			'content_file_count',
			`thumbnail_file_count`,
			'like_count',
			'dislike_count',
			'allow_scroll',
			'created_ip',
			'created_at',
			'updated_at',
		],
		where: { id: postId, board_config_id: boardConfigId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{ model: PostFilter, as: 'post_filter', attributes: ['lv05_id', 'lv1_id', 'institute_id'], required: true },
		],
	});

	// Return
	return response;
};
/**
 * @description 강사 자료 best 게시물 조회
 * @param {Int} cafeId
 */
export const getTutorResourceBestBoardPost = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const cafe = searchFields.cafe ? searchFields.cafe : null;
	const values = {
		board_config_id: boardPost.board_config_id,
		cafe_id: cafe.cafe_id,
		is_deleted: boardPost.is_deleted,
		is_notice: boardPost.is_notice,
		is_secret: boardPost.is_secret,
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	};
	let response = null;

	const sql = [
		'SELECT ',
		'	`board_posts`.`id`, ',
		'	`board_posts`.`board_config_id`, ',
		'	`board_posts`.`member_id`, ',
		'	`board_posts`.`sort_no`, ',
		'	`board_posts`.`created_ip`, ',
		'	`board_posts`.`created_at`, ',
		'	`board_posts`.`updated_at`, ',
		'	`board_posts`.`is_deleted`, ',
		'	`board_posts`.`is_notice`, ',
		'	`board_posts`.`title`, ',
		'	`board_posts`.`comment_count`, ',
		'	`board_posts`.`read_count`, ',
		'	`board_posts`.`like_count`, ',
		'	`members`.`user_id`, ',
		'	`members`.`nickname`, ',
		'	`members`.`join_type`, ',
		'	`member_attributes`.`name`, ',
		'	`member_attributes`.`sex`, ',
		'	`member_attributes`.`thumbnail`, ',
		'	`member_attributes`.`default_thumbnail` ',
		'FROM `board_posts` ',
		'INNER JOIN `members` ON `members`.`id` = `board_posts`.`member_id` ',
		'INNER JOIN `member_attributes` ON `member_attributes`.`member_id` = `members`.`id` ',
		'INNER JOIN `cafe_posts` ON `cafe_posts`.`board_posts_id` = `board_posts`.`id` ',
		'INNER JOIN `cafes` ON `cafes`.`id` = `cafe_posts`.`cafe_id` ',
		'WHERE `board_posts`.`id` IS NOT NULL ',
		'AND `board_posts`.`is_deleted` = :is_deleted ',
		'AND `board_posts`.`is_secret` = :is_secret ',
		'AND `board_posts`.`is_notice` = :is_notice ',
		'AND `board_posts`.`board_config_id` = :board_config_id ',
		'AND `cafe_posts`.`cafe_id` = :cafe_id ',
		'AND `cafes`.`is_deleted` = :is_deleted ',
		'ORDER BY `board_posts`.`created_at` DESC',
		'LIMIT :offset, :limit; ',
	].join(' ');

	const postData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	const posts = [];
	for (let i = 0; i < postData.length; i += 1) {
		const tmpPost = {
			id: postData[i].id,
			board_config_id: postData[i].board_config_id,
			member_id: postData[i].member_id,
			sort_no: postData[i].sort_no,
			created_ip: postData[i].created_ip,
			created_at: postData[i].created_at,
			updated_at: postData[i].updated_at,
			is_deleted: postData[i].is_deleted,
			is_notice: postData[i].is_notice,
			title: postData[i].title,
			comment_count: postData[i].comment_count,
			read_count: postData[i].read_count,
			like_count: postData[i].like_count,
			member: {
				id: postData[i].member_id,
				user_id: postData[i].user_id,
				nickname: postData[i].nickname,
				join_type: postData[i].join_type,
				attribute: { name: postData[i].name, sex: postData[i].sex, thumbnail: postData[i].thumbnail, default_thumbnail: postData[i].default_thumbnail },
			},
		};
		posts.push(tmpPost);
	}
	if (Object.keys(posts).length > 0) response = { list: posts };

	return response;
};

/**
 * @description Lv1 강사 자료 강사별 실시간 HOT 강사 인덱스 조회
 * @param {Int} lv1Id
 */
export const getTutorResourceTutorHotTutorIds = async (searchFields, offset = 0, limit = 10) => {
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	const tutor = searchFields.tutor ? searchFields.tutor : null;
	const values = {
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
		board_config_id: boardPost.board_config_id,
		is_deleted: boardPost.is_deleted,
		is_secret: boardPost.is_secret,
		is_confirm: tutor.is_confirm,
		lv1_id: postFilter.lv1_id,
	};
	let response = null;

	const sql = [
		'SELECT ',
		'	`tutors`.`id`, ',
		'	COUNT(`board_posts`.`id`) AS post_count ',
		'FROM ( ',
		'	SELECT ',
		'		`board_posts`.`id` ',
		'	FROM `board_posts` ',
		'	INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'	WHERE `board_posts`.`board_config_id` = :board_config_id ',
		'	AND `board_posts`.`is_deleted` = :is_deleted ',
		'	AND `board_posts`.`is_secret` = :is_secret ',
		'	AND `post_filter`.`lv1_id` = :lv1_id ',
		') AS `board_posts` ',
		'INNER JOIN `cafe_posts` ON `cafe_posts`.`board_posts_id` = `board_posts`.`id` ',
		'INNER JOIN `cafes` ON `cafes`.`id` = `cafe_posts`.`cafe_id` ',
		'INNER JOIN `cafe_tutors` ON `cafe_tutors`.`cafe_id` = `cafe_posts`.`cafe_id` ',
		'INNER JOIN `tutors` ON `tutors`.`id` = `cafe_tutors`.`tutor_id` ',
		'WHERE `board_posts`.`id` IS NOT NULL ',
		'AND `cafes`.`is_deleted` = :is_deleted ',
		'AND `tutors`.`is_deleted` = :is_deleted ',
		'AND `tutors`.`is_confirm` = :is_confirm ',
		'GROUP BY `cafe_tutors`.`tutor_id` ',
		'ORDER BY `post_count` DESC, `tutors`.`id` DESC',
		'LIMIT :offset, :limit;',
	].join(' ');

	const tutorIdData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	if (tutorIdData && Object.keys(tutorIdData).length > 0) response = tutorIdData.map((tutorData) => tutorData.id);

	return response;
};

/**
 * @description 검색 항목에 따른 메인페이지 강사 자료 게시물 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getMainPageResourceBoardPostsBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	let response = null;
	// 검색 조건
	const values = {
		board_config_id: 10,
		depth: 1,
		is_secret: 'N',
		is_notice: 'N',
		is_deleted: 'N',
		blame_status: 'NORMAL',
		lv1_id: searchFields.filter_id,
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	};

	const sql = [
		'FROM ( ',
		'	SELECT ',
		'		`board_posts`.`*`, ',
		'		`post_filter`.`id` AS `post_filter_id`, ',
		'		`post_filter`.`lv05_id` AS `post_filter_lv05_id`, ',
		'		`post_filter`.`lv1_id` AS `post_filter_lv1_id` ',
		'	FROM `board_posts` ',
		'	INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'	WHERE `board_posts`.`id` IS NOT NULL ',
		'	AND `board_posts`.`board_config_id` = :board_config_id ',
		'	AND `board_posts`.`depth` = :depth ',
		'	AND `board_posts`.`is_secret` = :is_secret ',
		'	AND `board_posts`.`is_notice` = :is_notice ',
		'	AND `board_posts`.`is_deleted` = :is_deleted ',
		'	AND `board_posts`.`blame_status` = :blame_status ',
		'	AND `post_filter`.`lv1_id` = :lv1_id ',
		') AS `board_posts` ',
		'INNER JOIN `cafe_posts` ON `cafe_posts`.`board_posts_id` = `board_posts`.`id` ',
		'INNER JOIN `cafes` ON `cafes`.`id` = `cafe_posts`.`cafe_id` ',
		'INNER JOIN `cafe_tutors` ON `cafe_tutors`.`cafe_id` = `cafes`.`id` ',
		'INNER JOIN `tutors` ON `tutors`.`id` = `cafe_tutors`.`tutor_id` ',
		'INNER JOIN `tutor_attributes` ON `tutor_attributes`.`tutor_id` = `tutors`.`id` ',
		'INNER JOIN `members` ON `members`.`id` =`board_posts`.`member_id` ',
		'INNER JOIN `member_attributes` ON `member_attributes`.`member_id` =`members`.`id` ',
	].join(' ');

	const countSql = ['SELECT COUNT(`board_posts`.`id`) AS `total` '].join(' ') + sql;

	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = total && Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const baordPostSql =
			[
				'SELECT ',
				'	`board_posts`.`*`, ',
				'	`members`.`user_id`, ',
				'	`members`.`nickname`, ',
				'	`members`.`join_type`, ',
				'	`member_attributes`.`name`, ',
				'	`member_attributes`.`sex`, ',
				'	`member_attributes`.`thumbnail`, ',
				'	`tutors`.`id` AS `tutor_id`, ',
				'	`tutors`.`name` AS `tutor_name`, ',
				'	`tutor_attributes`.`sex` AS `tutor_sex`, ',
				'	`tutors`.`is_deleted` AS `tutor_is_deleted`, ',
				'	`tutor_attributes`.`profile` AS `tutor_profile`, ',
				'	`tutor_attributes`.`default_profile` AS `tutor_default_profile`, ',
				'	`tutor_attributes`.`message` AS `tutor_message` ',
			].join(' ') +
			sql +
			['ORDER BY `board_posts`.`created_at` DESC, `board_posts`.`id` DESC LIMIT :offset, :limit;'].join(' ');

		const boardPostData = await sequelize.query(baordPostSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
		const posts = [];

		for (let i = 0; i < boardPostData.length; i += 1) {
			const tutorSubject = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(boardPostData[i].tutor_id, boardPostData[i].post_filter_lv1_id);
			const tmpPost = {
				id: boardPostData[i].id,
				board_config_id: boardPostData[i].board_config_id,
				member_id: boardPostData[i].member_id,
				parent_post_id: boardPostData[i].parent_post_id,
				group_id: boardPostData[i].group_id,
				depth: boardPostData[i].depth,
				sort_no: boardPostData[i].sort_no,
				is_deleted: boardPostData[i].is_deleted,
				is_notice: boardPostData[i].is_notice,
				is_secret: boardPostData[i].is_secret,
				title: boardPostData[i].title,
				contents: boardPostData[i].contents,
				link_url: boardPostData[i].link_url,
				is_blank: boardPostData[i].is_blank,
				comment_count: boardPostData[i].comment_count,
				read_count: boardPostData[i].read_count,
				attached_file_count: boardPostData[i].attached_file_count,
				content_file_count: boardPostData[i].content_file_count,
				thumbnail_file_count: boardPostData[i].thumbnail_file_count,
				like_count: boardPostData[i].like_count,
				dislike_count: boardPostData[i].dislike_count,
				blame_status: boardPostData[i].blame_status,
				child_post_count: boardPostData[i].child_post_count,
				created_ip: boardPostData[i].created_ip,
				created_at: boardPostData[i].created_at,
				updated_at: boardPostData[i].updated_at,
				member: {
					user_id: boardPostData[i].user_id,
					nickname: boardPostData[i].nickname,
					join_type: boardPostData[i].join_type,
					attribute: { name: boardPostData[i].name, sex: boardPostData[i].sex, thumbnail: boardPostData[i].thumbnail },
				},
				post_filter: { id: boardPostData[i].post_filter_id, lv05_id: boardPostData[i].post_filter_lv05_id, lv1_id: boardPostData[i].post_filter_lv1_id },
				tutor: {
					id: boardPostData[i].tutor_id,
					name: boardPostData[i].tutor_name,
					is_deleted: boardPostData[i].tutor_is_deleted,
					attribute: {
						sex: boardPostData[i].tutor_sex,
						profile: boardPostData[i].tutor_profile,
						default_profile: boardPostData[i].tutor_default_profile,
						message: boardPostData[i].tutor_message,
					},
					subject: tutorSubject,
				},
			};
			posts.push(tmpPost);
		}

		if (posts && Object.keys(posts).length > 0) response = { total, list: posts };
	}
	return response;
};

/**
 * @description Lv1 필터 강사 자료 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limitParam
 */
export const getTutorResourceBoardPosts = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const postFilter = searchFields.post_filter ? searchFields.post_filter : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;

	// 검색 조건
	const values = {
		board_config_id: 10,
		lv1_id: postFilter.lv1_id,
		board_post_is_deleted: 'N',
		is_secret: 'N',
		blame_status: 'NORMAL',
		is_notice: 'N',
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	};
	if (common) values.search_keyword = common.search_keyword ? `%${common.search_keyword}%` : null;

	const sql = [
		'FROM ( ',
		'	SELECT ',
		'	`board_posts`.`*`, ',
		'	`post_filter`.`id` AS `post_filter_id`, ',
		'	`post_filter`.`lv05_id` AS `post_filter_lv05_id`, ',
		'	`post_filter`.`lv1_id` AS `post_filter_lv1_id` ',
		'	FROM `board_posts` ',
		'	INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'	WHERE `board_posts`.`board_config_id` = :board_config_id ',
		'	AND `board_posts`.`is_deleted` = :board_post_is_deleted ',
		'	AND `board_posts`.`is_notice` = :is_notice ',
		'	AND `post_filter`.`lv1_id` = :lv1_id ',
		') AS `board_posts` ',
		'INNER JOIN `members` ON `members`.`id` = `board_posts`.`member_id` ',
		'INNER JOIN `cafe_posts` ON `cafe_posts`.`board_posts_id` = `board_posts`.`id` ',
		'INNER JOIN `cafes` ON `cafes`.`id` = `cafe_posts`.`cafe_id` ',
		'INNER JOIN `cafe_tutors` ON `cafe_tutors`.`cafe_id` = `cafes`.`id` ',
		'INNER JOIN `tutors` ON `tutors`.`id` = `cafe_tutors`.`tutor_id` ',
		'INNER JOIN `tutor_attributes` ON `tutor_attributes`.`tutor_id` = `tutors`.`id` ',
		'WHERE `board_posts`.`id` IS NOT NULL ',
		'AND `cafes`.`is_deleted` = :board_post_is_deleted ',
		'AND `tutors`.`is_deleted` = :board_post_is_deleted ',
		values.search_keyword ? 'AND ( ' : ' ',
		values.search_keyword ? '	`board_posts`.`title` LIKE :search_keyword ' : ' ',
		values.search_keyword ? '	OR ' : ' ',
		values.search_keyword ? '	`tutors`.`name` LIKE :search_keyword ' : ' ',
		values.search_keyword ? ') ' : ' ',
	].join(' ');

	const countSql = ['SELECT COUNT(`board_posts`.`id`) AS `total` '].join(' ') + sql;
	// total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = total && Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const attrSql = [
			'SELECT ',
			'`board_posts`.`*`, ',
			'`members`.`user_id`, ',
			'`members`.`nickname`, ',
			'`members`.`join_site`, ',
			'`members`.`join_type`, ',
			'`tutors`.`id` AS `tutor_id`, ',
			'`tutors`.`name` AS `tutor_name`, ',
			'`tutors`.`is_deleted` AS `tutor_is_deleted`, ',
			'`tutors`.`is_confirm` AS `tutor_is_confirm`, ',
			'`tutor_attributes`.`sex` AS `tutor_sex`, ',
			'`tutor_attributes`.`message` AS `tutor_message`, ',
			'`tutor_attributes`.`profile` AS `tutor_profile`, ',
			'`tutor_attributes`.`default_profile` AS `tutor_default_profile`, ',
			'`cafes`.`id` AS `cafe_id`, ',
			'`cafes`.`type` AS `cafe_type`, ',
			'`cafes`.`is_deleted` AS `cafe_is_deleted`, ',
			'( ',
			'	SELECT IFNULL(SUM(`post_files`.`download_count`), 0) FROM `post_files` ',
			'	WHERE `post_files`.`post_id` = `board_posts`.`id`',
			') AS `download_count` ',
		].join(' ');
		let orderSql = null;
		const limitSql = ['LIMIT :offset, :limit; '].join('');
		if (common) {
			if (common.order === 'last_at') orderSql = ['ORDER BY `board_posts`.`created_at` DESC, ', '`board_posts`.`id` DESC '].join(' ');
			if (common.order === 'view_count') orderSql = ['ORDER BY `board_posts`.`read_count` DESC, ', '`board_posts`.`id` DESC '].join(' ');
			if (common.order === 'recommend_count') orderSql = ['ORDER BY `board_posts`.`like_count` DESC, ', '`board_posts`.`id` DESC '].join(' ');
			if (common.order === 'comment_count') orderSql = ['ORDER BY `board_posts`.`comment_count` DESC, ', '`board_posts`.`id` DESC '].join(' ');
			if (common.order === 'download_count') orderSql = ['ORDER BY `download_count` DESC, ', '`board_posts`.`id` DESC '].join(' ');
		}

		const boardPostData = await sequelize.query(attrSql + sql + orderSql + limitSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
		const posts = [];
		for (let i = 0; i < boardPostData.length; i += 1) {
			const tutorSubject = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(boardPostData[i].tutor_id, boardPostData[i].post_filter_lv1_id); // eslint-disable-line no-await-in-loop
			const tmppost = {
				id: boardPostData[i].id,
				board_config_id: boardPostData[i].board_config_id,
				member_id: boardPostData[i].member_id,
				parent_post_id: boardPostData[i].parent_post_id,
				group_id: boardPostData[i].group_id,
				depth: boardPostData[i].depth,
				sort_no: boardPostData[i].sort_no,
				is_deleted: boardPostData[i].is_deleted,
				is_notice: boardPostData[i].is_notice,
				is_secret: boardPostData[i].is_secret,
				title: boardPostData[i].title,
				contents: boardPostData[i].contents,
				link_url: boardPostData[i].link_url,
				is_blank: boardPostData[i].is_blank,
				comment_count: boardPostData[i].comment_count,
				read_count: boardPostData[i].read_count,
				attached_file_count: boardPostData[i].attached_file_count,
				content_file_count: boardPostData[i].content_file_count,
				thumbnail_file_count: boardPostData[i].thumbnail_file_count,
				like_count: boardPostData[i].like_count,
				dislike_count: boardPostData[i].dislike_count,
				blame_status: boardPostData[i].blame_status,
				child_post_count: boardPostData[i].child_post_count,
				download_count: parseInt(boardPostData[i].download_count, 10),
				created_ip: boardPostData[i].created_ip,
				created_at: boardPostData[i].created_at,
				updated_at: boardPostData[i].updated_at,
				member: { user_id: boardPostData[i].user_id, nickname: boardPostData[i].nickname, join_site: boardPostData[i].join_site, join_type: boardPostData[i].join_type },
				post_filter: { id: boardPostData[i].post_filter_id, lv05_id: boardPostData[i].post_filter_lv05_id, lv1_id: boardPostData[i].post_filter_lv1_id },
				tutor: {
					id: boardPostData[i].tutor_id,
					name: boardPostData[i].tutor_name,
					is_deleted: boardPostData[i].tutor_is_deleted,
					is_confirm: boardPostData[i].tutor_is_confirm,
					attribute: {
						sex: boardPostData[i].tutor_sex,
						profile: boardPostData[i].tutor_profile,
						default_profile: boardPostData[i].tutor_default_profile,
						message: boardPostData[i].tutor_message,
					},
					subject: tutorSubject,
				},
				cafe: { id: boardPostData[i].cafe_id, type: boardPostData[i].cafe_type, is_deleted: boardPostData[i].cafe_is_deleted },
			};
			posts.push(tmppost);
		}
		if (Object.keys(posts).length > 0) response = { total, list: posts };
	}

	return response;
};

/**
 * @description Lv1 강사 자료 자료별 실시간 HOT 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getTutorResourcePostHotBoardPost = async (searchFields, offset = 0, limit = 10) => {
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const postFIlter = searchFields.post_filter ? searchFields.post_filter : null;
	const tutor = searchFields.tutor ? searchFields.tutor : null;
	const values = {
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
		board_config_id: boardPost.board_config_id,
		is_deleted: boardPost.is_deleted,
		is_secret: boardPost.is_secret,
		is_notice: boardPost.is_notice,
		lv1_id: postFIlter.lv1_id,
		is_confirm: tutor.is_confirm,
	};
	let response = null;

	const sql = [
		'SELECT ',
		'	`board_posts`.`id`, ',
		'	`board_posts`.`board_config_id`, ',
		'	`board_posts`.`member_id`, ',
		'	`board_posts`.`created_at`, ',
		'	`board_posts`.`updated_at`, ',
		'	`board_posts`.`is_deleted`, ',
		'	`board_posts`.`is_notice`, ',
		'	`board_posts`.`title`, ',
		'	`members`.`user_id`, ',
		'	`members`.`nickname`, ',
		'	`member_attributes`.`name`, ',
		'	`member_attributes`.`sex`, ',
		'	`member_attributes`.`thumbnail`, ',
		'	`member_attributes`.`default_thumbnail`, ',
		'	`tutors`.`id` AS `tutor_id`, ',
		'	`tutors`.`name` AS `tutor_name`, ',
		'	`tutors`.`is_deleted` AS `tutor_is_deleted`, ',
		'	`tutors`.`is_confirm` AS `tutor_is_confirm`, ',
		'	`tutor_attributes`.`sex` AS `tutor_sex`, ',
		'	`tutor_attributes`.`profile` AS `tutor_profile`, ',
		'	`tutor_attributes`.`default_profile` AS `tutor_default_profile`, ',
		'	`tutor_attributes`.`message` AS `tutor_message` ',
		'FROM ( ',
		'	SELECT ',
		'		`board_posts`.`*`, ',
		'		`post_filter`.`id` AS `post_filter_id`, ',
		'		`post_filter`.`lv05_id` AS `post_filter_lv05_id`, ',
		'		`post_filter`.`lv1_id` AS `post_filter_lv1_id` ',
		'	FROM `board_posts` ',
		'	INNER JOIN `post_filter` ON `post_filter`.`post_id` = `board_posts`.`id` ',
		'	WHERE `board_posts`.`id` IS NOT NULL ',
		'	AND `board_posts`.`is_deleted` = :is_deleted ',
		'	AND `board_posts`.`is_notice` = :is_notice ',
		'	AND `board_posts`.`is_secret` = :is_secret ',
		'	AND `board_posts`.`board_config_id` = :board_config_id ',
		'	AND `post_filter`.`lv1_id` = :lv1_id ',
		'	ORDER BY `board_posts`.`read_count` DESC, `board_posts`.`id` DESC ',
		'	LIMIT :offset, :limit',
		') AS `board_posts` ',
		'INNER JOIN `cafe_posts` ON `cafe_posts`.`board_posts_id` = `board_posts`.`id` ',
		'INNER JOIN `cafes` ON `cafes`.`id` = `cafe_posts`.`cafe_id` ',
		'INNER JOIN `cafe_tutors` ON `cafe_tutors`.`cafe_id` = `cafes`.`id` ',
		'INNER JOIN `tutors` ON `tutors`.`id` = `cafe_tutors`.`tutor_id` ',
		'INNER JOIN `tutor_attributes` ON `tutor_attributes`.`tutor_id` = `tutors`.`id` ',
		'INNER JOIN `members` ON `members`.`id` = `board_posts`.`member_id` ',
		'INNER JOIN `member_attributes` ON `member_attributes`.`member_id` = `members`.`id` ',
		'WHERE `board_posts`.`id` IS NOT NULL ',
		'AND `cafes`.`is_deleted` = :is_deleted ',
		'AND `tutors`.`is_deleted` = :is_deleted ',
		'AND `tutors`.`is_confirm` = :is_confirm ',
	].join(' ');

	const postData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	const posts = [];
	if (postData && Object.keys(postData).length > 0) {
		for (let i = 0; i < postData.length; i += 1) {
			const tmpPost = {
				id: postData[i].id,
				board_config_id: postData[i].board_config_id,
				member_id: postData[i].member_id,
				created_at: postData[i].created_at,
				updated_at: postData[i].updated_at,
				is_deleted: postData[i].is_deleted,
				is_notice: postData[i].is_notice,
				title: postData[i].title,
				member: {
					user_id: postData[i].user_id,
					nickname: postData[i].nickname,
					attribute: { name: postData[i].name, sex: postData[i].sex, thumbnail: postData[i].thumbnail, default_thumbnail: postData[i].default_thumbnail },
				},
				tutor: {
					id: postData[i].tutor_id,
					name: postData[i].tutor_name,
					is_deleted: postData[i].tutor_is_deleted,
					is_confirm: postData[i].tutor_is_confirm,
					attribute: { sex: postData[i].tutor_sex, profile: postData[i].tutor_profile, default_profile: postData[i].tutor_default_profile, message: postData[i].tutor_message },
				},
			};
			posts.push(tmpPost);
		}
		if (Object.keys(posts).length > 0) response = { list: posts };
	}

	return response;
};
