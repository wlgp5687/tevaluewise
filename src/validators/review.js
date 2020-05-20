import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 강사 리뷰 조회
export const getTutorReview = validate([]);

// 강사 리뷰 목록 조회
export const getTutorReviews = validate([]);

// 강사 리뷰 등록
export const postRegisterTutorReview = validate([]);

// 기관 리뷰 조회
export const getInstituteReview = validate([]);

// 기관 리뷰 목록 조회
export const getInstituteReviews = validate([]);

// 기관 리뷰 등록
export const postRegisterInstituteReview = validate([]);

// 강사 환승 리뷰 조회
export const getTutorChangeReview = validate([]);

// 강사 환승 리뷰 목록 조회
export const getTutorChangeReviews = validate([]);

// 강사 환승 리뷰 등록
export const postRegisterTutorChangeReview = validate([]);

// 기관 환승 리뷰 조회
export const getInstituteChangeReview = validate([]);

// 기관 환승 리뷰 목록 조회
export const getInstituteChangeReviews = validate([]);

// 기관 환승 리뷰 등록
export const postRegisterInstituteChangeReview = validate([]);

// 강사 페이지 실시간 평가
export const getRealTimeEvaluationTutorReviewByTutorId = validate([]);

// 기관 페이지 실시간 평가
export const getRealTimeEvaluationInstituteReviewByInstituteId = validate([]);

// 강사 인덱스로 강사 베스트 긍정 & 부정 리뷰 조회
export const getPositiveAdnNegativeTutorReviewByTutorId = validate([]);

// 강사 인덱스로 강사 환승 베스트 리뷰
export const getBestTutorTransferReviewByTutorId = validate([]);

// 기관 인덱스로 강사 리뷰 조회
export const getTutorReviewByInstituteId = validate([]);

// 기관 인덱스로 강사 베스트 긍정 & 부정 리뷰 조회
export const getPositiveAndNegativeTutorReviewByInstituteId = validate([]);

// 기관 인덱스로 강사 환승 베스트 리뷰 조회
export const getBestTutorTransferReviewByInstituteId = validate([]);

// 기관 인덱스로 기관 리뷰 조회
export const getInstituteReviewByInstituteId = validate([]);

// 기관 인덱스로 기관 환승 리뷰 조회
export const getInstituteTransferReviewByInstituteId = validate([]);

// 과목에 따른 강사 리뷰 관련 정보 조회
export const getTutorReviewRelationInfoByTutorIdAndSubjectId = validate([]);

// 강사 환승 리뷰 관련 정보 조회
export const getTutorChangeReviewRelationTutorsByTutorId = validate([]);

// 리뷰 추천
export const postReviewRecommend = validate([]);

// 리뷰 비추천
export const postReviewOpposition = validate([]);

// 댓글 추천
export const postReviewCommentRecommend = validate([]);

// 댓글 비추천
export const postReviewCommentOpposition = validate([]);

// 리뷰 댓글 목록 조회
export const getReviewComment = validate([]);

// 리뷰 댓글 등록
export const postReviewComment = validate([]);

// 리뷰 댓글 삭제
export const deleteReviewComment = validate([]);

// Lv0 페이지 지금 뜨는 리뷰
export const getMainPageNowReview = validate([]);

// Lv0 페이지 리뷰 Live 20
export const getMainPageLiveReview = validate([]);

//Lv1 페이지 리뷰 조회
export const getMainPageReview = validate([]);
