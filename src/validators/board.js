import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 게시판별 목록 검색 선택지 조회
export const getSearchConfig = validate([]);

// 별별수다 게시물 조회
export const getTalkBoardPost = validate([]);

// 합격수기 & 수험후기 게시물 조회
export const getEssayBoardPost = validate([]);

// 별별질문 & Q&A 게시물 조회
export const getQnaBoardPost = validate([]);

// 별별정보 게시물 조회
export const getInfoBoardPost = validate([]);

// 기출문제 & 해설 게시물 조회
export const getExamBoardPost = validate([]);

// 적폐청산 게시물 조회
export const getReportBoardPost = validate([]);

// 이벤트 게시물 조회
export const getEventBoardPost = validate([]);

// 언론속의 선생님 & 언론속의 학원 & 학교소식 목록 조회
export const getPressBoardPosts = validate([]);

// 별별수다 목록 조회
export const getTalkBoardPosts = validate([]);

// 합격수기 & 수험후기 목록 조회 Lite
export const getEssayBoardPostsList = validate([]);

// 합격수기 & 수험후기 목록 조회
export const getEssayBoardPosts = validate([]);

// 별별질문 / Q&A 목록 조회
export const getQnaBoardPosts = validate([]);

// 별별정보 목록 조회
export const getInfoBoardPosts = validate([]);

// 별별Best 목록 조회
export const getBestBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
]);

// 주간Best 목록 조회
export const getWeeklyBestBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
]);

// 기출문제 목록 조회
export const getExamBoardPosts = validate([]);

// 적폐청산 목록 조회
export const getReportBoardPosts = validate([]);

// FAQ 목록 조회
export const getFaqBoardPosts = validate([]);

// 이벤트 목록 조회
export const getEventBaordPosts = validate([]);

// 별별수다 & 맘톡 등록
export const postTalkBoardPost = validate([]);

// 합격수기 & 수험후기 등록
export const postEssayBoardPost = validate([]);

// 별별질문 & QnA 등록
export const postQnaBoardPost = validate([]);

// 별별정보 등록
export const postInfoBaordPost = validate([]);

// 적폐청산 등록
export const postReportBoardPost = validate([]);

// 별별수다 & 맘톡 게시물 수정
export const patchTalkBoardPost = validate([]);

// 합격후기 & 수험후기 게시물 수정
export const patchEssayBoardPost = validate([]);

// 별별질문 & QnA 게시물 수정
export const patchQnaBoardPost = validate([]);

// 별별정보 게시물 수정
export const patchInfoBoardPost = validate([]);

// 적폐청산 게시물 수정
export const patchReportBoardPost = validate([]);

// 게시물 삭제
export const deleteBoardPostElimination = validate([]);

// 게시물 추천
export const postBoardPostLike = validate([]);

// 게시물 비추천
export const postBoardPostDislike = validate([]);

// 게시물 댓글 목록 조회
export const getBoardPostComments = validate([]);

// 게시물 댓글 등록
export const postBoardPostComment = validate([]);

// 게시물 댓글 삭제
export const deleteBoardPostComment = validate([]);

// 게시물 댓글 추천
export const postBoardPostCommentLike = validate([]);

// 게시물 댓글 비추천
export const postBoardPostCommentDislike = validate([]);

// Lv0 페이지 별별정보 게시물 조회
export const getMainPageInfoBoardPosts = validate([]);

// Lv0 페이지 강사자료 게시물 조회
export const getMainPageResourceBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
]);

// Lv0 Best 게시물 조회
export const getMainPageBestBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
]);

// Lv0 페이지 별별수다 게시물 조회
export const getMainPageTalkBoardPosts = validate([]);

// Lv1 페이지 게시물 조회
export const getMainPageBoardPosts = validate([
	check('board_type')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isValidBoardType)
		.not()
		.isEmpty(),
	check('filter_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
	check('page_type')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isValidPageType)
		.not()
		.isEmpty(),
]);

// 자유 게시판 게시글 작성
export const postGeneralBoardPost = validate([
	check('cafe_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
	check('title')
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.not()
		.isEmpty(),
	check('contents')
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.not()
		.isEmpty(),
	check('is_notice')
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.custom(validation.isValidAgreement)
		.not()
		.isEmpty(),
	check('is_secret')
		.optional()
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.custom(validation.isValidAgreement),
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
]);

/** @description 자유 게시글 목록 조회 검사 */
export const getGeneralBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('cafe_id')
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
	check('search_keyword')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('order')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isExistPostOrder)
		.not()
		.isEmpty(),
	check('is_notice')
		.optional()
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.custom(validation.isValidAgreement)
		.not()
		.isEmpty(),
]);

// 일반 게시글 상세 조회 검사
export const getGeneralBoardPost = validate([
	check('post_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistPostId)
		.not()
		.isEmpty(),
]);

/**
 * @description 일반 게시글 삭제 검사
 */
export const deleteGeneralBoardPost = validate([
	check('post_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistPostId)
		.custom(validation.isExistGeneralBoardPostAuth)
		.not()
		.isEmpty(),
]);

/**
 * @description 일반 게시글 수정 검사
 */
export const patchGeneralBoardPost = validate([
	check('post_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistPostId)
		.custom(validation.isExistGeneralBoardPostAuth)
		.withMessage('Invalid post write auth.')
		.not()
		.isEmpty(),
	check('cafe_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
	check('title')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('contents')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('is_notice')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isValidAgreement),
]);

/** @description 자료실 게시글 작성 검사 */
export const postResourceBoardPost = validate([
	check('cafe_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
	check('title')
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.not()
		.isEmpty(),
	check('contents')
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.not()
		.isEmpty(),
	check('is_notice')
		.exists({ checkFalsy: true })
		.toString()
		.isString()
		.custom(validation.isValidAgreement)
		.not()
		.isEmpty(),
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
]);

/**
 * @description 자료실 목록 조회 검사
 */
export const getResourceBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('cafe_id')
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
	check('search_keyword')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('order')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isExistPostOrder)
		.not()
		.isEmpty(),
	check('is_notice')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isValidAgreement),
]);

/**
 * @description 자료실 상세 조회 검사
 */
export const getResourceBoardPost = validate([
	check('post_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistPostId)
		.not()
		.isEmpty(),
]);

/** @description 자료실 게시글 삭제 검사 */
export const deleteResourceBoardPost = validate([
	check('post_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistPostId)
		.custom(validation.isExistGeneralBoardPostAuth)
		.withMessage('Invalid post delete auth.')
		.not()
		.isEmpty(),
]);

/**
 * @description 자료실 게시글 수정
 */
export const patchResourceBoardPost = validate([
	check('post_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistPostId)
		.custom(validation.isExistGeneralBoardPostAuth)
		.withMessage('Invalid post write auth.')
		.not()
		.isEmpty(),
	check('cafe_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
	check('title')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('contents')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('is_notice')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isValidAgreement),
]);

/** Lv1 필터 강사 자료 목록 조회 */
export const getTutorResourceBoardPosts = validate([
	check('page')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('limit')
		.optional()
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric(),
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
	check('search_keyword')
		.optional()
		.exists({ checkFalsy: true })
		.isString()
		.toString(),
	check('order')
		.exists({ checkFalsy: true })
		.isString()
		.toString()
		.custom(validation.isExistPostOrder)
		.not()
		.isEmpty(),
]);

/** @description 강사 홈 강사 자료 best 게시물 조회 */
export const getTutorHomeResourceBestBoardPost = validate([
	check('cafe_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isExistCafeId)
		.not()
		.isEmpty(),
]);

/** @description Lv1 강사 자료 실시간 HOT 조회 */
export const getTutorResourceTutorHotBoardPost = validate([
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
]);

/** @description Lv1 강사 자료 자료별 실시간 HOT 조회 */
export const getTutorResourcePostHotBoardPost = validate([
	check('lv1_id')
		.exists({ checkFalsy: true })
		.toInt()
		.isNumeric()
		.custom(validation.isSiteFilter)
		.not()
		.isEmpty(),
]);
