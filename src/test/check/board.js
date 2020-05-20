import * as common from '../component/common';

// 추천 비추천 검사
export const checkOppositionRecommendCount = (oppositionRecommend) => {
	if (oppositionRecommend.recommend) expect(typeof oppositionRecommend.recommend).toEqual('number');
	if (oppositionRecommend.opposition) expect(typeof oppositionRecommend.opposition).toEqual('number');
};

// board_post 검사
export const checkBoardPost = (boardPost) => {
	if (boardPost.id) expect(typeof boardPost.id).toEqual('number');
	if (boardPost.author) expect(typeof boardPost.author).toEqual('string');
	if (boardPost.board_config_id) expect(common.boardConfigIdCheck(boardPost.board_config_id)).toEqual(true);
	if (boardPost.member_id) expect(typeof boardPost.member_id).toEqual('number');
	if (boardPost.parent_post_id) expect(typeof boardPost.parent_post_id).toEqual('number');
	if (boardPost.group_id) expect(typeof boardPost.group_id).toEqual('number');
	if (boardPost.depth) expect(typeof boardPost.depth).toEqual('number');
	if (boardPost.sort_no) expect(typeof boardPost.sort_no).toEqual('number');
	if (boardPost.is_deleted) expect(common.agreementCheck(boardPost.is_deleted)).toEqual(true);
	if (boardPost.is_notice) expect(common.agreementCheck(boardPost.is_notice)).toEqual(true);
	if (boardPost.is_secret) expect(common.agreementCheck(boardPost.is_secret)).toEqual(true);
	if (boardPost.blame_status) expect(common.boardBlameStatusCheck(boardPost.blame_status)).toEqual(true);
	if (boardPost.allow_scroll) expect(common.agreementCheck(boardPost.allow_scroll)).toEqual(true);
	if (boardPost.title) expect(typeof boardPost.title).toEqual('string');
	if (boardPost.contents) expect(typeof boardPost.contents).toEqual('string');
	if (boardPost.link_url) expect(typeof boardPost.link_url).toEqual('string');
	if (boardPost.is_blank) expect(common.agreementCheck(boardPost.is_blank)).toEqual(true);
	if (boardPost.comment_count) expect(typeof boardPost.comment_count).toEqual('number');
	if (boardPost.read_count) expect(typeof boardPost.read_count).toEqual('number');
	if (boardPost.attached_file_count) expect(typeof boardPost.attached_file_count).toEqual('number');
	if (boardPost.content_file_count) expect(typeof boardPost.content_file_count).toEqual('number');
	if (boardPost.thumbnail_file_count) expect(typeof boardPost.thumbnail_file_count).toEqual('number');
	if (boardPost.like_count) expect(typeof boardPost.like_count).toEqual('number');
	if (boardPost.dislike_count) expect(typeof boardPost.dislike_count).toEqual('number');
	if (boardPost.device_info) expect(typeof boardPost.device_info).toEqual('string');
	if (boardPost.created_ip) expect(typeof boardPost.created_ip).toEqual('string');
};

// post_file 검사
export const checkPostFile = (postFile) => {
	if (postFile.id) expect(typeof postFile.id).toEqual('number');
	if (postFile.post_id) expect(typeof postFile.post_id).toEqual('number');
	if (postFile.file_type) expect(common.fileTypeCheck(postFile.file_type)).toEqual(true);
	if (postFile.org_file_name) expect(typeof postFile.org_file_name).toEqual('string');
	if (postFile.s3_file_name) expect(typeof postFile.s3_file_name).toEqual('string');
	if (postFile.file_ext) expect(typeof postFile.file_ext).toEqual('string');
	if (postFile.file_url) expect(typeof postFile.file_url).toEqual('string');
	if (postFile.s3_key) expect(typeof postFile.s3_key).toEqual('string');
	if (postFile.is_deleted) expect(common.agreementCheck(postFile.is_deleted)).toEqual(true);
	if (postFile.byte_size) expect(typeof postFile.byte_size).toEqual('number');
	if (postFile.img_width) expect(typeof postFile.img_width).toEqual('number');
	if (postFile.img_height) expect(typeof postFile.img_height).toEqual('number');
	if (postFile.download_count) expect(typeof postFile.download_count).toEqual('number');

	return null;
};
