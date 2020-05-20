import { sequelize } from '../../database';
import { throwError } from '..';

import * as filterService from '../filter/filter';
import * as memberService from '../member/member';
import * as tutorService from '../tutor/tutor';
import * as instituteService from '../institute/institute';
import * as commonComponent from '../../component/common';
import * as boardComponent from '../../component/board/board';
import * as boardExistComponent from '../../component/board/exist_board';
import * as boardPostComponent from '../../component/board/post_board';
import * as boardPatchComponent from '../../component/board/patch_board';
import * as boardDeleteComponent from '../../component/board/delete_board';
import * as cafeComponenet from '../../component/cafe/cafe';
import * as subjectComponent from '../../component/subject/subject';
import * as instituteComponent from '../../component/institute/institute';

// 게시물 인덱스 존재 여부 확인
export const isExistPostId = async (postId) => {
	const response = await boardExistComponent.isExistPostId(postId);
	return response;
};

// 게시물 댓글 인덱스 존재 여부 확인
export const isExistPostCommentId = async (postCommentId) => {
	const response = await boardExistComponent.isExistPostCommentId(postCommentId);
	return response;
};

// 게시판별 목록 검색 선택지 조회
export const getSearchConfig = async (boardType, filterId) => {
	const response = {};
	const siteFilter = await filterService.getSiteFilter();
	if (boardType === 'talk') {
		siteFilter.unshift({ id: 'talk', code: 'talk', name: '수다', sort_no: null });
		response.lv1_id = siteFilter;
		response.post_auth = [
			{ code: 'normal_post', name: '일반 게시물' },
			{ code: 'tutor_post', name: '강사 게시물' },
		];
		response.order = [
			{ code: 'last_at', name: '최신순' },
			{ code: 'view_count', name: '조회순' },
			{ code: 'recommend_count', name: '추천순' },
		];
	} else if (boardType === 'essay') {
		// 년도 추가
		if (['2', '7', '16', '20', '317', '353', '449', '462', '475', '313', '289', '294', '80', '85', '92', '132', '137'].includes(String(filterId)))
			response.year = [
				{ code: '2019', name: '2019' },
				{ code: '2018', name: '2018' },
				{ code: '2017', name: '2017' },
				{ code: '2016', name: '2016' },
				{ code: '2015', name: '2015 이전' },
			];

		// 과목 추가
		if (['2', '7', '16', '294', '80', '85', '92', '132'].includes(String(filterId))) response.subject_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'subject');
		// 수강유형 추가
		if (['20'].includes(String(filterId)))
			response.lecture_type = [
				{ code: 'offline', name: '실강' },
				{ code: 'online', name: '인강' },
				{ code: 'english_tel', name: '전화영어' },
			];
		// 급수 추가
		if (['317', '353'].includes(String(filterId))) response.gong_grade_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'grade');
		// 근무지역 추가
		if (['317', '353'].includes(String(filterId)))
			response.gong_local_region = [
				{ code: 'state', name: '국가직' },
				{ code: 'seoul', name: '서울직' },
				{ code: 'local', name: '지방직' },
			];
		// sub타입 추가
		if (['313'].includes(String(filterId))) response.sub_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'sub');
		// 자격증 추가
		if (['274'].includes(String(filterId))) response.certificate_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'certificate');
		// 직렬 추가
		if (['317', '353', '475'].includes(String(filterId))) {
			response.gong_serial_filter_search = await commonComponent.getSearchPageGongSerialFilter(filterId);
			response.gong_serial_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'serial');
		}
		// 성별 추가
		if (['449', '462'].includes(String(filterId)))
			response.sex = [
				{ code: 'man', name: '남자' },
				{ code: 'woman', name: '여자' },
			];
		// 직군 추가
		if (['475'].includes(String(filterId))) response.gong_speciality_part_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'speciality_part');
		// 초등/유아임용 하위구분 추가
		if (['289'].includes(String(filterId)))
			response.appointment_subtype = [
				{ code: 'element', name: '초등' },
				{ code: 'kindergarten', name: '유치원' },
				{ code: 'special_infant', name: '특수유아' },
				{ code: 'special_element', name: '특수초등' },
				{ code: 'librarian', name: '사서' },
				{ code: 'health', name: '보건' },
			];
		// 임용 지역 추가
		if (['289', '294'].includes(String(filterId)))
			response.appointment_local_region = [
				{ code: 'seoul', name: '서울' },
				{ code: 'gyeonggi', name: '경기' },
				{ code: 'incheon', name: '인천' },
				{ code: 'sejong', name: '세종' },
				{ code: 'daejeon', name: '대전' },
				{ code: 'daegu', name: '대구' },
				{ code: 'gwangju', name: '광주' },
				{ code: 'busan', name: '부산' },
				{ code: 'ulsan', name: '울산' },
				{ code: 'gangwon', name: '강원' },
				{ code: 'chungbuk', name: '충북' },
				{ code: 'chungnam', name: '충남' },
				{ code: 'gyeongbuk', name: '경북' },
				{ code: 'gyeongnam', name: '경남' },
				{ code: 'jeonbuk', name: '전북' },
				{ code: 'jeonnam', name: '전남' },
				{ code: 'jeju', name: '제주' },
			];
		// 학교 추가
		if (['137'].includes(String(filterId))) response.transfer_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'transfer');
	} else if (boardType === 'qna') {
		response.lv1_id = siteFilter;
		response.answer_status = [
			{ code: 'pause', name: '답변대기' },
			{ code: 'completion', name: '답변완료' },
		];
		response.order = [
			{ code: 'last_at', name: '최신순' },
			{ code: 'view_count', name: '조회순' },
			{ code: 'recommend_count', name: '추천순' },
			{ code: 'comment_count', name: '답변순' },
		];
	} else if (boardType === 'info') {
		response.lv1_id = siteFilter;
		response.info_category = [
			{ code: 'basic', name: '기본정보' },
			{ code: 'tip', name: '꿀팁' },
			{ code: 'news', name: '뉴스' },
		];
		response.order = [
			{ code: 'last_at', name: '최신순' },
			{ code: 'view_count', name: '조회순' },
			{ code: 'recommend_count', name: '추천순' },
		];
	} else if (boardType === 'exam') {
		/**
		 * 시험영어 ( filter_id: 2, code: 00000000 ) - 과목
		 */
		if (['2', '7', '16', '317', '353', '449', '475'].includes(String(filterId))) {
			// 과목 추가
			response.subject_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'subject');
			// 직급 추가 && 소속 지역 추가
			if (['317', '353'].includes(String(filterId))) {
				response.gong_grade_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'grade');
				response.gong_local_region = [
					{ code: 'state', name: '국가직' },
					{ code: 'seoul', name: '서울직' },
					{ code: 'local', name: '지방직' },
				];
			}
			// 년도 추가
			if (['317', '353', '449', '475'].includes(String(filterId)))
				response.year = [
					{ code: '2019', name: '2019' },
					{ code: '2018', name: '2018' },
					{ code: '2017', name: '2017' },
					{ code: '2016', name: '2016' },
					{ code: '2015', name: '2015 이전' },
				];
			// 직군 추가
			if (['475'].includes(String(filterId))) response.gong_speciality_part_filter = await filterService.getTypeFilterByFilterIdAndType(filterId, 'speciality_part');
		}
	} else if (boardType === 'faq') {
		response.faq_category = [
			{ code: 'starteacher', name: '별별선생' },
			{ code: 'member', name: '회원' },
			{ code: 'service', name: '서비스' },
		];
	} else if (boardType === 'event') {
		response.event_status = [
			{ code: '1', name: '진행중' },
			{ code: '2', name: '당첨자 발표' },
			{ code: '3', name: '종료' },
		];
	} else if (boardType === 'press' || boardType === 'report') {
		// eslint-disable-line
	} else if (boardType === 'resource') {
		response.order = [
			{ code: 'last_at', name: '최신순' },
			{ code: 'view_count', name: '조회순' },
			{ code: 'recommend_count', name: '추천순' },
			{ code: 'comment_count', name: '댓글순' },
			{ code: 'download_count', name: '첨부파일 다운로드순' },
		];
	} else if (boardType === 'general') {
		response.order = [
			{ code: 'last_at', name: '최신순' },
			{ code: 'view_count', name: '조회순' },
			{ code: 'recommend_count', name: '추천순' },
			{ code: 'comment_count', name: '댓글순' },
		];
	}

	return Object.keys(response).length > 0 ? response : null;
};

// 언론속의 선생님 & 언론속의 학원 & 학교소식 목록 조회
export const getPressBoardPosts = async (target, targetId, offset = 0, limit = 5) => {
	let posts = null;
	if (target === 'tutor') {
		posts = await boardComponent.getTutorPressBoardPosts(targetId, offset, limit);
	} else if (target === 'institute') {
		posts = await boardComponent.getInstitutePressBoardPosts(targetId, offset, limit);
	} else {
		throwError("Invalid 'taget'.", 400);
	}
	// Return
	return posts;
};

// 별별수다 목록 조회
export const getTalkBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getTalkBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].id); // eslint-disable-line
			posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 합격수기 목록 조회
export const getEssayBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getEssayBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 별별Best 목록 조회
export const getBestBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getBestBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].id); // eslint-disable-line
			posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 주간Best 목록 조회
export const getWeeklyBestBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getBestBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].id); // eslint-disable-line
			posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 별별질문 / Q&A 목록 조회
export const getQnaBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getQnaBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 별별정보 목록 조회
export const getInfoBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getInfoBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 기출문제 목록 조회
export const getExamBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getExamBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 적폐청산 목록 조회
export const getReportBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getReportBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// FAQ 목록 조회
export const getFaqBoardPosts = async (faqCategory, offset = 0, limit = 10) => {
	const posts = await boardComponent.getFaqBoardPosts(faqCategory, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

// 이벤트 목록 조회
export const getEventBoardPosts = async (eventStatus, offset = 0, limit = 10) => {
	const posts = await boardComponent.getEventBoardPosts(eventStatus, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			let replyPostCount = null;
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 답글 갯수 조회
			replyPostCount = await boardComponent.getReplyBoardPostCountByBoardPostId(postList[i].dataValues.id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			posts.list[i].dataValues.reply_post_count = parseInt(replyPostCount || 0, 10);
		}
	}
	// Return
	return posts;
};

/**
 * @description 카페 권한 확인
 * @param {Int} memberId
 * @param {Int} cafeId
 */
export const cafeBoardPostAuth = async (memberId, cafeId) => {
	const cafeData = await cafeComponenet.getCafeById(cafeId);
	let boardPageAuth = null;
	let boardFollowAuth = null;
	let targetId = null;
	switch (cafeData.type) {
		case 'tutor':
			targetId = await tutorService.getTutorIdByCafeId(cafeData.id);
			boardPageAuth = await tutorService.isExistTutorMember(targetId.tutor_id, memberId);
			boardFollowAuth = await memberService.isExistMemberFollowTutor(targetId.tutor_id, memberId);
			break;
		case 'institute':
			targetId = await instituteService.getInstituteIdByCafeId(cafeData.id);
			boardPageAuth = await instituteService.isExistInstituteMember(targetId.institute_id, memberId);
			boardFollowAuth = await memberService.isExistMemberFollowInstitute(targetId.institute_id, memberId);
			break;
		default:
			throwError('Invalid cafe type.', 400);
			break;
	}

	return { board_page_auth: boardPageAuth, board_follow_auth: boardFollowAuth };
};

/**
 * @description 게시물 작성처리
 * @param {Array} boardPostParam
 * @param {Array} postFilterParam
 * @param {Array} postFilterMultiParam
 * @param {Array} boardAttachedFileParam
 * @param {Array} boardPostCafeParam
 */
export const doRegisterBoardPost = async (boardPostParam, postFilterParam, postFilterMultiParam, boardAttachedFileParam, boardPostCafeParam) => {
	let response = null;

	const boardPost = boardPostParam;
	const postFilter = postFilterParam;
	const postFilterMulti = postFilterMultiParam;
	const boardAttachedFile = boardAttachedFileParam;

	if (Object.keys(boardPostCafeParam).length > 0) {
		const boardPostCafeAuth = await cafeBoardPostAuth(boardPost.member_id, boardPostCafeParam.cafe_id);
		if (!boardPostCafeAuth.board_page_auth) {
			if (!boardPostCafeAuth.board_follow_auth) throwError('Invalid post write auth.', 400);
			boardPost.is_notice = 'N';
		}
	}

	await sequelize.transaction(async (t) => {
		// root 게시물의 경우
		if (boardPost.parent_post_id == null) {
			const depthOneLastSortPost = await boardComponent.getBoardPostDepthOneLastSort();
			boardPost.group_id = null;
			boardPost.sort_no = depthOneLastSortPost ? parseInt(depthOneLastSortPost.dataValues.sort_no, 10) + parseInt(1, 10) : parseInt(1, 10);
			boardPost.depth = 1;
		} else {
			const parentPost = await boardComponent.getBoardPostByBoardPostId(boardPost.parent_post_id);
			if (!parentPost) throwError("Invalid 'parent_post_id'.", 400);
			boardPost.group_id = parentPost.dataValues.group_id ? parentPost.dataValues.group_id : parentPost.dataValues.id;
			boardPost.sort_no = parseInt(parentPost.dataValues.sort_no, 10) + parseInt(1, 10);
			boardPost.depth = parseInt(parentPost.dataValues.depth, 10) + parseInt(1, 10);
			boardPost.is_secret = parentPost.dataValues.is_secret;
			const groupCount = await boardComponent.getBoardPostGroupCountByGroupId(parentPost.dataValues.group_id ? parentPost.dataValues.group_id : parentPost.dataValues.id);
			if (groupCount > 1)
				await boardPatchComponent.updateBoardPostSortNo(parentPost.dataValues.group_id ? parentPost.dataValues.group_id : parentPost.dataValues.id, parentPost.dataValues.sort_no);
		}

		// 첨부파일 처리
		let attachedFileCount = 0;
		let contentFileCount = 0;
		let thumbnailFileCount = 0;
		if (Object.keys(boardAttachedFile).length > 0) {
			const tmpBoardAttachedFile = boardAttachedFile.map((boardAttachedFile) => boardAttachedFile.file_type);
			for (let i = 0; i < tmpBoardAttachedFile.length; i += 1) {
				attachedFileCount = tmpBoardAttachedFile[i] === 'attache' ? parseInt(attachedFileCount, 10) + parseInt(1, 10) : parseInt(attachedFileCount, 10);
				contentFileCount = tmpBoardAttachedFile[i] === 'content' ? parseInt(contentFileCount, 10) + parseInt(1, 10) : parseInt(contentFileCount, 10);
				thumbnailFileCount = tmpBoardAttachedFile[i] === 'thumbnail' ? parseInt(thumbnailFileCount, 10) + parseInt(1, 10) : parseInt(thumbnailFileCount, 10);
			}
		}

		// 게시물 작성 처리
		boardPost.attached_file_count = attachedFileCount;
		boardPost.content_file_count = contentFileCount;
		boardPost.thumbnail_file_count = thumbnailFileCount;
		const boardPostData = await boardPostComponent.addBoardPost(boardPost, false, t);

		// 게시물 필터 추가
		if (postFilter) {
			postFilter.post_id = boardPostData.dataValues.id;
			postFilter.lv05_id = postFilter.lv1_id ? await filterService.getLv05FilterIdByFilterId(postFilter.lv1_id) : null;
			await boardPostComponent.addPostFilter(postFilter, false, t);
		}

		// 게시물 멀티 필터 추가
		if (Object.keys(postFilterMulti).length > 0) {
			for (let i = 0; i < postFilterMulti.length; i += 1) {
				postFilterMulti[i].post_id = boardPostData.dataValues.id;
				await boardPostComponent.addPostFilterMulti(postFilterMulti[i], false, t); // eslint-disable-line
			}
		}

		// 게시물 첨부파일 추가
		if (Object.keys(boardAttachedFile).length > 0) {
			for (let i = 0; i < boardAttachedFile.length; i += 1) {
				boardAttachedFile[i].post_id = boardPostData.dataValues.id;
				await boardPostComponent.addPostFile(boardAttachedFile[i], false, t); // eslint-disable-line
			}
		}

		// 카페 게시물 추가
		if (Object.keys(boardPostCafeParam).length > 0) {
			const boardPostCafe = boardPostCafeParam;
			boardPostCafe.board_post_id = boardPostData.dataValues.id;
			boardPostData.cafe = await boardPostComponent.addCafePost(boardPostCafe, t);
		}

		// bull 추가 예정
		/*
		// 게시물 검색 추가
		await boardPostComponent.addPostSearchSource(boardPostData, postFilter, false, t);
		*/

		// 별별질문 및 적폐청산에서 기존 게시물이 존재 하는 경우 원글 상태 변경
		if ([4, 7].includes(boardPost.board_config_id) && boardPost.parent_post_id) await boardPatchComponent.patchPostFilter({ post_id: boardPost.parent_post_id, answer_status: 'completion' }, t);

		response = boardPostData;
	});

	// root 게시물 정보 업데이트 처리
	if (boardPost.parent_post_id == null) await boardPatchComponent.updateBoardPostByBoardPostId({ id: response.dataValues.id, group_id: response.dataValues.id });

	return response;
};

/**
 * @description 게시물 수정 처리
 * @param {Array} boardPostParam
 * @param {Array} postFilterParam
 * @param {Array} postFilterMultiParam
 * @param {Array} boardAttachedFileParam
 * @param {Array} boardPostCafeParam
 */
export const doModifyBoardPost = async (boardPostParam, postFilterParam, postFilterMultiParam, boardAttachedFileParam, boardPostCafeParam) => {
	let response = null;
	let boardPost = boardPostParam;
	const postFilter = postFilterParam;
	const postFilterMulti = postFilterMultiParam;
	const boardAttachedFile = boardAttachedFileParam;

	// 페이지 주인인지 검사
	if (boardPostCafeParam) {
		const boardPostCafeAuth = await cafeBoardPostAuth(boardPost.member_id, boardPostCafeParam.cafe_id);
		if (!boardPostCafeAuth.board_page_auth) boardPost.is_notice = 'N';
	}

	// 게시물 수정 작업
	await sequelize.transaction(async (t) => {
		// 첨부파일 처리
		let attachedFileCount = 0;
		let contentFileCount = 0;
		let thumbnailFileCount = 0;
		const attachedFile = [];
		const deleteFileIds = await boardComponent.getBoardPostFileIdsByPostId(boardPost.id);
		if (Object.keys(boardAttachedFile).length > 0) {
			const tmpBoardAttachedFile = boardAttachedFile.map((boardAttachedFile) => boardAttachedFile.file_type);
			for (let i = 0; i < tmpBoardAttachedFile.length; i += 1) {
				attachedFileCount = tmpBoardAttachedFile[i] === 'attache' ? parseInt(attachedFileCount, 10) + parseInt(1, 10) : parseInt(attachedFileCount, 10);
				contentFileCount = tmpBoardAttachedFile[i] === 'content' ? parseInt(contentFileCount, 10) + parseInt(1, 10) : parseInt(contentFileCount, 10);
				thumbnailFileCount = tmpBoardAttachedFile[i] === 'thumbnail' ? parseInt(thumbnailFileCount, 10) + parseInt(1, 10) : parseInt(thumbnailFileCount, 10);
				const arrayIdx = deleteFileIds.indexOf(boardAttachedFile[i].id);
				if (arrayIdx > -1) deleteFileIds.splice(arrayIdx, 1);
				if (boardAttachedFile[i].id == null) attachedFile.push(boardAttachedFile[i]);
			}
		}
		// 게시물 수정 처리
		boardPost = { ...boardPost, attached_file_count: attachedFileCount, content_file_count: contentFileCount, thumbnail_file_count: thumbnailFileCount };
		const boardPostData = await boardPatchComponent.patchBoardPost(boardPost, t);

		// 게시물 필터 처리
		if (postFilter) await boardPatchComponent.patchPostFilter({ ...postFilter, post_id: boardPost.id }, t);

		// 게시물 멀티 필터 처리
		if (Object.keys(postFilterMulti).length > 0) {
			await boardDeleteComponent.deletePostFilterMultiByPostId(boardPost.id, t);
			for (let i = 0; i < postFilterMulti.length; i += 1) await boardPostComponent.addPostFilterMulti({ ...postFilterMulti[i], post_id: boardPost.id }, false, t); // eslint-disable-line
		}
		// 게시물 첨부파일 삭제처리
		if (Object.keys(deleteFileIds).length > 0) {
			for (let i = 0; i < deleteFileIds.length; i += 1) await boardDeleteComponent.deletePostFile(deleteFileIds[i], t); // eslint-disable-line
		}
		// 게시물 첨부파일 추가처리
		if (Object.keys(attachedFile).length > 0) {
			for (let i = 0; i < attachedFile.length; i += 1) await boardPostComponent.addPostFile({ ...attachedFile[i], post_id: boardPost.id }, false, t); // eslint-disable-line
		}

		if (Object.keys(boardPostData).length > 0) response = boardPostData;
	});

	return response;
};

/**
 * @description 게시물 삭제 처리
 * @param {Array} boardPost
 */
export const deleteBoardPost = async (boardPost) => {
	await sequelize.transaction(async (t) => {
		// 게시물 상태 변경
		await boardPatchComponent.updateBoardPostByBoardPostId(boardPost, t);
		// 게시물 답글 상태 변경
		await boardPatchComponent.updateBoardPostByBoardParentPostId({ parent_post_id: boardPost.id, is_deleted: 'Y' }, t);
		// 게시물 댓글 상태 변경
		await boardPatchComponent.updatePostCommentByPostId({ post_id: boardPost.id, is_deleted: 'Y' }, t);

		// bull 추가 예정
		/*
		//게시물 검색 소스 상태 변경(삭제만)
		await boardPatchComponent.updatePostSearchSource({ post_id: boardPost.id, is_deleted: 'Y' }, t);
		*/
	});
	return null;
};

// 게시물 추천 & 비추천 프로세스
export const processBoardPostCount = async (postId, type, memberId, createdIp) => {
	let response = null;
	// 이전에 추천 & 비추천 게시물이 있는지를 확인
	const isLike = await boardExistComponent.isExistBoardPostCount(postId, type, memberId);

	await sequelize.transaction(async (t) => {
		// 이전 게시물이 있는 경우
		if (isLike) {
			// validation
			if ((isLike.dataValues.post_count_log_type === 'like' && type === 'dislike') || (isLike.dataValues.post_count_log_type === 'dislike' && type === 'like'))
				throwError('Previous request exists', 400);

			// 게시물 추천 & 비추천 취소 처리
			await boardComponent.deleteBoardPostCount(postId, type, memberId, t);

			// 게시물 카운트 감소
			if (type === 'like') await boardComponent.postMinusBoardPostLike(postId, t);
			if (type === 'dislike') await boardComponent.postMinusBoardPostDislike(postId, t);
		} else {
			// 게시물 추천 & 비추천
			response = await boardPostComponent.postBoardPostCount({ post_id: postId, member_id: memberId, post_count_log_type: type, created_ip: createdIp }, false, t);

			// 게시물 카운트 증가
			if (type === 'like') await boardPostComponent.postPlusBoardPostLike(postId, t);
			if (type === 'dislike') await boardPostComponent.postPlusBoardPostDislike(postId, t);
		}
	});

	// Return
	return response;
};

// 게시물 댓글 목록 조회
export const getBoardPostCommentBySearchFields = async (searchFields, offset = 0, limit = 10, loginMemberId) => {
	const comments = await boardComponent.getBoardPostCommentBySearchFields(searchFields, offset, limit);

	if (comments) {
		const commentList = comments.list;
		let isLike = false;
		let isDislike = false;
		for (let i = 0; i < commentList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			if (loginMemberId) {
				isLike = await boardComponent.isExistBoardPostCommentLike(commentList[i].id, loginMemberId); // eslint-disable-line
				isDislike = await boardComponent.isExistBoardPostCommentDislike(commentList[i].id, loginMemberId); // eslint-disable-line
			}
			// 강사 회원의 경우 강사 회원 정보 조회
			if (commentList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(commentList[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (commentList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(commentList[i].member_id); // eslint-disable-line
			let parentComment = null;
			// 상위 댓글 여부에 따른 상위 댓글 정보
			if (commentList[i].id != commentList[i].group_id) parentComment = await boardComponent.getBoardPostCommentByBoardPostCommentId(commentList[i].group_id); // eslint-disable-line
			if (parentComment) {
				let member = null;
				if (parentComment.dataValues.member_id) {
					member = await memberService.getMemberInfoById(parentComment.dataValues.member_id); // eslint-disable-line
					delete member.dataValues.id;
					delete member.dataValues.access;
					delete member.dataValues.term;
					delete member.dataValues.external;
					delete member.dataValues.relation_tutor;
					delete member.dataValues.relation_institute;
					delete member.dataValues.review_read_auth;
				}
				parentComment.dataValues.member = member;
			}

			commentList[i].is_like = isLike;
			commentList[i].is_dislike = isDislike;
			commentList[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			commentList[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			commentList[i].parent_comment = parentComment;
		}
	}

	// Return
	return comments;
};

// 게시물 댓글 등록
export const doRegisterBoardPostComment = async (postCommentParam) => {
	let response = null;
	const postComment = postCommentParam;

	await sequelize.transaction(async (t) => {
		// root 댓글의 경우
		if (postComment.parent_comment_id == null) {
			const depthOneLastSortComment = await boardComponent.getBoardPostCommentDepthOneLastSortNoByPostId(postComment.post_id);
			postComment.group_id = null;
			postComment.sort_no = depthOneLastSortComment ? parseInt(depthOneLastSortComment.dataValues.sort_no, 10) + parseInt(1, 10) : parseInt(1, 10);
			postComment.depth = 1;
		} else {
			const parentComment = await boardComponent.getBoardPostCommentByBoardPostCommentId(postComment.parent_comment_id);
			if (!parentComment) throwError("Invalid 'parent_comment_id'.", 400);
			if (parentComment.dataValues.depth === parseInt(2, 10)) {
				// 3depth 댓글
				postComment.group_id = parentComment.dataValues.group_id ? parentComment.dataValues.group_id : parentComment.dataValues.id;
				postComment.parent_comment_id = parentComment.dataValues.id;
				postComment.sort_no = parseInt(parentComment.dataValues.sort_no, 10) + parseInt(1, 10);
				postComment.depth = parseInt(parentComment.dataValues.depth, 10) + parseInt(1, 10);
			} else {
				// 2depth 댓글
				postComment.group_id = parentComment.dataValues.group_id ? parentComment.dataValues.group_id : parentComment.dataValues.id;
				postComment.sort_no = parseInt(parentComment.dataValues.sort_no, 10) + parseInt(1, 10);
				postComment.depth = parseInt(parentComment.dataValues.depth, 10) + parseInt(1, 10);
			}
			const groupCount = await boardComponent.getPostCommentGroupCountByGroupId(parentComment.dataValues.group_id ? parentComment.dataValues.group_id : parentComment.dataValues.id);
			if (groupCount > 1)
				await boardPatchComponent.updateBoardPostCommentSortNo(
					parentComment.dataValues.group_id ? parentComment.dataValues.group_id : parentComment.dataValues.id,
					parentComment.dataValues.sort_no,
				);
		}

		// 게시물에 대한 댓글 등록
		const postCommentData = await boardPostComponent.addBoardPostComment(postComment, false, t);

		// 게시물 댓글 수 증가
		await boardPostComponent.postPlusBoardPostCommentCount(postComment.post_id, t);

		response = postCommentData;
	});

	// root 댓글 정보 업데이트 처리
	if (postComment.parent_comment_id == null) await boardPatchComponent.updatePostCommentById({ id: response.dataValues.id, group_id: response.dataValues.id });

	// Return
	return response;
};

// 게시물 댓글 삭제
export const deleteBoardPostCommentById = async (postCommentId, loginMemberId) => {
	await sequelize.transaction(async (t) => {
		// postCommentId 로 게시물 댓글 조회
		const postComment = await boardComponent.getBoardPostCommentByBoardPostCommentId(postCommentId);

		if (postComment.dataValues.is_deleted === 'N') {
			// 게시물 댓글 삭제
			await boardDeleteComponent.deleteBoardPostCommentById(postCommentId, loginMemberId);

			const post = await boardComponent.getBoardPostByBoardPostId(postComment.dataValues.post_id);
			// 게시물 댓글 수 감소
			if (post && post.dataValues.comment_count > 0) await boardComponent.postMinusBoardPostCommentCount(postComment.dataValues.post_id, t);
		}
	});
	// Return
	return null;
};

// 게시물 댓글 추천 & 비추천 프로세스
export const processBoardPostCommentCount = async (postCommentId, type, memberId, createdIp) => {
	let response = null;
	// 이전에 추천 & 비추천 게시물 댓글이 있는지를 확인
	const isLike = await boardExistComponent.isExistBoardPostCommentCount(postCommentId, memberId);

	await sequelize.transaction(async (t) => {
		// 이전 게시물 댓글이 있는 경우
		if (isLike) {
			// validation
			if ((isLike.dataValues.type === 'dislike' && type === 'like') || (isLike.dataValues.type === 'like' && type === 'dislike')) throwError('Previous request exists', 400);

			// 게시물 댓글 추천 & 비추천 취소 처리
			await boardDeleteComponent.deleteBoardPostCommentCountLog({ comment_id: postCommentId, post_comment_count_log_type: type, member_id: memberId }, t);

			// 게시물 댓글 카운트 감소
			if (type === 'like') await boardPostComponent.postMinusBoardPostCommentLike(postCommentId, t);
			if (type === 'dislike') await boardComponent.postMinusBoardPostCommentDislike(postCommentId, t);
		} else {
			// 게시물 댓글 추천 & 비추천
			response = await boardPostComponent.postBoardPostCommentCountLog({ comment_id: postCommentId, member_id: memberId, post_comment_count_log_type: type, created_ip: createdIp }, false, t);

			// 게시물 댓글 카운트 증가
			if (type === 'like') await boardPostComponent.postPlusBoardPostCommentLike(postCommentId, t);
			if (type === 'dislike') await boardPostComponent.postPlusBoardPostCommentDislike(postCommentId, t);
		}
	});

	// Return
	return response;
};

// 게시물 조회수 증가
export const addBoardPostViewCount = async (postId, memberId = null, createdIp) => {
	await sequelize.transaction(async (t) => {
		// 게시물 조회수 증가
		await boardComponent.postPlusBoardPostReadCount(postId, t);
		// 게시물 조회 로그 작성
		await boardPostComponent.postBoardPostCount({ post_id: postId, member_id: memberId, post_count_log_type: 'view', created_ip: createdIp }, false, t);
	});
};

/**
 * @description 게시물 Id 와 타입에 따른 게시물 조회
 * @param {Int} postId
 * @param {String} postType
 * @param {Int} memberId
 * @param {String} createdIp
 */
export const getBoardPostByIdAndType = async (postId, postType, memberId = null, createdIp) => {
	let post = null;

	switch (postType) {
		case 'talk':
			post = await boardComponent.getTalkBoardPostById(postId);
			break;
		case 'essay':
			post = await boardComponent.getEssayBoardPostById(postId);
			break;
		case 'qna':
			post = await boardComponent.getQnaBoardPostById(postId);
			break;
		case 'info':
			post = await boardComponent.getInfoBoardPostById(postId);
			break;
		case 'exam':
			post = await boardComponent.getExamBoardPostById(postId);
			break;
		case 'report':
			post = await boardComponent.getReportBoardPostById(postId);
			break;
		case 'event':
			post = await boardComponent.getEventBoardPostById(postId);
			break;
		case 'general':
			post = await boardComponent.getGeneralBoardPostById(postId);
			break;
		case 'resource':
			post = await boardComponent.getResourceBoardPostById(postId);
			break;
		default:
			throwError("Invalid 'post_type'.", 400);
			break;
	}

	if (post) {
		let isLike = false;
		let isDislike = false;
		let relationTutor = [];
		let relationInstitute = [];
		let downloadCount = 0;

		if (memberId) {
			isLike = await boardComponent.isExistBoardPostLike(post.dataValues.id, memberId);
			isDislike = await boardComponent.isExistBoardPostDislike(post.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회z
		if (post.dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(post.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (post.dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(post.dataValues.member_id);
		post.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		post.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		post.dataValues.is_like = isLike;
		post.dataValues.is_dislike = isDislike;
		// 조회수 증가
		await addBoardPostViewCount(post.dataValues.id, memberId, createdIp);

		if (postType === 'qna' || postType === 'report') {
			// parent_post_id 로 게시물 답글 목록 조회
			const replyPost = await boardComponent.getReplyBoardPostByParentBoardPostId(postId);
			let isRelationAdmin = false;
			let isRelationTutor = false;
			for (let i = 0; i < replyPost.length; i += 1) {
				let replyRelationTutor = [];
				let replyRelationInstitute = [];
				isRelationAdmin = await memberService.isExistRelationAdmin(replyPost[i].dataValues.member_id); // eslint-disable-line
				const tutorIds = await tutorService.getTutorIdsByMemberId(replyPost[i].dataValues.member_id); // eslint-disable-line
				isRelationTutor = await boardComponent.isExistRelationTutor(replyPost[i].dataValues.parent_post_id, tutorIds); // eslint-disable-line
				// 강사 회원의 경우 강사 회원 정보 조회
				if (replyPost[i].dataValues.member.dataValues.join_type === 'tutor') replyRelationTutor = await tutorService.getMemberRelationTutorByMemberId(replyPost[i].dataValues.member_id); // eslint-disable-line
				// 기관 회원의 경우 기관 회원 정보 조회
				if (replyPost[i].dataValues.member.dataValues.join_type === 'institute')
					replyRelationInstitute = await instituteService.getMemberRelationInstituteByMemberId(replyPost[i].dataValues.member_id); // eslint-disable-line
				replyPost[i].dataValues.is_relation_admin = isRelationAdmin;
				replyPost[i].dataValues.is_relation_tutor = isRelationTutor;
				replyPost[i].dataValues.member.dataValues.relation_tutor = Object.keys(replyRelationTutor).length > 0 ? replyRelationTutor : null;
				replyPost[i].dataValues.member.dataValues.relation_institute = Object.keys(replyRelationInstitute).length > 0 ? replyRelationInstitute : null;
			}
			post.dataValues.reply_post = Object.keys(replyPost).length > 0 ? replyPost : null;
		}

		let postFile = null;
		if (post.dataValues.attached_file_count || post.dataValues.content_file_count || post.dataValues.thumbnail_file_count) {
			postFile = await boardComponent.getPostFilesByPostId(post.dataValues.id);
			for (let i = 0; i < postFile.length; i += 1) downloadCount = parseInt(downloadCount, 10) + parseInt(postFile[i].dataValues.download_count, 10);
		}
		post.dataValues.post_file = postFile;
		post.dataValues.total_download_count = downloadCount;
	}

	// Return
	return post;
};

// Lv1_Id 와 강사 인덱스로 합격수기 & 수험후기 목록 조회
export const getEssayBoardPostByLv1IdAndTutorId = async (lv1Id, tutorId, offset = 0, limit = 10) => {
	const posts = await boardComponent.getEssayBoardPostByLv1IdAndTutorIds(lv1Id, [tutorId], offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	// Return
	return posts;
};

// Lv1_Id 와 기관 인덱스로 합격수기 & 수험후기 목록 조회
export const getEssayBoardPostByLv1IdAndInstituteId = async (lv1Id, instituteId, offset = 0, limit = 10) => {
	const tutorIds = await tutorService.getTutorIdsByFilterIdAndInstituteId(lv1Id, instituteId);
	const posts = await boardComponent.getEssayBoardPostByLv1IdAndTutorIds(lv1Id, tutorIds, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	// Return
	return posts;
};

// 게시물 첨부파일 존재여부 확인
export const isExistPostFile = async (postFileId) => {
	return boardComponent.isExistPostFile(postFileId);
};

// 게시물 첨부파일 다운로드 로그 존재여부 확인
export const getPostFileLog = async (postFileId, memberId, postFileCountLogType) => {
	return boardComponent.getPostFileLog(postFileId, memberId, postFileCountLogType);
};

// 게시물 첨부파일 다운로드 로그 수정
export const updatePostFileLog = async (postFileCountLog, t) => {
	return boardComponent.updatePostFileLog(postFileCountLog, t);
};

/**
 * @description Lv0 페이지 게시판 타입에 따른 게시물 조회
 * @param {String} boardType
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getMainPageBoardPostsByBoardType = async (boardType, searchFields, offset = 0, limit = 10) => {
	let posts = null;

	switch (boardType) {
		case 'info':
			posts = await boardComponent.getInfoBoardPosts(searchFields, offset, limit);
			break;
		case 'resource':
			posts = await boardComponent.getResourceBoardPosts(searchFields, offset, limit);
			break;
		case 'talk':
			posts = await boardComponent.getTalkBoardPosts(searchFields, offset, limit);
			break;
		case 'best':
			posts = await boardComponent.getBestBoardPosts(searchFields, offset, limit);
			break;
		default:
			throwError("Invalid 'board_type'.", 400);
			break;
	}

	if (posts) {
		const postList = posts.list;
		let lv1Filter = [];
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			if (boardType === 'info') {
				// 강사 회원의 경우 강사 회원 정보 조회
				if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
				// 기관 회원의 경우 기관 회원 정보 조회
				if (postList[i].dataValues.member.dataValues.join_type === 'instiute')
					relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
				// lv1 필터 인덱스가 있는 경우 Lv1 필터 정보 조회
				if (postList[i].dataValues.post_filter.lv1_id) lv1Filter = await filterService.getFilterById(postList[i].dataValues.post_filter.lv1_id); // eslint-disable-line
				posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
				posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
				posts.list[i].dataValues.post_filter.dataValues.lv1_filter = Object.keys(lv1Filter).length > 0 ? lv1Filter : null;
			} else if (boardType === 'talk' || boardType === 'resource' || boardType === 'best') {
				// 강사 회원의 경우 강사 회원 정보 조회
				if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
				// 기관 회원의 경우 기관 회원 정보 조회
				if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
				// lv1 필터 인덱스가 있는 경우 Lv1 필터 정보 조회
				if (postList[i].post_filter.lv1_id) lv1Filter = await filterService.getFilterById(postList[i].post_filter.lv1_id); // eslint-disable-line
				posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
				posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
				posts.list[i].post_filter.lv1_filter = Object.keys(lv1Filter).length > 0 ? lv1Filter : null;
			}
		}
	}
	// Return
	return posts;
};

// 검색 필터에 따른 메인페이지 게시물 조회
export const getMainPageBoardPostsByBoardTypeAndSearchFields = async (pageType, boardType, loginMemberId, searchFields = [], offset = 0, limit = 10) => {
	let response = null;
	let posts = null;

	switch (boardType) {
		// 별별수다
		case 'talk':
			// 수능 & 비수능 & 교수 & 유치원 페이지
			if (['non-csat', 'csat', 'professor', 'kindergarten'].includes(String(pageType))) posts = await boardComponent.getMainPageTalkBoardPostsBySearchFields(searchFields, offset, limit);
			break;
		// 별별정보
		case 'info':
			// 수능 & 비수능 & 교수 & 유치원 페이지
			if (['non-csat', 'csat', 'professor', 'kindergarten'].includes(String(pageType))) posts = await boardComponent.getMainPageInfoBoardPostsBySearchFields(searchFields, offset, limit);
			break;
		// 언론속의 선생님 & 언론속의 학원 & 학교정보
		case 'press':
			// 수능 & 비수능 페이지
			if (['non-csat', 'csat'].includes(String(pageType))) posts = await boardComponent.getMainPagePressBoardPostsBySearchFields(searchFields, offset, limit);
			break;
		// 별별질문
		case 'qna':
			// 수능 & 비수능 페이지
			if (['non-csat', 'csat'].includes(String(pageType))) posts = await boardComponent.getMainPageQnaBoardPostsBySearchFields(searchFields, offset, limit);
			break;
		// 강사 자료
		case 'resource':
			// 수능 & 비수능 페이지
			if (['non-csat', 'csat'].includes(String(pageType))) posts = await boardComponent.getMainPageResourceBoardPostsBySearchFields(searchFields, offset, limit);
			break;
		default:
			break;
	}

	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let isLike = false;
			let isDislike = false;
			let relationTutor = [];
			let relationInstitute = [];

			if (loginMemberId) {
				isLike = await boardComponent.isExistBoardPostLike(postList[i].id, loginMemberId); // eslint-disable-line
				isDislike = await boardComponent.isExistBoardPostDislike(postList[i].id, loginMemberId); // eslint-disable-line
			}

			if (boardType === 'qna' || boardType === 'resource') {
				posts.list[i].is_like = isLike;
				posts.list[i].is_dislike = isDislike;
				// 강사 회원의 경우 강사 회원 정보 조회
				if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
				// 기관 회원의 경우 기관 회원 정보 조회
				if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
				posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
				posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			} else {
				posts.list[i].dataValues.is_like = isLike;
				posts.list[i].dataValues.is_dislike = isDislike;
				// 강사 회원의 경우 강사 회원 정보 조회
				if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
				// 기관 회원의 경우 기관 회원 정보 조회
				if (postList[i].dataValues.member.dataValues.join_type === 'instiute')
					relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
				posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
				posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			}
		}
		response = posts;
	}

	// Return
	return response;
};

// 별별수다 게시물 및 댓글 조회
export const getTalkBoardPostAndComment = async (instituteId, memberId, offset = 0, limit = 10) => {
	let response = null;
	let postAndCommentList = null;

	postAndCommentList = await boardComponent.getTalkBoardPostsAndComment(instituteId, offset, limit);
	if (postAndCommentList) {
		const tmpData = [];
		for (let i = 0; i < postAndCommentList.length; i += 1) {
			const contentType = postAndCommentList[i].content_type;
			let isLike = false;
			let isDislike = false;
			let post = null;
			let comment = null;

			switch (contentType) {
				case 'post':
					post = await boardComponent.getBoardPostByBoardPostId(postAndCommentList[i].post_id); // eslint-disable-line
					if (memberId) {
						isLike = await boardComponent.isExistBoardPostLike(postAndCommentList[i].post_id, memberId); // eslint-disable-line
						isDislike = await boardComponent.isExistBoardPostDislike(postAndCommentList[i].post_id, memberId); // eslint-disable-line
					}
					tmpData[i] = {
						post_id: postAndCommentList[i].post_id,
						content_type: postAndCommentList[i].content_type,
						comment_id: null,
						board_config_id: postAndCommentList[i].board_config_id,
						member_id: post.dataValues.member_id,
						title: post.dataValues.title,
						comment_count: post.dataValues.comment_count,
						read_count: post.dataValues.read_count,
						attached_file_count: post.dataValues.attached_file_count,
						like_count: post.dataValues.like_count,
						dislike_count: post.dataValues.dislike_count,
						created_at: post.dataValues.created_at,
						updated_at: post.dataValues.updated_at,
						is_like: isLike,
						is_dislike: isDislike,
					};
					break;
				case 'comment':
					comment = await boardComponent.getBoardPostCommentByBoardPostCommentId(postAndCommentList[i].comment_id); // eslint-disable-line
					if (memberId) {
						isLike = await boardComponent.isExistBoardPostCommentLike(postAndCommentList[i].comment_id, memberId); // eslint-disable-line
						isDislike = await boardComponent.isExistBoardPostCommentDislike(postAndCommentList[i].comment_id, memberId); // eslint-disable-line
					}
					tmpData[i] = {
						post_id: postAndCommentList[i].post_id,
						content_type: postAndCommentList[i].content_type,
						comment_id: postAndCommentList[i].comment_id,
						board_config_id: postAndCommentList[i].board_config_id,
						member_id: comment.dataValues.member_id,
						title: comment.dataValues.content,
						comment_count: null,
						read_count: null,
						attached_file_count: null,
						like_count: comment.dataValues.like_count,
						dislike_count: comment.dataValues.dislike_count,
						created_at: comment.dataValues.created_at,
						updated_at: comment.dataValues.updated_at,
						is_like: isLike,
						is_dislike: isDislike,
					};
					break;
				default:
					throwError("Invalid 'content_type'", 400);
					break;
			}
			response = tmpData;
		}
	}
	// Return
	return response;
};

/**
 * @description 자유 게시판 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getGeneralBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getGeneralBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].dataValues.member.dataValues.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].dataValues.member_id); // eslint-disable-line
			posts.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	return posts;
};

/**
 * @description 자료실 게시판 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getResourceBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const posts = await boardComponent.getResourceBoardPosts(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
			posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	return posts;
};

/**
 * @description 강사 홈 강사 자료 best 게시물 조회
 * @param {Int} cafeId
 */
export const getTutorHomeResourceBestBoardPost = async (searchFields, offset = 0, limit = 5) => {
	const posts = await boardComponent.getTutorResourceBestBoardPost(searchFields, offset, limit);
	if (posts) {
		const postList = posts.list;
		for (let i = 0; i < postList.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (postList[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(postList[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (postList[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(postList[i].member_id); // eslint-disable-line
			posts.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			posts.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	return posts;
};

/**
 * @description Lv1 강사 자료 강사별 실시간 HOT 조회
 * @param {Int} lv1Id
 */
export const getTutorResourceTutorHotBoardPost = async (searchFields, offset = 0, limit = 3) => {
	// best 3 강사 인덱스 조회
	const tutorIds = await boardComponent.getTutorResourceTutorHotTutorIds(searchFields, offset, limit);
	let response = null;

	// 강사 인덱스로 강사 정보 조회
	if (tutorIds && Object.keys(tutorIds).length > 0) {
		const tutors = [];
		for (let i = 0; i < tutorIds.length; i += 1) {
			const tmpTutor = await tutorService.getTutorDataById(tutorIds[i]); // eslint-disable-line no-await-in-loop
			const tutorSubjects = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(tutorIds[i], searchFields.post_filter.lv1_id); // eslint-disable-line no-await-in-loop
			const tutorInstitutes = await instituteComponent.getTutorInstitutesByTutorId(tutorIds[i]); // eslint-disable-line no-await-in-loop
			tutors.push({ ...tmpTutor, subject: tutorSubjects, institute: tutorInstitutes });
		}
		if (Object.keys(tutors).length > 0) response = { list: tutors };
	}
	return response;
};

/**
 * @description Lv1 강사 자료 자료별 실시간 HOT 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getTutorResourcePostHotBoardPost = async (searchFields, offset = 0, limit = 3) => {
	// 자료별 실시간 HOT 조회
	const response = await boardComponent.getTutorResourcePostHotBoardPost(searchFields, offset, limit);
	if (response) {
		// 강사가 속한 기관 정보 조회
		for (let i = 0; i < response.list.length; i += 1) {
			response.list[i].institutes = await tutorService.getInstitutesByTutorId(response.list[i].tutor.id); // eslint-disable-line no-await-in-loop
			response.list[i].subject = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(response.list[i].tutor.id, searchFields.post_filter.lv1_id); // eslint-disable-line no-await-in-loop
		}
	}
	return response;
};

/**
 * @description Lv1 필터 강사 자료 목록 조회
 * @param {Array} searchFields
 * @param {Int} offset
 * @param {Int} limit
 */
export const getTutorResourceBoardPosts = async (searchFields, offset = 0, limit = 10) => {
	const response = await boardComponent.getTutorResourceBoardPosts(searchFields, offset, limit);
	if (response) {
		for (let i = 0; i < response.list.length; i += 1) {
			let relationTutor = [];
			let relationInstitute = [];
			// 강사 회원의 경우 강사 회원 정보 조회
			if (response.list[i].member.join_type === 'tutor') relationTutor = await tutorService.getMemberRelationTutorByMemberId(response.list[i].member_id); // eslint-disable-line
			// 기관 회원의 경우 기관 회원 정보 조회
			if (response.list[i].member.join_type === 'instiute') relationInstitute = await instituteService.getMemberRelationInstituteByMemberId(response.list[i].member_id); // eslint-disable-line
			response.list[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			response.list[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	return response;
};
