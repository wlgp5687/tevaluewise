import { getModel, sequelize, Op } from '../../database';

import * as commonComponent from '../common';

const PostFile = getModel('PostFile');
const PostFilterMulti = getModel('PostFilterMulti');
const PostComment = getModel('PostComment');
const PostCommentCountLog = getModel('PostCommentCountLog');

/**
 * @description 게시물 멀티 필터 전체 삭제처리
 * @param {Int} postId
 * @param {*} t
 */
export const deletePostFilterMultiByPostId = async (postId, t) => {
	const response = await PostFilterMulti.destroy({ where: { post_id: postId }, transaction: t });
	return response;
};

/**
 * @description 첨부파일 삭제 처리
 * @param {Int} id
 * @param {*} t
 */
export const deletePostFile = async (id, t) => {
	const response = await PostFile.update({ is_deleted: 'Y', updated_at: await commonComponent.nowDateTime() }, { where: { id }, transaction: t });
	return response;
};

/**
 * @description 게시물 댓글 삭제
 * @param {Int} postCommentId
 * @param {Int} loginMemberId
 */
export const deleteBoardPostCommentById = async (postCommentId, loginMemberId) => {
	const response = await PostComment.update({ is_deleted: 'Y' }, { where: { id: postCommentId, member_id: loginMemberId } });
	return response;
};

/**
 * @description 게시물 댓글 추천 & 비추천 로그 삭제
 * @param {Int} postCommentId
 * @param {String} type
 * @param {Int} memberId
 * @param {Transaction} t
 */
export const deleteBoardPostCommentCountLog = async (postCommentCountLog, t) => {
	const response = await PostCommentCountLog.destroy({
		where: { comment_id: postCommentCountLog.comment_id, post_comment_count_log_type: postCommentCountLog.post_comment_count_log_type, member_id: postCommentCountLog.member_id },
		transaction: t,
	});
	return response;
};
