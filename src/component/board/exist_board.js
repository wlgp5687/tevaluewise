import { getModel, sequelize, Op } from '../../database';

const BoardPost = getModel('BoardPost');
const PostCountLog = getModel('PostCountLog');
const PostComment = getModel('PostComment');
const PostCommentCountLog = getModel('PostCommentCountLog');

/**
 * @description postId 존재 여부 조회
 * @param {Int} postId
 */
export const isExistPostId = async (postId) => ((await BoardPost.count({ where: { id: postId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

/**
 * @description postComment 존재 여부 조회
 * @param {Int} postCommentId
 */
export const isExistPostCommentId = async (postCommentId) => ((await PostComment.count({ where: { id: postCommentId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

/**
 * @description 게시물 추천 및 비추천 여부 조회
 * @param {Int} postId
 * @param {String} type
 * @param {Int} memberId
 */
export const isExistBoardPostCount = async (postId, type, memberId) => {
	let postCountLogType = type;
	if (type === 'like' || type === 'dislike') postCountLogType = { [Op.in]: ['like', 'dislike'] };
	const response = await PostCountLog.findOne({ where: { post_id: postId, post_count_log_type: postCountLogType, member_id: memberId } });
	return response;
};

/**
 * @description 게시물 댓글 추천 및 비추천 여부 조회
 * @param {Int} postCommentId
 * @param {Int} memberId
 */
export const isExistBoardPostCommentCount = async (postCommentId, memberId) => {
	const response = await PostCommentCountLog.findOne({ where: { comment_id: postCommentId, member_id: memberId } });
	return response;
};
