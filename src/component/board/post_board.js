import { getModel, sequelize, Op } from '../../database';

const BoardPost = getModel('BoardPost');
const PostSearchSource = getModel('PostSearchSource');
const PostFilter = getModel('PostFilter');
const PostFilterMulti = getModel('PostFilterMulti');
const PostFile = getModel('PostFile');
const PostComment = getModel('PostComment');
const CafePost = getModel('CafePost');
const PostCountLog = getModel('PostCountLog');
const PostCommentCountLog = getModel('PostCommentCountLog');

/**
 * @description 게시물 작성
 * @param {Array} boardPost
 * @param {Boolean} isGetId
 * @param {*} t
 */
export const addBoardPost = async (boardPost, isGetId = false, t) => {
	const response = await BoardPost.create(
		{
			board_config_id: boardPost.board_config_id,
			member_id: boardPost.member_id,
			parent_post_id: boardPost.parent_post_id,
			group_id: boardPost.group_id,
			depth: boardPost.depth,
			sort_no: boardPost.sort_no,
			is_deleted: boardPost.is_deleted,
			is_notice: boardPost.is_notice,
			is_secret: boardPost.is_secret,
			blame_status: boardPost.blame_status,
			allow_scroll: boardPost.allow_scroll,
			title: boardPost.title,
			contents: boardPost.contents,
			link_url: boardPost.link_url,
			is_blank: boardPost.is_blank,
			comment_count: boardPost.comment_count,
			read_count: boardPost.read_count,
			attached_file_count: boardPost.attached_file_count,
			content_file_count: boardPost.content_file_count,
			thumbnail_file_count: boardPost.thumbnail_file_count,
			like_count: boardPost.like_count,
			dislike_count: boardPost.dislike_count,
			device_info: boardPost.device_info,
			created_ip: boardPost.created_ip,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 게시물 필터 작성
 * @param {Array} postFilter
 * @param {Boolean} isGetId
 * @param {*} t
 */
export const addPostFilter = async (postFilter, isGetId = false, t) => {
	const response = await PostFilter.create(
		{
			post_id: postFilter.post_id,
			board_config_id: postFilter.board_config_id,
			lv05_id: postFilter.lv05_id,
			lv1_id: postFilter.lv1_id,
			institute_id: postFilter.institute_id,
			answer_status: postFilter.answer_status,
			faq_category: postFilter.faq_category,
			info_category: postFilter.info_category,
			lecture_type: postFilter.lecture_type,
			sex: postFilter.sex,
			transfer_filter_id: postFilter.transfer_filter_id,
			appointment_subtype: postFilter.appointment_subtype,
			appointment_local_region: postFilter.appointment_local_region,
			subject_filter_id: postFilter.subject_filter_id,
			year: postFilter.year,
			gong_local_region: postFilter.gong_local_region,
			gong_speciality_part_filter_id: postFilter.gong_speciality_part_filter_id,
			gong_grade_filter_id: postFilter.gong_grade_filter_id,
			gong_serial_filter_id: postFilter.gong_serial_filter_id,
			sub_filter_id: postFilter.sub_filter_id,
			certificate_filter_id: postFilter.certificate_filter_id,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 게시물 멀티 필터 작성
 * @param {Array} postFilterMulti
 * @param {Boolean} isGetId
 * @param {*} t
 */
export const addPostFilterMulti = async (postFilterMulti, isGetId = false, t) => {
	const response = await PostFilterMulti.create(
		{
			post_id: postFilterMulti.post_id,
			board_config_id: postFilterMulti.board_config_id,
			post_filter_type: postFilterMulti.post_filter_type,
			post_filter_id: postFilterMulti.post_filter_id,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 게시물 첨부파일 작성
 * @param {Array} boardAttachedFile
 * @param {Boolean} isGetId
 * @param {*} t
 */
export const addPostFile = async (boardAttachedFile, isGetId = false, t) => {
	const resposne = await PostFile.create(
		{
			post_id: boardAttachedFile.post_id,
			file_type: boardAttachedFile.file_type,
			org_file_name: boardAttachedFile.org_file_name,
			s3_file_name: boardAttachedFile.s3_file_name,
			file_ext: boardAttachedFile.file_ext,
			file_url: boardAttachedFile.file_url,
			s3_key: boardAttachedFile.s3_key,
			is_deleted: 'N',
			byte_size: boardAttachedFile.byte_size,
			img_width: boardAttachedFile.img_width,
			img_height: boardAttachedFile.img_height,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? resposne.dataValues.id : resposne;
};

/**
 * @description 게시물 검색 소스 테이블 저장
 * @param {Array} boardPost
 * @param {Array} postFilter
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const addPostSearchSource = async (boardPost, postFilter, isGetId = false, t) => {
	const resposne = await PostSearchSource.create(
		{
			board_config_id: boardPost.board_config_id,
			post_id: boardPost.id,
			lv1_id: postFilter.lv1_id ? postFilter.lv1_id : null,
			title: boardPost.title,
			contents: boardPost.contents.replace(/(<([^>]+)>)/gi, ''),
			is_deleted: 'N',
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? resposne.dataValues.id : resposne;
};

/**
 * @description 게시물에 대한 댓글 등록
 * @param {Array} postComment
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const addBoardPostComment = async (postComment, isGetId = false, t) => {
	const response = await PostComment.create(
		{
			post_id: postComment.post_id,
			parent_comment_id: postComment.parent_comment_id,
			group_id: postComment.group_id,
			depth: postComment.depth,
			sort_no: postComment.sort_no,
			member_id: postComment.member_id,
			nickname: postComment.nickname,
			is_anonymous: postComment.is_anonymous,
			anonymous_email: postComment.anonymous_email,
			is_secret: postComment.is_secret,
			secret_password: postComment.secret_password,
			created_ip: postComment.created_ip,
			is_deleted: postComment.is_deleted,
			blame_status: postComment.blame_status,
			content: postComment.content,
			like_count: postComment.like_count,
			dislike_count: postComment.dislike_count,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 게시글 카페 연결
 * @param {Array} boardPostCafe
 * @param {*} t
 */
export const addCafePost = async (boardPostCafe, t) => {
	const response = await CafePost.create({ cafe_id: boardPostCafe.cafe_id, board_posts_id: boardPostCafe.board_post_id }, { transaction: t });
	return response;
};

/**
 * @description 게시물 추천 & 비추천 & 조회 로그 작성
 * @param {Array} PostCountLog
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const postBoardPostCount = async (postCountLog, isGetId = false, t) => {
	const response = await PostCountLog.create(
		{ post_id: postCountLog.post_id, member_id: postCountLog.member_id, post_count_log_type: postCountLog.post_count_log_type, created_ip: postCountLog.created_ip },
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 게시물 추천 카운트 증가
 * @param {Int} postId
 * @param {Transaction} t
 */
export const postPlusBoardPostLike = async (postId, t) => {
	const response = await BoardPost.update({ like_count: sequelize.literal(`like_count + 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

/**
 * @description 게시물 비추천 카운트 증가
 * @param {Int} postId
 * @param {Transaction} t
 */
export const postPlusBoardPostDislike = async (postId, t) => {
	const response = await BoardPost.update({ dislike_count: sequelize.literal(`dislike_count + 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

/**
 * @description 게시물 댓글 수 증가
 * @param {Int} postId
 * @param {Transaction} t
 */
export const postPlusBoardPostCommentCount = async (postId, t) => {
	const response = await BoardPost.update({ comment_count: sequelize.literal(`comment_count + 1`) }, { where: { id: postId }, transaction: t });
	return response;
};

/**
 * @description 게시물 댓글 추천 & 비추천 로그 작성
 * @param {Array} postCommentCountLog
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const postBoardPostCommentCountLog = async (postCommentCountLog, isGetId = false, t) => {
	const response = await PostCommentCountLog.create(
		{
			comment_id: postCommentCountLog.comment_id,
			member_id: postCommentCountLog.member_id,
			post_comment_count_log_type: postCommentCountLog.post_comment_count_log_type,
			created_ip: postCommentCountLog.created_ip,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 게시물 댓글 추천 카운트 증가
 * @param {Int} postCommentId
 * @param {Transaction} t
 */
export const postPlusBoardPostCommentLike = async (postCommentId, t) => {
	const response = await PostComment.update({ like_count: sequelize.literal(`like_count + 1`) }, { where: { id: postCommentId }, transaction: t });
	return response;
};

/**
 * @description 게시물 댓글 비추천 카운트 증가
 * @param {Int} postCommentId
 * @param {Transaction} t
 */
export const postPlusBoardPostCommentDislike = async (postCommentId, t) => {
	const response = await PostComment.update({ dislike_count: sequelize.literal(`dislike_count + 1`) }, { where: { id: postCommentId }, transaction: t });
	return response;
};

/**
 * @description 게시물 댓글 추천 카운트 감소
 * @param {Int} postCommentId
 * @param {Transaction} t
 */
export const postMinusBoardPostCommentLike = async (postCommentId, t) => {
	const response = await PostComment.update({ like_count: sequelize.literal(`like_count - 1`) }, { where: { id: postCommentId }, transaction: t });
	return response;
};
