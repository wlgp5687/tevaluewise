import hangul from 'hangul-disassemble';
import * as adminService from '../services/admin/admin/admin';
import * as memberService from '../services/member/member';
import * as tutorService from '../services/tutor/tutor';
import * as instituteService from '../services/institute/institute';
import * as followService from '../services/follow/follow';
import * as regionService from '../services/region/region';
import * as subjectService from '../services/subject/subject';
import * as bannerService from '../services/banner/banner';
import * as boardService from '../services/board/board';
import * as searchService from '../services/search/search';
import * as calendarService from '../services/calendar/calendar';
import * as cafeService from '../services/cafe/cafe';
import * as reviewService from '../services/review/review';
import * as customerService from '../services/customer/customer';
import * as siteService from '../services/site/site';
import { throwError } from '../services';

// ########## Member ##########

// 회원 닉네임
export const isValidNickname = (value) => (hangul.disassemble(decodeURIComponent(value).replace(/[0-9a-zA-Z]/g, ''), { flatten: true }) || []).every((c) => c !== null);

// 회원 가입 사이트
export const isValidJoinSite = (value) => ['site', 'naver', 'kakao', 'facebook', 'internal'].includes(String(decodeURIComponent(value)));

// 회원 이름
export const isValidName = (value) => hangul.disassemble(decodeURIComponent(value).replace(/[0-9a-zA-Z]/g, ''), { flatten: false } || []).every((c) => c !== null);

// 생년월일
export const isValidBirthday = (value) => decodeURIComponent(value).replace(/^[\d]{4}-[\d]{2}-[\d]{2}$/, '') || decodeURIComponent(value).replace(/^[\d]{8}$/, '');

// 비밀번호
export const isValidPassword = (value) => (decodeURIComponent(value).match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,20}$/) ? true : false); // eslint-disable-line

// 핸드폰 번호
export const isValidPhone = (value) => (decodeURIComponent(value).match(/^\d{3}-\d{3,4}-\d{4}$/) ? true : false); // eslint-disable-line

// 이메일
export const isValidEmail = (value) => (decodeURIComponent(value).match(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i) ? true : false); // eslint-disable-line

// 목록 정렬 기준
export const isValidOrderBy = (value) => ['min_connect_count', 'max_connect_count', 'first_join_at', 'last_join_at'].includes(String(decodeURIComponent(value)));

// ###### Institute ######

// 기관 타입
export const isValidInstituteType = (value) => ['institute', 'university', 'kindergarten', 'daycare', 'etc'].includes(String(decodeURIComponent(value)));

// ###### Review ######

// 강사 리뷰 강의 종류 타입
export const isValidTutorReviewCourseType = (value) => ['unknown', 'online', 'offline'].includes(String(decodeURIComponent(value)));

// 리뷰 유형
export const isValidReviewType = (value) => ['tutor', 'institute', 'tutor_change', 'institute_change'].includes(String(decodeURIComponent(value)));

// 리뷰 정량 답변
export const isValidReviewAnswerPoint = async (value, { req }) => {
	const response = await reviewService.isValidReviewAnswerPoint(req.params.review_answer_point_id, value);
	return response;
};

// 리뷰 선택형 답변
export const isValidReviewChoiceId = async (value, { req }) => {
	let response = await reviewService.isValidReviewChoiceId(req.params.review_answer_choice_id);
	response = response.includes(parseInt(value, 10));
	return response;
};

// 리뷰 선택형 질문
export const isValidReviewQuestionId = async (value) => {
	const response = await reviewService.isValidReviewQuestionId(value);
	return response;
};

/** @description 리뷰 질문 필터 인덱스 존재 여부 확인 */
export const isExistReviewQuestionFilterId = async (value) => {
	const response = await reviewService.isExistReviewQuestionFilterId(value);
	return response;
};

// 리뷰 인덱스 존재 여부 확인
export const isExistReviewId = async (value) => {
	const response = await reviewService.isExistReviewId(value);
	return response;
};

// 리뷰 정성 평가 인덱스 존재 여부 확인
export const isExistReviewAnswerTextId = async (value) => {
	const response = await reviewService.isExistReviewAnswerTextId(value);
	return response;
};

// 리뷰 정량 평가 인덱스 존재 여부 확인
export const isExistReviewAnswerPointId = async (value) => {
	const response = await reviewService.isExistReviewAnswerPointId(value);
	return response;
};

// 리뷰 년도 답변 인덱스 존재 여부 확인
export const isExistReviewAnswerYearId = async (value) => {
	const response = await reviewService.isExistReviewAnswerYearId(value);
	return response;
};

// 리뷰 선택형 답변 인덱스 존재 여부 확인
export const isExistReviewAnswerChoiceId = async (value) => {
	const response = await reviewService.isExistReviewAnswerChoiceId(value);
	return response;
};

// 리뷰 댓글 인덱스 존재 여부 확인
export const isExistReviewCommentId = async (value) => {
	const response = await reviewService.isExistReviewCommentId(value);
	return response;
};

// 리뷰 열람 권한 존재 여부 확인
export const isExistReviewAuth = async (value) => {
	const response = await reviewService.isExistReviewAuth(value);
	return response;
};

// 리뷰 열람 권한 인덱스 존재 여부 확인
export const isExistReviewAuthId = async (value) => {
	const response = await reviewService.isExistReviewAuthId(value);
	return response;
};

// ###### Common ######

// 약관 타입
export const isValidTermType = (value) => ['user_agreements', 'copyright_license', 'personal_information', 'information_user_consent', 'collect_email'].includes(String(decodeURIComponent(value)));

// 분야 타입 코드
export const isValidFieldTypesCode = (value) => ['site', 'rank', 'grade', 'serial', 'position', 'speciality_part', 'class', 'direct_current', 'subject'].includes(String(decodeURIComponent(value)));

// 년월일
export const isValidDate = (value) => decodeURIComponent(value).replace(/^[\d]{4}-[\d]{2}-[\d]{2}$/, '');

/** @description 강사 카페 개설 요청 권한 확인 */
export const isValidRequestTutorCafeAuth = async (value, { req }) => {
	const { data } = req.decodedToken;
	const memberId = data.member ? data.member.id : null;
	if (!memberId) throwError("Invalid 'member_id'", 400);
	// 회원 인덱스가 존재하는지 확인
	if (!(await memberService.isExistMemberId(memberId))) throwError("Invalid 'member_id'", 400);
	const tutorId = data.member.tutor ? data.member.tutor.tutor_id : null;
	if (!tutorId) throwError("Invalid 'tutor_id'", 400);
	if (!(await tutorService.isExistTutorId(tutorId))) throwError("Invalid 'tutor_id'", 400);
	if (await cafeService.isExistCafeTutorByTutorId(tutorId)) throwError("Invalid 'tutor_id'", 400);
	if (String(tutorId) !== String(value)) throwError("Invalid 'tutor_id'", 400);

	return true;
};

/** @description 카페 게시판 설정 수정 권한 확인 */
export const isValidCafeBoardConfigAuth = async (value, { req }) => {
	const { data } = req.decodedToken;
	const memberId = data.member ? data.member.id : null;
	if (!memberId) throwError("Invalid 'member_id'", 400);
	// 회원 인덱스가 존재하는지 확인
	if (!(await memberService.isExistMemberId(memberId))) throwError("Invalid 'member_id'", 400);
	const tutorId = data.member.tutor ? data.member.tutor.tutor_id : null;
	if (!tutorId) throwError("Invalid 'tutor_id'", 400);
	if (!(await tutorService.isExistTutorId(tutorId))) throwError("Invalid 'tutor_id'", 400);
	const cafeId = data.member.tutor ? data.member.tutor.cafe_id : null;
	if (!cafeId) throwError("Invalid 'cafe_id'", 400);
	if (!(await cafeService.isExistCafeId(cafeId))) throwError("Invalid 'cafe_id'", 400);
	if (!(await cafeService.isValidCafeBoardConfigIdAndCafeId(value, cafeId))) throwError("Invalid 'cafe_board_config_id'", 400);
};

// 로그인 회원 Token 체크
export const isValidLoginMemberToken = async (value, { req }) => {
	const { data } = req.decodedToken;
	const memberId = data.member ? data.member.id : null;

	if (memberId) {
		// token 의 로그인 아이디와 전달받은 아이디가 같은지 확인
		if (String(memberId) !== String(value)) throwError("Invalid 'member_id'", 400);

		// id 가 존재하는지 확인
		if (!(await memberService.isExistMemberId(memberId))) throwError("Invalid 'member_id'", 400);
	} else {
		throwError("Invalid 'member_id'", 400);
	}

	return true;
};

// 로그인 관리자 회원 Token 체크
export const isValidLoginAdminMemberToken = async (value, { req }) => {
	const { data } = req.decodedToken;
	const adminMemberId = data.admin ? data.admin.id : null;

	if (adminMemberId) {
		// id 가 존재하는지 확인
		if (!(await adminService.isExistAdminMemberId(adminMemberId))) throwError("Invalid 'member_id'", 400);
	} else {
		throwError("Invalid 'member_id'", 400);
	}

	return true;
};

/**
 * 회원
 */
// 회원 인덱스 존재 여부 확인
export const isExistMemberId = async (value) => {
	const response = await memberService.isExistMemberId(value);
	return response;
};
// 회원 닉네임 존재 여부 확인
export const isExistNickname = async (value) => {
	const response = await memberService.isExistNickname(value);
	// Retrun
	return !response;
};

// 회원 제제 여부 확인
export const isExistMemberBan = async (value) => {
	const response = await memberService.isExistMemberBan(value);
	return response;
};

// 회원 휴면 여부 확인
export const isExistMemberDormant = async (value) => {
	const response = await memberService.isExistMemberDormant(value);
	return response;
};

// 회원 가입 타입
export const isValidJoinType = (value) => ['student', 'parent', 'tutor', 'institute'].includes(String(decodeURIComponent(value)));
// SNS 회원 가입 사이트
export const isValidExternalChannel = (value) => ['naver', 'facebook', 'kakao'].includes(String(decodeURIComponent(value)));

/**
 * 강사
 */

// 강사 인덱스 존재 여부 확인
export const isExistTutorId = async (value) => {
	const response = await tutorService.isExistTutorId(value);
	return response;
};

// 강사 성별
export const isExistSex = (value) => ['man', 'woman'].includes(String(decodeURIComponent(value)));

// 강사와 기관 연결 인덱스 존재 여부 확인
export const isExistTutorInstituteId = async (value) => {
	let response = true;
	if (value) response = await tutorService.isExistTutorInstituteId(value);
	return response;
};

// 강사 카페 생성 요청 인덱스 존재 여부 확인
export const isValidTutorRequestAuthCafeId = async (value) => {
	const response = await tutorService.isExistTutorRequestAuthCafeId(value);
	return response;
};

/**
 * 기관
 */

// 기관 인덱스 존재 여부 확인
export const isExistInstituteId = async (value) => {
	let response = true;
	if (value) response = await instituteService.isExistInstituteId(value);
	return response;
};

/**
 * 공통
 */
// 성별
export const isValidSex = (value) => ['man', 'woman', 'unknown'].includes(String(decodeURIComponent(value)));
// 약관 동의
export const isValidAgreement = (value) => ['Y', 'y', 'N', 'n'].includes(String(decodeURIComponent(value)));
// 사이트 Lv filter_id
export const isSiteFilter = async (value) =>
	[2, 7, 16, 20, 25, 53, 66, 80, 85, 92, 132, 137, 145, 153, 163, 170, 184, 195, 210, 218, 244, 254, 266, 274, 289, 294, 313, 317, 353, 449, 462, 475, 617, 4402, 4403].includes(parseInt(value, 10));

/**
 * 팔로우
 */
// 기관 팔로우 인덱스 여부
export const isExistInstituteFollowId = async (value) => {
	const response = await followService.isExistInstituteFollowId(value);
	return response;
};

// 강사 팔로우 인덱스 여부
export const isExistTutorFollowId = async (value) => {
	const response = await followService.isExistTutorFollowId(value);
	return response;
};

/**
 * 지역
 */
// 지역 인덱스 여부
export const isExistRegionId = async (value) => {
	let response = true;
	if (value) response = await regionService.isExistRegionId(value);
	return response;
};

/**
 * 과목
 */
export const isExistSubjectId = async (value) => {
	let response = true;
	if (value) response = await subjectService.isExistSubjectId(value);
	return response;
};

// 기관 회원 여부 조회
export const isInstituteMember = async (value) => {
	let response = true;
	if (value) response = await memberService.isInstituteMember(value);
	return response;
};

// 강사 회원 여부 조회
export const isTutorMember = async (value) => {
	let response = true;
	if (value) response = await memberService.isTutorMember(value);
	return response;
};

/**
 * 게시물
 */
// 게시물 인덱스 존재 여부 확인
export const isExistPostId = async (value) => {
	const response = await boardService.isExistPostId(value);
	return response;
};

// 게시물 댓글 인덱스 존재 여부 확인
export const isExistPostCommentId = async (value) => {
	const response = await boardService.isExistPostCommentId(value);
	return response;
};

// 게시물 목록 조회 정렬 순서 확인
export const isExistPostOrder = (value) =>
	['last_at', 'first_at', 'view_count', 'recommend_count', 'first_post_id', 'last_post_id', 'comment_count', 'download_count', 'answer_pause', 'answer_completion'].includes(value);

// 게시물 검색 조건 키워드 확인
export const isExistPostKeyword = (value) => ['title', 'contents', 'title_contents', 'nickname'].includes(value);

// 별별 정보 카테고리 확인
export const isValidInfoCategory = (value) => ['basic', 'tip', 'news'].includes(value);

// faq 카테고리 확인
export const isValidFaqCategory = (value) => ['starteacher', 'member', 'service'].includes(value);

// 이벤트 상태 확인
export const isValidEventStatus = (value) => [1, 2, 3].includes(value);

// 초등/유아 임용 하위 구분 확인
export const isValidAppointmentSubtype = (value) => ['element', 'kindergarten', 'special_infant', 'special_element', 'librarian', 'health'].includes(value);

// 지역 이름 확인
export const isValidAppointmentLocalRegion = (value) =>
	['seoul', 'gyeonggi', 'incheon', 'sejong', 'daejeon', 'daegu', 'gwangju', 'busan', 'ulsan', 'gangwon', 'chungbuk', 'chungnam', 'gyeongbuk', 'gyeongnam', 'jeonbuk', 'jeonnam', 'jeju'].includes(
		value,
	);

// 공무원 소속 지역
export const isValidGongLocalRegion = (value) => ['state', 'seoul', 'local'].includes(value);

// 수강 유형 확인
export const isValidLectureType = (value) => ['offline', 'online', 'english_tel'].includes(value);

// 게시글 작성 권한 확인
export const isExistGeneralPostAccess = async (value, { req }) => {
	const memberId = req.decodedToken.data.member.id;
	const followResponse = await memberService.isExistMemberFollowTutor(value, memberId);
	const tutorResponse = await tutorService.isExistTutorMember(value, memberId);
	if (followResponse || tutorResponse) return true;
	return false;
};
// 게시판 타입 검사
export const isValidBoardType = (value) => ['press', 'talk', 'essay', 'qna', 'info', 'exam', 'report', 'faq', 'event', 'resource', 'general'].includes(value);

// 수능 비수능 타입 검사
export const isValidPageType = (value) => ['non-csat', 'csat', 'kindergarten', 'professor'].includes(value);

// 답변 상태 확인
export const isValidAnswerStatus = (value) => ['pause', 'completion'].includes(value);

// 게시글 권한 확인
/**
 *
 * @param {Int} value
 * @param {Array} req
 */
export const isExistGeneralBoardPostAuth = async (value, { req }) => {
	const memberId = req.decodedToken.data.member.id;
	const response = await memberService.isExistMemberBoardPost(memberId, value);
	return response;
};

/**
 * 배너
 */

// 배너 인덱스 존재 여부 확인
export const isExistBannerId = async (value) => {
	const response = await bannerService.isExistBannerId(value);
	return response;
};

// 배너와 강사 연결 인덱스 존재 여부 확인
export const isExistBannerTutorId = async (value) => {
	let response = true;
	if (value) response = await bannerService.isExistBannerTutorId(value);
	return response;
};

// 배너와 기관 연결 인덱스 존재 여부 확인
export const isExistBannerInstituteId = async (value) => {
	let response = true;
	if (value) response = await bannerService.isExistBannerInstituteId(value);
	return response;
};

// 배너와 필터 연결 인덱스 존재 여부 확인
export const isExistBannerFilterId = async (value) => {
	let response = true;
	if (value) response = await bannerService.isExistBannerFilterId(value);
	return response;
};

// 배너 페이지
export const isValidBannerPage = async (value) =>
	[
		'main',
		'join',
		'tutor_page',
		'non_csat_institute_page',
		'csat_institute_page',
		'university_page',
		'professor_page',
		'kindergarten_page',
		'board',
		'guide',
		'kindergarten_site',
		'professor_site',
		'csat_site',
		'non_csat_site',
	].includes(String(decodeURIComponent(value)));

// 배너 포지션
export const isValidBannerPosition = async (value) =>
	[
		'main',
		'join',
		'home',
		'normal_review',
		'transfer_review',
		'talk_list',
		'talk_detail',
		'info_list',
		'info_detail',
		'exam_list',
		'exam_detail',
		'essay_list',
		'essay_detail',
		'report_list',
		'report_detail',
		'event_list',
		'event_detail',
		'qna_list',
		'qna_detail',
		'faq_list',
		'resource_list',
		'resource_detail',
		'general_list',
		'general_detail',
		'guide',
		'search',
	].includes(String(decodeURIComponent(value)));

// 배너 타겟
export const isValidBannerTarget = async (value) =>
	['interview', 'popup', 'login', 'common', 'main_top', 'main_bottom', 'right_quick', 'content_keyword', 'content', 'lnb_block', 'soccer_field'].includes(String(decodeURIComponent(value)));

// 배너 기기
export const isValidBannerDevice = async (value) => ['pc', 'mobile'].includes(String(decodeURIComponent(value)));

// 강사 인덱스
export const isValidTutorArrayIds = async (value) => {
	const tutorArray = value.split('|');
	// eslint-disable-next-line no-await-in-loop
	for (let i = 0; i < tutorArray.length; i += 1) if (!(await isExistTutorId(tutorArray[i]))) throwError(`Invalid 'tutor_id'${tutorArray[i]} `, 400);
};

// 기관 인덱스
export const isValidInstituteArrayIds = async (value) => {
	const instituteArray = value.split('|');
	// eslint-disable-next-line no-await-in-loop
	for (let i = 0; i < instituteArray.length; i += 1) if (!(await isExistInstituteId(instituteArray[i]))) throwError(`Invalid 'institute_id'${instituteArray[i]} `, 400);
};

// 레벨 필터 인덱스
export const isValidSiteFilterIds = async (value) => {
	const siteFilterArray = value.split('|');
	// eslint-disable-next-line no-await-in-loop
	for (let i = 0; i < siteFilterArray.length; i += 1) if (!(await isSiteFilter(siteFilterArray[i]))) throwError(`Invalid 'filter_id'${siteFilterArray[i]} `, 400);
};

// 배너 첨부파일
export const isValidBannerAttachFile = async (value) => {
	if (!value[0] || value[0].s3_key || value.file_url) throwError("Invalid 'fle'", 400);
};

// 추천검색어 인덱스 존재 여부 확인
export const isExistRecommendResearchWordId = async (value) => {
	const response = await searchService.isExistRecommendResearchWordId(value);
	return response;
};

// 타이핑검색어 인덱스 존재 여부 확인
export const isExistTypingKeywordId = async (value) => {
	const response = await searchService.isExistTypingKeywordId(value);
	return response;
};

// ###### Calendar ######
// 년원일 형식 검사
export const isValidCalendarDate = (value) => (value.match(/^\d{4}-\d{2}-\d{2}$/) ? true : false); // eslint-disable-line no-unneeded-ternary

// 시작 날짜 종료 날짜 검사
export const isValidPrevDateBigger = (value, { req }) => (new Date(value) > new Date(req.query.end_date ? req.query.end_date : req.body.end_date) ? false : true);

// 일정 존재 여부 검사
export const isExistCalendarId = async (value) => {
	const response = await calendarService.isExistCalendarId(value);
	return response;
};

// 일정 필터 존재 여부 검사
export const isExistCalendarFilter = async (value, { req }) => {
	const response = await calendarService.isExistCalendarFilter(value, req.params.filter_id);
	return response;
};

// 공휴일 일정 인덱스 존재 여부 검사
export const isExistHolidayById = async (value) => {
	const response = await calendarService.isExistHolidayById(value);
	return response;
};

// 공휴일 일정 일자 존재 여부 검사
export const isExistHoliday = async (value) => {
	const response = await calendarService.isExistHoliday(value);
	return response;
};

// 카페 승인여부
export const isValidCafeConfirm = (value) => ['REQUEST', 'Y', 'N'].includes(String(decodeURIComponent(value)));

// 리뷰 승인여부
export const isValidReviewConfirm = (value) => ['REQUEST', 'Y', 'N', 'BLIND'].includes(String(decodeURIComponent(value)));

/** 카페 */
// 카페 개설 요청 타입
export const isValidRequestType = (value) => ['invitation', 'compulsoriness'].includes(String(decodeURIComponent(value)));

// 카페 인덱스 존재 여부 확인
export const isExistCafeId = async (value) => {
	const response = await cafeService.isExistCafeId(value);
	return response;
};

// 카페 영상 인덱스 존재 여부 확인
export const isExistCafeVideoId = async (value) => {
	const response = await cafeService.isExistCafeVideoId(value);
	return response;
};

/** @description 카페 게시판 설정 인덱스 존재 여부 확이 */
export const isExistCafeBoardConfigId = async (value) => {
	const response = await cafeService.isExistCafeBoardConfigId(value);
	return response;
};

// 고객센터 유형
export const isValidCustomerServiceType = (value) => ['service', 'information', 'cafe'].includes(value);

// 고객센터 상태
export const isValidCustomerServiceStatus = (value) => ['REQUEST', 'PROGRESS', 'COMPLETE'].includes(value);

/** @description 고객센터 문의 인덱스 존재 여부 확인 */
export const isExistCustomerServiceReport = async (value) => {
	const response = await customerService.isExistCustomerServiceReport(value);
	return response;
};

// 사이트 설정 타입
export const isValidSiteSettingType = (value) => ['watchon'].includes(String(decodeURIComponent(value)));

/** @description 사이트 설정 인덱스 존재 여부 */
export const isExistSiteSettingId = async (value) => {
	const response = await siteService.isExistSiteSettingId(value);
	return response;
};

/** @description 사이트 아이피 검수 인덱스 존재 여부 */
export const isExistInspectionIpAddressId = async (value) => {
	const response = await siteService.isExistInspectionIpAddressId(value);
	return response;
};

/** @description 사이트 아이피 검수 아이피 존재 여부 */
export const isExistInspectionIpAddress = async (value) => {
	const response = await siteService.isExistInspectionIpAddress(String(decodeURIComponent(value)));
	return response;
};
