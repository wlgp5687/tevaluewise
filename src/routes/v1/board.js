import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as boardService from '../../services/board/board';
import * as boardValidator from '../../validators/board';
import * as commonComponent from '../../component/common';
import { cache } from '../../services/cache';

const router = express.Router();

// 게시판별 목록 검색 선택지 조회
router.get(
	'/search/config',
	...boardValidator.getSearchConfig,
	wrapAsyncRouter(async (req, res) => {
		const boardType = req.query.board_type;
		const filterId = req.query.filter_id;
		const response = await boardService.getSearchConfig(boardType, filterId);
		// Return
		return res.json(response);
	}),
);

// 합격수기 & 수험후기 목록 조회(light version)
router.get(
	'/essay/list',
	...boardValidator.getEssayBoardPostsList,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const lv1Id = req.query.lv1_id;
		const instituteId = req.query.institute_id;
		const tutorId = req.query.tutor_id;

		let response = null;

		/**
		 * DESC : lv1Id 에 해당하는 합격수기 & 수험후기 중 해당 강사 인덱스로 연결된 게시물을 조회
		 * INPUT  : lv1Id, tutorId
		 * SEARCH : null
		 */
		if (lv1Id && tutorId && !instituteId) response = await boardService.getEssayBoardPostByLv1IdAndTutorId(lv1Id, tutorId, offset, limit);

		/**
		 * DESC : lv1Id 에 해당하는 합격수기 & 수험후기 중 해당 기관에 속한 강사에 연결된 게시물을 조회
		 * INPUT : lv1Id, instituteId
		 * SEARCH : null
		 */
		if (lv1Id && !tutorId && instituteId) response = await boardService.getEssayBoardPostByLv1IdAndInstituteId(lv1Id, instituteId, offset, limit);

		// Retrun
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 별별수다 & 맘톡 게시물 조회
router.get(
	'/talk/:post_id',
	...boardValidator.getTalkBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const createdIp = req.ipAddress;
		// 별별수다 & 맘톡 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'talk', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 합격수기 & 수험후기 게시물 조회
router.get(
	'/essay/:post_id',
	...boardValidator.getEssayBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const createdIp = req.ipAddress;
		//  합격수기 & 수험후기 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'essay', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 별별질문 & Q&A 게시물 조회 ( 답글 )
router.get(
	'/qna/:post_id',
	...boardValidator.getQnaBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;
		// 별별질문 & Q&A 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'qna', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 별별정보 게시물 조회
router.get(
	'/info/:post_id',
	...boardValidator.getInfoBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;

		// 별별정보 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'info', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 기출문제 & 해설 게시물 조회
router.get(
	'/exam/:post_id',
	...boardValidator.getExamBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const createdIp = req.ipAddress;
		// 기출문제 & 해설 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'exam', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 적폐청산 게시물 조회 ( 답글 )
router.get(
	'/report/:post_id',
	...boardValidator.getReportBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const createdIp = req.ipAddress;
		// 적폐청산 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'report', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 이벤트 게시물 조회
router.get(
	'/event/:post_id',
	...boardValidator.getEventBoardPost,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const createdIp = req.ipAddress;
		// 적폐청산 게시물 조회
		const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'event', memberId, createdIp);

		// Return
		return res.json(!boardPost ? null : { board_post: boardPost });
	}),
);

// 언론속의 선생님 & 언론속의 학원 & 학교소식 목록 조회
router.get(
	'/press',
	...boardValidator.getPressBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		const target = req.query.target; // eslint-disable-line
		const targetId = req.query.target_id ? req.query.target_id : null;

		// 언론속의 선생님 & 언론속의 학원 & 학교소식 목록 조회
		const posts = await boardService.getPressBoardPosts(target, targetId, offset, limit);

		// Return
		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 별별수다 목록 조회
router.get(
	'/talk',
	...boardValidator.getTalkBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';

		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// 검색 필터

		const postFilter = {};
		if (req.query.is_talk) postFilter.is_talk = req.query.is_talk;
		if (req.query.lv1_id) postFilter.lv1_id = req.query.lv1_id;
		if (req.query.institute_id) postFilter.institute_id = req.query.institute_id;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		const common = {};
		if (req.query.post_auth) common.post_auth = req.query.post_auth;
		if (req.query.order) common.order = req.query.order;
		if (req.query.keyword) common.keyword = req.query.keyword;
		if (Object.keys(common).length > 0) searchFields.common = common;

		// 별별수다 목록 조회
		const posts = await boardService.getTalkBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(isNotice === 'N' ? { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) } : posts);
	}),
);

// 합격수기 & 수험후기 목록 조회
router.get(
	'/essay',
	...boardValidator.getEssayBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// 검색 필터
		const postFilter = { lv1_id: req.query.lv1_id };
		if (req.query.year) postFilter.year = req.query.year;
		if (req.query.subject_filter) postFilter.subject_filter_id = req.query.subject_filter;
		if (req.query.lecture_type) postFilter.lecture_type = req.query.lecture_type;
		if (req.query.gong_grade_filter) postFilter.gong_grade_filter_id = req.query.gong_grade_filter;
		if (req.query.gong_local_region) postFilter.gong_local_region = req.query.gong_local_region;
		if (req.query.sub_filter) postFilter.sub_filter_id = req.query.sub_filter;
		if (req.query.certificate_filter) postFilter.certificate_filter_id = req.query.certificate_filter;
		if (req.query.gong_serial_filter) postFilter.gong_serial_filter_id = req.query.gong_serial_filter;
		if (req.query.sex) postFilter.sex = req.query.sex;
		if (req.query.gong_speciality_part_filter) postFilter.gong_speciality_part_filter_id = req.query.gong_speciality_part_filter;
		if (req.query.appointment_subtype) postFilter.appointment_subtype = req.query.appointment_subtype;
		if (req.query.appointment_local_region) postFilter.appointment_local_region = req.query.appointment_local_region;
		if (req.query.transfer_filter) postFilter.transfer_filter_id = req.query.transfer_filter;
		if (req.query.institute_id) postFilter.institute_id = req.query.institute_id;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		const postFilterMulti = {};
		if (req.query.tutor_id) postFilterMulti.post_filter_id = req.query.tutor_id;
		if (Object.keys(postFilterMulti).length > 0) searchFields.post_filter_multi = postFilterMulti;

		// 합격수기 목록 조회
		const posts = await boardService.getEssayBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(isNotice === 'N' ? { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) } : posts);
	}),
);

// 별별질문 & QnA 목록 조회
router.get(
	'/qna',
	...boardValidator.getQnaBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// 검색 필터
		const postFilter = { lv1_id: req.query.lv1_id };
		if (req.query.answer_status) postFilter.answer_status = req.query.answer_status;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		const postFilterMulti = {};
		if (req.query.tutor_id) postFilterMulti.tutor_id = req.query.tutor_id;
		if (Object.keys(postFilterMulti).length > 0) searchFields.post_filter_multi = postFilterMulti;

		const common = {};
		if (req.query.order) common.order = req.query.order;
		if (req.query.keyword) common.keyword = req.query.keyword;
		if (Object.keys(common).length > 0) searchFields.common = common;

		// 별별질문 / Q&A 목록 조회
		const posts = await boardService.getQnaBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(isNotice === 'N' ? { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) } : posts);
	}),
);

// 별별정보 목록 조회
router.get(
	'/info',
	...boardValidator.getInfoBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// 검색 필터;
		const postFilter = {};
		if (req.query.lv1_id) postFilter.lv1_id = req.query.lv1_id;
		if (req.query.info_category) postFilter.info_category = req.query.info_category;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		const common = {};
		if (req.query.keyword) common.keyword = `%${req.query.keyword}%`;
		if (req.query.order) common.order = req.query.order;
		if (Object.keys(common).length > 0) searchFields.common = common;

		// 별별정보 목록 조회
		const posts = await boardService.getInfoBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(isNotice === 'N' ? { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) } : posts);
	}),
);

// 별별 Best 목록 조회
router.get(
	'/best',
	...boardValidator.getBestBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = { board_post: { is_notice: 'N', is_deleted: 'N' } };

		// 검색 필터;
		const postFilter = {};
		if (req.query.lv1_id) postFilter.lv1_id = req.query.lv1_id;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		// 별별정보 목록 조회
		const posts = await boardService.getBestBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 주간Best 목록 조회
router.get(
	'/weeklybest',
	...boardValidator.getWeeklyBestBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = { board_post: { is_notice: 'N', is_deleted: 'N' } };

		// 검색 필터;
		const postFilter = {};
		if (req.query.lv1_id) postFilter.lv1_id = req.query.lv1_id;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		const dateFilter = {};
		dateFilter.thisweek = await commonComponent.nowDatePlusDate(-7);
		if (Object.keys(dateFilter).length > 0) searchFields.date_filter = dateFilter;

		// 별별정보 목록 조회
		const posts = await boardService.getWeeklyBestBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 기출문제 목록 조회
router.get(
	'/exam',
	...boardValidator.getExamBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// 검색 필터
		const postFilter = { lv1_id: req.query.lv1_id };
		if (req.query.subject_filter) postFilter.subject_filter_id = req.query.subject_filter;
		if (req.query.gong_grade_filter) postFilter.gong_grade_filter_id = req.query.gong_grade_filter;
		if (req.query.gong_local_region) postFilter.gong_local_region = req.query.gong_local_region;
		if (req.query.year) postFilter.year = req.query.year;
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		// 기출문제 목록 조회
		const posts = await boardService.getExamBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(isNotice === 'N' ? { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) } : posts);
	}),
);

// 적폐청산 목록 조회
router.get(
	'/report',
	...boardValidator.getReportBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// 검색 필터
		const common = {};
		if (req.query.keyword) common.keyword = `%${req.query.keyword}%`;
		if (Object.keys(common).length > 0) searchFields.common = common;

		// FAQ 목록 조회
		const posts = await boardService.getReportBoardPosts(searchFields, offset, limit);

		// Return
		if (!posts) return res.json(null);
		return res.json(isNotice === 'N' ? { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) } : posts);
	}),
);

// FAQ 목록 조회
router.get(
	'/faq',
	...boardValidator.getFaqBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		const faqCategory = req.query.faq_category;

		// FAQ 목록 조회
		const posts = await boardService.getFaqBoardPosts(faqCategory, offset, limit);

		// Return
		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 이벤트 목록 조회
router.get(
	'/event',
	...boardValidator.getEventBaordPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		const eventStatus = req.query.event_status;

		// 이벤트 목록 조회
		const posts = await boardService.getEventBoardPosts(eventStatus, offset, limit);

		// Return
		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 별별수다 & 맘톡 등록
router.post(
	'/talk',
	boardValidator.postTalkBoardPost,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const boardConfigId = 2;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: null,
			is_deleted: 'N',
			is_notice: 'N',
			is_secret: 'N',
			blame_status: 'NORMAL',
			allow_scroll: 'Y',
			title: req.body.title,
			contents: req.body.contents,
			link_url: null,
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		let lv1Id = null;
		if (req.body.lv1_id) lv1Id = req.body.lv1_id !== 'talk' ? req.body.lv1_id : null;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id };
		if (req.body.institute_id) postFilter.institute_id = req.body.institute_id;

		const tutorId = req.body.tutor_id ? req.body.tutor_id : null;

		const postFilterMulti = [];
		if (tutorId) {
			const tutorArray = tutorId.split('|');
			for (let i = 0; i < tutorArray.length; i += 1) postFilterMulti.push({ board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: tutorArray[i] });
		}

		// 게시물 작성처리
		response = await boardService.doRegisterBoardPost(boardPost, postFilter, postFilterMulti, boardAttachedFile, []);
		// Return
		return res.json(response);
	}),
);

// 합격수기 & 수험후기 등록
router.post(
	'/essay',
	...boardValidator.postEssayBoardPost,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const boardConfigId = 3;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: null,
			is_deleted: 'N',
			is_notice: 'N',
			is_secret: 'N',
			blame_status: 'NORMAL',
			allow_scroll: 'N',
			title: req.body.title,
			contents: req.body.contents,
			link_url: null,
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		const lv1Id = req.body.lv1_id;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id };

		// 년도 추가
		if (['2', '7', '16', '20', '317', '353', '449', '462', '475', '313', '289', '294', '80', '85', '92', '132', '137'].includes(String(lv1Id))) postFilter.year = req.body.year;
		// 과목 추가
		if (['2', '7', '16', '294', '80', '85', '92', '132'].includes(String(lv1Id))) postFilter.subject_filter_id = req.body.subject_filter_id;
		// 수강 유형 추가
		if (['20'].includes(String(lv1Id))) postFilter.lecture_type = req.body.lecture_type;
		// 급수 추가
		if (['317', '353'].includes(String(lv1Id))) postFilter.gong_grade_filter_id = req.body.gong_grade_filter_id;
		// 근무지역 추가
		if (['317', '353'].includes(String(lv1Id))) postFilter.gong_local_region = req.body.gong_local_region;
		// sub타입 추가
		if (['313'].includes(String(lv1Id))) postFilter.sub_filter_id = req.body.sub_filter_id;
		// 자격증 추가
		if (['274'].includes(String(lv1Id))) postFilter.certificate_filter_id = req.body.certificate_filter_id;
		// 직렬 추가
		if (['317', '353', '475'].includes(String(lv1Id))) postFilter.gong_serial_filter_id = req.body.gong_serial_filter_id;
		// 성별 추가
		if (['449', '462'].includes(String(lv1Id))) postFilter.sex = req.body.sex;
		// 직군 추가
		if (['475'].includes(String(lv1Id))) postFilter.gong_speciality_part_filter_id = req.body.gong_speciality_part_filter_id;
		// 초등/유아임용 하위구분 추가
		if (['289'].includes(String(lv1Id))) postFilter.appointment_subtype = req.body.appointment_subtype;
		// 임용 지역 추가
		if (['289', '294'].includes(String(lv1Id))) postFilter.appointment_local_region = req.body.appointment_local_region;
		// 학교 추가
		if (['137'].includes(String(lv1Id))) postFilter.transfer_filter_id = req.body.transfer_filter_id;

		const tutorId = req.body.tutor_id ? req.body.tutor_id : null;

		const postFilterMulti = [];
		if (tutorId) {
			const tutorArray = tutorId.split('|');
			for (let i = 0; i < tutorArray.length; i += 1) postFilterMulti.push({ board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: tutorArray[i] });
		}

		// 게시물 작성처리
		response = await boardService.doRegisterBoardPost(boardPost, postFilter, postFilterMulti, boardAttachedFile, []);
		// Return
		return res.json(response);
	}),
);

// 별별질문 & QnA 등록 ( 답글 )
router.post(
	'/qna',
	...boardValidator.postQnaBoardPost,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const boardConfigId = 4;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];
		const isSecret = req.body.is_secret ? req.body.is_secret : 'N';

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: req.body.parent_post_id ? req.body.parent_post_id : null,
			is_deleted: 'N',
			is_notice: 'N',
			is_secret: isSecret,
			blame_status: 'NORMAL',
			allow_scroll: 'N',
			title: req.body.title,
			contents: req.body.contents,
			link_url: null,
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		const lv1Id = req.body.lv1_id;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id, answer_status: req.body.parent_post_id ? 'completion' : 'pause' };
		const tutorId = req.body.tutor_id ? req.body.tutor_id : null;

		const postFilterMulti = [];
		if (tutorId) {
			const tutorArray = tutorId.split('|');
			for (let i = 0; i < tutorArray.length; i += 1) postFilterMulti.push({ board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: tutorArray[i] });
		}

		// 게시물 작성처리
		response = await boardService.doRegisterBoardPost(boardPost, postFilter, postFilterMulti, boardAttachedFile, []);
		// Return
		return res.json(response);
	}),
);

// 별별정보 등록
router.post(
	'/info',
	...boardValidator.postInfoBaordPost,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const boardConfigId = 5;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: null,
			is_deleted: 'N',
			is_notice: 'N',
			is_secret: 'N',
			blame_status: 'NORMAL',
			allow_scroll: 'N',
			title: req.body.title,
			contents: req.body.contents,
			link_url: null,
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		const lv1Id = req.body.lv1_id;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id, info_category: req.body.info_category };

		// 게시물 작성처리
		response = await boardService.doRegisterBoardPost(boardPost, postFilter, [], boardAttachedFile, []);
		// Return
		return res.json(response);
	}),
);

// 적폐청산 등록 ( 답글 )
router.post(
	'/report',
	...boardValidator.postReportBoardPost,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const boardConfigId = 7;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: req.body.parent_post_id ? req.body.parent_post_id : null,
			is_deleted: 'N',
			is_notice: 'N',
			is_secret: 'N',
			blame_status: 'NORMAL',
			allow_scroll: 'Y',
			title: req.body.title,
			contents: req.body.contents,
			link_url: req.body.link_url ? req.body.link_url : '',
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		const lv1Id = req.body.lv1_id;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id, answer_status: 'pause' };

		// 게시물 작성처리
		response = await boardService.doRegisterBoardPost(boardPost, postFilter, [], boardAttachedFile, []);
		// Return
		return res.json(response);
	}),
);

// 별별수다 & 맘톡 게시물 수정
router.patch(
	'/talk/:post_id',
	...boardValidator.patchTalkBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 2;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents };

		// 게시물 수정처리
		await boardService.doModifyBoardPost(boardPost, null, [], boardAttachedFile);
		// Return
		return res.json(null);
	}),
);

// 합격후기 & 수험후기 게시물 수정
router.patch(
	'/essay/:post_id',
	...boardValidator.patchEssayBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 3;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents };

		// post_filter
		const postFilter = {};
		if (req.body.year) postFilter.year = req.body.year;
		if (req.body.subject_filter_id) postFilter.subject_filter_id = req.body.subject_filter_id;
		if (req.body.lecture_type) postFilter.lecture_type = req.body.lecture_type;
		if (req.body.gong_grade_filter_id) postFilter.gong_grade_filter_id = req.body.gong_grade_filter_id;
		if (req.body.gong_local_region) postFilter.gong_local_region = req.body.gong_local_region;
		if (req.body.sub_filter_id) postFilter.sub_filter_id = req.body.sub_filter_id;
		if (req.body.certificate_filter_id) postFilter.certificate_filter_id = req.body.certificate_filter_id;
		if (req.body.gong_serial_filter_id) postFilter.gong_serial_filter_id = req.body.gong_serial_filter_id;
		if (req.body.sex) postFilter.sex = req.body.sex;
		if (req.body.gong_speciality_part_filter_id) postFilter.gong_speciality_part_filter_id = req.body.gong_speciality_part_filter_id;
		if (req.body.appointment_subtype) postFilter.appointment_subtype = req.body.appointment_subtype;
		if (req.body.appointment_local_region) postFilter.appointment_local_region = req.body.appointment_local_region;
		if (req.body.transfer_filter_id) postFilter.transfer_filter_id = req.body.transfer_filter_id;

		// post_filter_multi
		const tutorId = req.body.tutor_id ? req.body.tutor_id : null;

		const postFilterMulti = [];
		if (tutorId) {
			const tutorArray = tutorId.split('|');
			for (let i = 0; i < tutorArray.length; i += 1) postFilterMulti.push({ board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: tutorArray[i] });
		}

		// 게시물 수정처리
		await boardService.doModifyBoardPost(boardPost, postFilter, postFilterMulti, boardAttachedFile);
		// Return
		return res.json(null);
	}),
);

// 별별질문 & QnA 게시물 수정
router.patch(
	'/qna/:post_id',
	...boardValidator.patchQnaBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 4;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents };

		// post_filter
		const postFilter = {};

		// post_filter_multi
		const tutorId = req.body.tutor_id ? req.body.tutor_id : null;

		const postFilterMulti = [];
		if (tutorId) {
			const tutorArray = tutorId.split('|');
			for (let i = 0; i < tutorArray.length; i += 1) postFilterMulti.push({ board_config_id: boardConfigId, post_filter_type: 'tutor', post_filter_id: tutorArray[i] });
		}

		// 게시물 수정처리
		await boardService.doModifyBoardPost(boardPost, postFilter, postFilterMulti, boardAttachedFile);
		// Return
		return res.json(null);
	}),
);

// 별별정보 게시물 수정
router.patch(
	'/info/:post_id',
	...boardValidator.patchInfoBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 5;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents };

		// post_filter
		const postFilter = {};
		if (req.body.info_category) postFilter.info_category = req.body.info_category;

		// 게시물 수정처리
		await boardService.doModifyBoardPost(boardPost, postFilter, [], boardAttachedFile);
		// Return
		return res.json(null);
	}),
);

// 적폐청산 게시물 수정
router.patch(
	'/report/:post_id',
	...boardValidator.patchReportBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 7;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents, link_url: req.body.link_url };

		// 게시물 수정처리
		await boardService.doModifyBoardPost(boardPost, {}, [], boardAttachedFile);
		// Return
		return res.json(null);
	}),
);

// 게시물 삭제
router.delete(
	'/:post_id/elimination',
	...boardValidator.deleteBoardPostElimination,
	wrapAsyncRouter(async (req, res) => {
		// 요청 변수 정리
		const boardPost = { id: req.params.post_id, is_deleted: 'Y' };

		// 게시물 삭제 처리
		await boardService.deleteBoardPost(boardPost);

		// Return
		return res.json(null);
	}),
);

// 게시물 추천
router.post(
	'/:post_id/like',
	...boardValidator.postBoardPostLike,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		const memberId = req.decodedToken.data.member.id;
		const createdIp = req.ipAddress;
		response = await boardService.processBoardPostCount(req.params.post_id, 'like', memberId, createdIp);

		// Return
		return res.json(response);
	}),
);

// 게시물 비추천
router.post(
	'/:post_id/dislike',
	...boardValidator.postBoardPostDislike,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		const memberId = req.decodedToken.data.member.id;
		const createdIp = req.ipAddress;
		response = await boardService.processBoardPostCount(req.params.post_id, 'dislike', memberId, createdIp);

		// Return
		return res.json(response);
	}),
);

// 게시물 댓글 목록 조회
router.get(
	'/:post_id/comment',
	...boardValidator.getBoardPostComments,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = { post_comment: { post_id: req.params.post_id, is_deleted: 'N' } };

		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 게시물 댓글 목록 조회
		const boardPostComments = await boardService.getBoardPostCommentBySearchFields(searchFields, offset, limit, loginMemberId);

		// Return
		return res.json(!boardPostComments ? null : { ...boardPostComments, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 게시물 댓글 등록
router.post(
	'/:post_id/comment',
	...boardValidator.postBoardPostComment,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;

		// post_comment
		const postComment = {
			post_id: req.params.post_id,
			parent_comment_id: req.body.parent_comment_id ? req.body.parent_comment_id : null,
			member_id: loginMemberId,
			nickname: req.body.nickname ? req.body.nickname : null,
			is_anonymous: req.body.is_anonymous ? req.body.is_anonymous : 'N',
			anonymous_email: '',
			is_secret: 'N',
			secret_password: '',
			created_ip: createdIp,
			is_deleted: 'N',
			blame_status: 'normal',
			content: req.body.content,
			like_count: 0,
			dislike_count: 0,
		};

		// 게시물 록
		response = await boardService.doRegisterBoardPostComment(postComment);

		// Return
		return res.json(response);
	}),
);

// 게시물 댓글 삭제
router.delete(
	'/comment/:post_comment_id',
	...boardValidator.deleteBoardPostComment,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		// 게시물 댓글 삭제
		await boardService.deleteBoardPostCommentById(req.params.post_comment_id, loginMemberId);
		// Return
		return res.json(null);
	}),
);

// 게시물 댓글 추천
router.post(
	'/comment/:post_comment_id/like',
	...boardValidator.postBoardPostCommentLike,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;
		response = await boardService.processBoardPostCommentCount(req.params.post_comment_id, 'like', memberId, createdIp);

		// Return
		return res.json(response);
	}),
);

// 게시물 댓글 비추천
router.post(
	'/comment/:post_comment_id/dislike',
	...boardValidator.postBoardPostCommentDislike,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;
		response = await boardService.processBoardPostCommentCount(req.params.post_comment_id, 'dislike', memberId, createdIp);

		// Return
		return res.json(response);
	}),
);

/** @description Lv0 페이지 별별정보 게시물 조회 */
router.get(
	'/main-page/info',
	...boardValidator.getMainPageInfoBoardPosts,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		let response = null;
		const boardType = 'info';

		// 검색 필터
		const searchFields = { board_post: { is_deleted: 'N', is_notice: 'N' } };

		response = await boardService.getMainPageBoardPostsByBoardType(boardType, searchFields, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description Lv0 페이지 강사자료 게시물 조회 */
router.get(
	'/main-page/resource',
	...boardValidator.getMainPageResourceBoardPosts,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		let response = null;
		const boardType = 'resource';

		// 검색 필터
		const searchFields = { board_post: { is_deleted: 'N', is_notice: 'N' } };

		response = await boardService.getMainPageBoardPostsByBoardType(boardType, searchFields, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description Lv0 페이지 Best 게시물 조회 */
router.get(
	'/main-page/best',
	...boardValidator.getMainPageBestBoardPosts,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		let response = null;
		const boardType = 'best';

		// 검색 필터
		const searchFields = { board_post: { is_deleted: 'N', is_notice: 'N' } };

		response = await boardService.getMainPageBoardPostsByBoardType(boardType, searchFields, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description Lv0 페이지 별별수다 게시물 조회 */
router.get(
	'/main-page/talk',
	...boardValidator.getMainPageTalkBoardPosts,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		let response = null;
		const boardType = 'talk';

		const searchFields = { board_post: { is_deleted: 'N', is_notice: 'N' } };

		response = await boardService.getMainPageBoardPostsByBoardType(boardType, searchFields, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description Lv1 페이지 게시물 조회 */
router.get(
	'/main-page',
	...boardValidator.getMainPageBoardPosts,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		let response = null;

		// 요청 변수 정리
		const filterId = req.query.filter_id;
		const boardType = req.query.board_type;
		const pageType = req.query.page_type;
		let order = 'last_at';

		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 비수능 별별수다 게시물
		if (pageType === 'non-csat' && boardType === 'talk') response = null;
		// 비수능 별별정보 게시물
		if (pageType === 'non-csat' && boardType === 'info') response = null;
		// 비수능 언론속의 선생님 게시물
		if (pageType === 'non-csat' && boardType === 'press') response = null;
		// 비수능 별별질문 게시물
		if (pageType === 'non-csat' && boardType === 'qna') order = null;
		// 비수능 강사 자료 게시물
		if (pageType === 'non-csat' && boardType === 'resource') response = null;

		// 수능 별별수다 게시물
		if (pageType === 'csat' && boardType === 'talk') response = null;
		// 수능 별별정보 게시물
		if (pageType === 'csat' && boardType === 'info') response = null;
		// 수능 언론속의 선생님 게시물
		if (pageType === 'csat' && boardType === 'press') response = null;
		// 수능 별별질문 게시물
		if (pageType === 'csat' && boardType === 'qna') order = null;
		// 수능 강사 자료 게시물
		if (pageType === 'csat' && boardType === 'resource') response = null;

		// 교수 별별수다 게시물
		if (pageType === 'professor' && boardType === 'talk') response = null;
		// 교수 별별정보 게시물
		if (pageType === 'professor' && boardType === 'info') response = null;

		// 유치원 별별수다 게시물
		if (pageType === 'kindergarten' && boardType === 'talk') response = null;
		// 유치원 별별정보 게시물
		if (pageType === 'kindergarten' && boardType === 'info') response = null;

		const searchFields = { filter_id: filterId, order };

		// 게시물 조회
		if (Object.keys(searchFields).length > 0) response = await boardService.getMainPageBoardPostsByBoardTypeAndSearchFields(pageType, boardType, loginMemberId, searchFields, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description 자유 게시판 게시글 작성 */
router.post(
	'/general',
	...boardValidator.postGeneralBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 11;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: null,
			is_deleted: 'N',
			is_notice: req.body.is_notice,
			is_secret: 'N',
			blame_status: 'NORMAL',
			allow_scroll: 'N',
			title: req.body.title,
			contents: req.body.contents,
			link_url: null,
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		const lv1Id = req.body.lv1_id;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id };

		// board_post_cafe
		const boardPostCafe = { cafe_id: req.body.cafe_id };

		// 게시물 작성처리
		const post = await boardService.doRegisterBoardPost(boardPost, postFilter, [], boardAttachedFile, boardPostCafe);
		// Return
		return res.json({ post });
	}),
);

/** @description 자유게시판 목록 조회 */
router.get(
	'/general',
	...boardValidator.getGeneralBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// board_post
		if (req.query.search_keyword) searchFields.board_post.search_keyword = req.query.search_keyword;

		// cafe
		const cafe = {};
		if (req.query.cafe_id) cafe.cafe_id = req.query.cafe_id;
		if (Object.keys(cafe).length > 0) searchFields.cafe = cafe;

		// 정렬 기준
		const common = {};
		if (req.query.order) common.order = req.query.order;
		if (Object.keys(common).length > 0) searchFields.common = common;

		const posts = await boardService.getGeneralBoardPosts(searchFields, offset, limit);

		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description 자유 게시글 상세 조회 */
router.get(
	'/general/:post_id',
	...boardValidator.getGeneralBoardPost,
	wrapAsyncRouter(async (req, res) => {
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;
		// 게시물 조회
		const post = await boardService.getBoardPostByIdAndType(req.params.post_id, 'general', memberId, createdIp);
		return res.json({ post });
	}),
);

/** @description 자유 게시글 삭제 */
router.delete(
	'/general/:post_id',
	...boardValidator.deleteGeneralBoardPost,
	wrapAsyncRouter(async (req, res) => {
		await boardService.deleteBoardPost({ id: req.params.post_id, is_deleted: 'Y' });
		// Return
		return res.json(null);
	}),
);

/** @description 자유 게시글 수정 */
router.patch(
	'/general/:post_id',
	...boardValidator.patchGeneralBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 11;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents, is_notice: req.body.is_notice };

		// cafe
		const boardPostCafe = { cafe_id: req.body.cafe_id };

		await boardService.doModifyBoardPost(boardPost, [], [], boardAttachedFile, boardPostCafe);

		return res.json(null);
	}),
);

/** @description 자료실 게시글 작성 */
router.post(
	'/resource',
	...boardValidator.postResourceBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 10;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = {
			board_config_id: boardConfigId,
			member_id: memberId,
			parent_post_id: null,
			is_deleted: 'N',
			is_notice: req.body.is_notice,
			is_secret: 'N',
			blame_status: 'NORMAL',
			allow_scroll: 'N',
			title: req.body.title,
			contents: req.body.contents,
			link_url: null,
			is_blank: 'N',
			comment_count: 0,
			read_count: 0,
			like_count: 0,
			dislike_count: 0,
			device_info: req.headers['user-agent'],
			created_ip: req.ipAddress,
		};

		// post_filter
		const lv1Id = req.body.lv1_id;
		const postFilter = { board_config_id: boardConfigId, lv1_id: lv1Id };

		// cafe
		const boardPostCafe = { cafe_id: req.body.cafe_id };

		// 게시물 작성처리
		const post = await boardService.doRegisterBoardPost(boardPost, postFilter, [], boardAttachedFile, boardPostCafe);
		// Return
		return res.json({ post });
	}),
);

/** @description 자료실 상세 조회 */
router.get(
	'/resource/:post_id',
	...boardValidator.getResourceBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		let memberId = null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const createdIp = req.ipAddress;
		const post = await boardService.getBoardPostByIdAndType(req.params.post_id, 'resource', memberId, createdIp);
		return res.json(!post ? null : { post });
	}),
);

/** @description 자료실 게시판 목록 조회 */
router.get(
	'/resource',
	...boardValidator.getResourceBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const isNotice = req.query.is_notice ? req.query.is_notice : 'N';
		const searchFields = { board_post: { is_notice: isNotice, is_deleted: 'N' } };

		// board_post
		if (req.query.search_keyword) searchFields.board_post.search_keyword = req.query.search_keyword;
		if (req.query.is_notice) searchFields.board_post.is_notice = req.query.is_notice;

		// cafe
		const cafe = {};
		if (req.query.cafe_id) cafe.cafe_id = req.query.cafe_id;
		if (Object.keys(cafe).length > 0) searchFields.cafe = cafe;

		// 정렬 기준
		const common = {};
		if (req.query.order) common.order = req.query.order;
		if (Object.keys(common).length > 0) searchFields.common = common;

		const posts = await boardService.getResourceBoardPosts(searchFields, offset, limit);

		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description 자료실 게시글 삭제 */
router.delete(
	'/resource/:post_id',
	...boardValidator.deleteResourceBoardPost,
	wrapAsyncRouter(async (req, res) => {
		await boardService.deleteBoardPost({ id: req.params.post_id, is_deleted: 'Y' });
		// Return
		return res.json(null);
	}),
);

/** @description 자료실 게시물 수정 */
router.patch(
	'/resource/:post_id',
	...boardValidator.patchResourceBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const boardConfigId = 11;
		const boardAttachedFile = req.body.board_attach_file ? JSON.parse(req.body.board_attach_file) : [];

		// 로그인한 회원 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// board_post
		const boardPost = { id: req.params.post_id, board_config_id: boardConfigId, member_id: memberId, title: req.body.title, contents: req.body.contents, is_notice: req.body.is_notice };

		// cafe
		const boardPostCafe = { cafe_id: req.body.cafe_id };

		await boardService.doModifyBoardPost(boardPost, [], [], boardAttachedFile, boardPostCafe);

		return res.json(null);
	}),
);

/** @description 강사 홈 강사 자료 best 게시물 조회 */
router.get(
	'/tutor-home/resource-best/:cafe_id',
	...boardValidator.getTutorHomeResourceBestBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		let searchFields = {};

		const boardPost = { is_deleted: 'N', is_secret: 'N', is_notice: 'N', board_config_id: 10 };
		const cafe = { cafe_id: req.params.cafe_id };
		searchFields = { board_post: boardPost, cafe };

		const posts = await boardService.getTutorHomeResourceBestBoardPost(searchFields, offset, limit);

		// Return
		return res.json(!posts ? null : posts);
	}),
);

/** @description 강사 자료 강사별 실시간 HOT 조회 */
router.get(
	'/tutor-resource/tutor-hot/:lv1_id',
	...boardValidator.getTutorResourceTutorHotBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : 3;
		const offset = await commonComponent.getOffset(page, limit);
		let searchFields = {};

		const boardPost = { is_deleted: 'N', is_secret: 'N', board_config_id: 10 };
		const postFilter = { lv1_id: req.params.lv1_id };
		const tutor = { is_confirm: 'Y' };
		searchFields = { board_post: boardPost, post_filter: postFilter, tutor };

		const posts = await boardService.getTutorResourceTutorHotBoardPost(searchFields, offset, limit);
		return res.json(!posts ? null : posts);
	}),
);

/** @description 강사 자료 자료별 실시간 HOT 조회 */
router.get(
	'/tutor-resource/post-hot/:lv1_id',
	...boardValidator.getTutorResourcePostHotBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : 3;
		const offset = await commonComponent.getOffset(page, limit);
		let searchFields = {};

		const boardPost = { is_deleted: 'N', is_secret: 'N', board_config_id: 10, is_notice: 'N' };
		const postFilter = { lv1_id: req.params.lv1_id };
		const tutor = { is_confirm: 'Y' };
		searchFields = { board_post: boardPost, post_filter: postFilter, tutor };

		const posts = await boardService.getTutorResourcePostHotBoardPost(searchFields, offset, limit);

		return res.json(!posts ? null : posts);
	}),
);

/** @description Lv1 필터 강사 자료 게시글 목록 조회 */
router.get(
	'/tutor-resource',
	...boardValidator.getTutorResourceBoardPosts,
	wrapAsyncRouter(async (req, res) => {
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const page = req.query.page ? req.query.page : 1;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = {};

		const postFilter = { lv1_id: req.query.lv1_id };
		if (Object.keys(postFilter).length > 0) searchFields.post_filter = postFilter;

		const common = { order: req.query.order };
		if (req.query.search_keyword) common.search_keyword = req.query.search_keyword;
		if (Object.keys(common).length > 0) searchFields.common = common;

		const posts = await boardService.getTutorResourceBoardPosts(searchFields, offset, limit);
		return res.json(!posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

export default router;
