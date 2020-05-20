import { getModel, sequelize, Op } from '../../database';

const BoardPost = getModel('BoardPost');
const PostSearchSource = getModel('PostSearchSource');
const PostComment = getModel('PostComment');
const PostFilter = getModel('PostFilter');

/**
 * @description 게시물 검색 소스 상태 변경(삭제만)
 * @param {Array} boardPostSearch
 * @param {Transaction} t
 */
export const updatePostSearchSource = async (boardPostSearch, t) => {
	const response = await PostSearchSource.update({ is_deleted: boardPostSearch.is_deleted }, { where: { post_id: boardPostSearch.post_id }, transaction: t });
	return response;
};

/**
 * @description 게시물 상태 변경
 * @param {Array} boardPost
 * @param {TranSaction} t
 */
export const updateBoardPostByBoardPostId = async (boardPost, t) => {
	const response = await BoardPost.update(
		{
			is_deleted: boardPost.is_deleted,
			is_notice: boardPost.is_notice,
			is_secret: boardPost.is_secret,
			blame_status: boardPost.blame_status,
			title: boardPost.title,
			contents: boardPost.contents,
			link_url: boardPost.link_url,
			is_blank: boardPost.is_blank,
			group_id: boardPost.group_id,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};

/**
 * @description 게시물 답글 상태 변경
 * @param {Array} boardPost
 * @param {Transaction} t
 */
export const updateBoardPostByBoardParentPostId = async (boardPost, t) => {
	const response = await BoardPost.update({ is_deleted: boardPost.is_deleted }, { where: { parent_post_id: boardPost.parent_post_id }, transaction: t });
	return response;
};

/**
 * 게시물 인덱스로 게시물 댓글 상태 변경
 * @param {Array} postComment
 * @param {Transaction} t
 */
export const updatePostCommentByPostId = async (postComment, t) => {
	const response = await PostComment.update({ is_deleted: postComment.is_deleted, group_id: postComment.group_id }, { where: { post_id: postComment.post_id }, transaction: t });
	return response;
};

/**
 * @description 게시물 댓글 상태 변경
 * @param {Array} postComment
 * @param {Transaction} t
 */
export const updatePostCommentById = async (postComment, t) => {
	const response = await PostComment.update({ is_deleted: postComment.is_deleted, group_id: postComment.group_id }, { where: { id: postComment.id }, transaction: t });
	return response;
};

/**
 * @description 게시물 수정
 * @param {Array} boardPost
 * @param {Transaction} t
 */
export const patchBoardPost = async (boardPost, t) => {
	const response = await BoardPost.update(
		{
			is_deleted: boardPost.is_deleted,
			is_notice: boardPost.is_notice,
			is_secret: boardPost.is_secret,
			title: boardPost.title,
			contents: boardPost.contents,
			link_url: boardPost.link_url,
			is_blank: boardPost.is_blank,
			attached_file_count: boardPost.attached_file_count,
			content_file_count: boardPost.content_file_count,
			thumbnail_file_count: boardPost.thumbnail_file_count,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};

/**
 * @description 게시물 필터 수정
 * @param {Array} postFilter
 * @param {Transaction} t
 */
export const patchPostFilter = async (postFilter, t) => {
	const response = await PostFilter.update(
		{
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
		{ where: { post_id: postFilter.post_id }, transaction: t },
	);
	return response;
};

/**
 * @description board_post 에서 같은 group_id 에 소속되어 있고 해당 sort_no 보다 큰 post 들의 sort_no + 1 추가
 * @param {Int} groupId
 * @param {Int} sortNo
 */
export const updateBoardPostSortNo = async (groupId, sortNo) => {
	const response = await BoardPost.update({ sort_no: sequelize.literal('sort_no + 1') }, { where: { group_id: groupId, sort_no: { [Op.gt]: sortNo } } });
	return response;
};

/**
 * @description board_post_comment 에서 같은 group_id 에 소속되어 있고 해당 sort_no 보다 큰 comment 들의 sort_no + 1 추가
 * @param {Int} groupId
 * @param {Int} sortNo
 */
export const updateBoardPostCommentSortNo = async (groupId, sortNo) => {
	const response = await PostComment.update({ sort_no: sequelize.literal('sort_no + 1') }, { where: { group_id: groupId, sort_no: { [Op.gt]: sortNo } } });
	return response;
};
