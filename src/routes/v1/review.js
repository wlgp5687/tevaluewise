import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as commonComponent from '../../component/common';
import * as tutorService from '../../services/tutor/tutor';
import * as reviewService from '../../services/review/review';
import * as boardService from '../../services/board/board';
import * as reviewQuestionService from '../../services/review/reviewQuestion';
import * as reviewValidator from '../../validators/review';
import * as reviewQuestionValidator from '../../validators/reviewQuestion';
import { cache } from '../../services/cache';

const router = express.Router();

// 리뷰 질문
// 필터 Id로 질문 목록 및 선택지 조회
router.get(
	'/questions/by-filter/:filter_id',
	...reviewQuestionValidator.getReviewQuestionsWithAnswer,
	cache('7 days'),
	wrapAsyncRouter(async (req, res) => {
		// 질문 목록 및 선택지 조회
		const reviewQuestions = await reviewQuestionService.getReviewQuestionsWithAnswerByFilterIdAndReviewType(req.params.filter_id, req.query.review_type);

		// Return
		return res.json(!reviewQuestions ? null : { review_question: reviewQuestions });
	}),
);

// 강사 페이지 실시간 평가
router.get(
	'/tutor/:tutor_id/real-time-evaluation',
	...reviewValidator.getRealTimeEvaluationTutorReviewByTutorId,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const limit = req.query.limit ? req.query.limit : 15;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const tutorId = req.params.tutor_id;
		const filterId = req.query.filter_id;

		// Best 강사 환승 리뷰
		const bestTransferReview = await reviewService.getBestTutorTransferReviewByTutorId(tutorId, false, memberId, filterId);
		// Best 긍정 강사 리뷰
		const positiveBestNormalReview = await reviewService.getPositiveTutorBestNormalReviewByTutorId(tutorId, false, memberId, filterId);
		// Best 부정 강사 리뷰
		const negativeBestNormalReview = await reviewService.getNegativeTutorBestNormalReviewByTutorId(tutorId, false, memberId, filterId);
		// 최신 일반 리뷰 & 환승 리뷰 & 댓글
		const realTimeReviewAndComment = await reviewService.getRealTimeReviewAndComment(tutorId, null, 'tutor', limit, memberId, filterId);

		if (bestTransferReview || positiveBestNormalReview || negativeBestNormalReview || realTimeReviewAndComment)
			response = {
				best_transfer_review: bestTransferReview,
				positive_best_normal_review: positiveBestNormalReview,
				negative_best_normal_review: negativeBestNormalReview,
				list: realTimeReviewAndComment,
			};

		// Return
		return res.json(response);
	}),
);

// 강사 인덱스로 강사 베스트 긍정 & 부정 리뷰 조회
router.get(
	'/tutor/:tutor_id/positive-negative',
	...reviewValidator.getPositiveAdnNegativeTutorReviewByTutorId,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const tutorId = req.params.tutor_id;
		const filterId = req.query.filter_id;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 강사 총 리뷰 수 조회
		const tutorTotalReview = await reviewService.getTutorReviewCountByTutorId(tutorId, filterId);
		// 긍정 Best 강사 리뷰
		const positiveBestNormalReview = await reviewService.getPositiveTutorBestNormalReviewByTutorId(tutorId, false, memberId, filterId);
		// 부정 Best 강사 리뷰
		const negativeBestNormalReview = await reviewService.getNegativeTutorBestNormalReviewByTutorId(tutorId, false, memberId, filterId);
		if (positiveBestNormalReview || negativeBestNormalReview)
			response = { total_review_count: tutorTotalReview, positive_best_normal_review: positiveBestNormalReview || null, negative_best_normal_review: negativeBestNormalReview || null };
		// Return
		return res.json(response);
	}),
);

// 강사 인덱스로 강사 환승 베스트 리뷰
router.get(
	'/tutor/:tutor_id/best-transfer-review',
	...reviewValidator.getBestTutorTransferReviewByTutorId,
	wrapAsyncRouter(async (req, res) => {
		const tutorId = req.params.tutor_id;
		const filterId = req.query.filter_id;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const tutorChangeReviewCount = await reviewService.getTutorChangeReviewCountByTutorId(tutorId, filterId);
		// Best 강사 환승 리뷰
		const bestTutorTransferReview = await reviewService.getBestTutorTransferReviewByTutorId(tutorId, false, memberId, filterId);
		// Return
		return res.json(!bestTutorTransferReview ? null : { total_review_count: tutorChangeReviewCount, best_tutor_transfer_review: bestTutorTransferReview || null });
	}),
);

// 과목에 따른 강사 리뷰 관련 정보 조회
router.get(
	'/tutor/:tutor_id/relation-info',
	...reviewValidator.getTutorReviewRelationInfoByTutorIdAndSubjectId,
	wrapAsyncRouter(async (req, res) => {
		const relationInfo = await reviewService.getTutorReviewRelationInfoByTutorIdAndSubjectId(req.params.tutor_id, req.query.subject_id, req.query.filter_id);
		// Return
		return res.json(!relationInfo ? null : { tutor_review_relation_info: relationInfo || null });
	}),
);

// 강사 리뷰 조회
router.get(
	'/tutor/:review_id',
	...reviewValidator.getTutorReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const { ipAddress } = req;
		// 강사 리뷰 조회
		const tutorReview = await reviewService.getReviewByIdAndType(req.params.review_id, 'tutor', memberId, ipAddress);

		// Return
		return res.json(!tutorReview ? null : { tutor_review: tutorReview });
	}),
);

// 강사 리뷰 목록 조회
router.get(
	'/tutor',
	...reviewValidator.getTutorReviews,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청 변수 정리
		const searchFields = { review: { review_type: 'tutor', is_deleted: 'N', is_confirm: ['Y', 'N'] } };

		// tutor_reviews
		const tutorReviewSearchField = { filter_id: req.query.filter_id };
		if (req.query.tutor_id) tutorReviewSearchField.tutor_id = req.query.tutor_id;
		if (req.query.institute_id) tutorReviewSearchField.institute_id = req.query.institute_id;
		// if (req.query.subject_id) tutorReviewSearchField['subject_id'] = req.query.subject_id;
		if (Object.keys(tutorReviewSearchField).length > 0) searchFields.tutor_review = tutorReviewSearchField;

		// common
		const commonSearchField = {};
		if (req.query.order) commonSearchField.order = req.query.order;
		if (Object.keys(commonSearchField).length > 0) searchFields.common = commonSearchField;

		// 리뷰 & 회원 & 강사 & 기관 & 필터 & 과목을 통한 강사 리뷰 목록 조회
		const reviews = await reviewService.getReviewsBySearchFields(searchFields, offset, limit, 'tutor', loginMemberId);

		// Return
		return res.json(!reviews ? null : { ...reviews, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 기관 페이지 실시간 평가
router.get(
	'/institute/:institute_id/real-time-evaluation',
	...reviewValidator.getRealTimeEvaluationInstituteReviewByInstituteId,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const { target } = req.query;
		const limit = req.query.limit ? req.query.limit : 15;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const instituteId = req.params.institute_id;
		const filterId = req.query.filter_id;

		if (target === 'csat') {
			// Best 강사 리뷰
			const bestTutorReview = await reviewService.getBestTutorNormalReviewByInstituteId(instituteId, false, memberId, filterId);
			// Best 강사 환승 리뷰
			const bestTutorTransferReview = await reviewService.getBestTutorTransferReviewByInstituteId(instituteId, false, memberId, filterId);
			// Best 기관 리뷰
			const bestInstituteReview = await reviewService.getBestInstituteNormalReviewByInstituteId(instituteId, false, memberId, filterId);
			// Best 기관 환승 리뷰
			const bestInstituteTransferReview = await reviewService.getBestInstituteTransferReviewByInstituteId(instituteId, false, memberId, filterId);
			// 최신 일반 리뷰 & 환승 리뷰 & 댓글
			const realTimeReviewAndComment = await reviewService.getRealTimeReviewAndComment(null, instituteId, 'institute', limit, memberId, filterId);
			if (bestTutorReview || bestTutorTransferReview || bestInstituteReview || bestInstituteTransferReview || realTimeReviewAndComment)
				response = {
					best_tutor_review: bestTutorReview || null,
					best_tutor_transfer_review: bestTutorTransferReview || null,
					best_institute_review: bestInstituteReview || null,
					best_institute_transfer_review: bestInstituteTransferReview || null,
					list: realTimeReviewAndComment || null,
				};
		} else if (target === 'non-csat') {
			// Best 강사 환승 리뷰
			const bestTransferReview = await reviewService.getBestTutorTransferReviewByInstituteId(instituteId, false, memberId, filterId);
			// Best 긍정 강사 리뷰
			const positiveBestNormalReview = await reviewService.getPositiveTutorBestNormalReviewByInstituteId(instituteId, false, memberId, filterId);
			// Best 부정 강사 리뷰
			const negativeBestNormalReview = await reviewService.getNegativeTutorBestNormalReviewByInstituteId(instituteId, false, memberId, filterId);
			// 최신 일반 리뷰 & 환승 리뷰 & 댓글
			const realTimeReviewAndComment = await reviewService.getRealTimeReviewAndComment(null, instituteId, 'tutor', limit, memberId, filterId);
			if (bestTransferReview || positiveBestNormalReview || negativeBestNormalReview || realTimeReviewAndComment)
				response = {
					best_transfer_review: bestTransferReview || null,
					positive_best_normal_review: positiveBestNormalReview || null,
					negative_best_normal_review: negativeBestNormalReview || null,
					list: realTimeReviewAndComment || null,
				};
		} else if (target === 'university') {
			// Best 강사 리뷰 2건
			const bestTutorReview = await reviewService.getBestTutorNormalReviewListByInstituteId(instituteId, false, 2, memberId, filterId);
			// 최신 일반 리뷰 & 환승리뷰 & 댓글
			const realTimeReviewAndComment = await reviewService.getRealTimeReviewAndComment(null, instituteId, 'tutor', limit, memberId, filterId);
			if (bestTutorReview || realTimeReviewAndComment) response = { best_tutor_reviews: bestTutorReview || null, list: realTimeReviewAndComment || null };
		} else if (target === 'kindergarten') {
			const reviewPage = 1;
			const reviewLimit = 2;
			const reviewOffset = await commonComponent.getOffset(reviewPage, reviewLimit);
			const boardPostPage = 1;
			const boardPostLimit = 20;
			const boardPostOffset = await commonComponent.getOffset(boardPostPage, boardPostLimit);

			// Best 리뷰 2건
			const bestInstituteReviews = await reviewService.getBestInstituteNormalReviewsByInstituteId(instituteId, memberId, filterId, reviewOffset, reviewLimit);
			// 게시물 목록 조회 처리
			const talkBoardPostAndComment = await boardService.getTalkBoardPostAndComment(instituteId, memberId, boardPostOffset, boardPostLimit);
			if (bestInstituteReviews) response = { best_institute_reviews: bestInstituteReviews || null, list: talkBoardPostAndComment || null };
		}

		// Return
		return res.json(response);
	}),
);

// 기관 인덱스로 기관 리뷰 조회
router.get(
	'/institute/:institute_id/institute/normal-review',
	...reviewValidator.getInstituteReviewByInstituteId,
	wrapAsyncRouter(async (req, res) => {
		const instituteId = req.params.institute_id;
		const filterId = req.query.filter_id;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const instituteTotalReview = await reviewService.getInstituteReviewCountByInstituteId(instituteId, filterId);
		const instituteReview = await reviewService.getInstituteReviewByInstituteId(instituteId, false, memberId, filterId);

		// Return
		return res.json(!instituteReview ? null : { total_review_count: instituteTotalReview, institute_review: instituteReview || null });
	}),
);

// 기관 인덱스로 강사 베스트 긍정 & 부정 리뷰 조회
router.get(
	'/institute/:institute_id/tutor/positive-negative-review',
	...reviewValidator.getPositiveAndNegativeTutorReviewByInstituteId,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const instituteId = req.params.institute_id;
		const filterId = req.query.filter_id;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const tutorTotalReview = await reviewService.getTutorReviewCountByInstituteId(instituteId, filterId);
		// 긍정 Best 강사 리뷰
		const positiveBestNormalReview = await reviewService.getPositiveTutorBestNormalReviewByInstituteId(instituteId, false, memberId, filterId);
		// 부정 Best 강사 리뷰
		const negativeBestNormalReview = await reviewService.getNegativeTutorBestNormalReviewByInstituteId(instituteId, false, memberId, filterId);
		if (positiveBestNormalReview || negativeBestNormalReview)
			response = { total_review_count: tutorTotalReview, positive_best_normal_review: positiveBestNormalReview || null, negative_best_normal_review: negativeBestNormalReview || null };

		// Return
		return res.json(response);
	}),
);

// 기관 인덱스로 강사 환승 베스트 리뷰 조회
router.get(
	'/institute/:institute_id/tutor/best-transfer-review',
	...reviewValidator.getBestTutorTransferReviewByInstituteId,
	wrapAsyncRouter(async (req, res) => {
		const instituteId = req.params.institute_id;
		const filterId = req.query.filter_id;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const tutorChangeTotalReview = await reviewService.getTutorChangeReviewCountByInstituteId(instituteId, filterId);
		const bestTutorTransferReview = await reviewService.getBestTutorTransferReviewByInstituteId(instituteId, false, memberId, filterId);

		// Return
		return res.json(!bestTutorTransferReview ? null : { total_review_count: tutorChangeTotalReview, best_tutor_transfer_review: bestTutorTransferReview || null });
	}),
);

// 기관 인덱스로 기관 환승 리뷰 조회
router.get(
	'/institute/:institute_id/institute/transfer-review',
	...reviewValidator.getInstituteTransferReviewByInstituteId,
	wrapAsyncRouter(async (req, res) => {
		const instituteId = req.params.institute_id;
		const filterId = req.query.filter_id;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const instituteChangeTotalReview = await reviewService.getInstituteChangeReviewCountByInstituteId(instituteId, filterId);
		const instituteTransferReview = await reviewService.getBestInstituteTransferReviewByInstituteId(instituteId, false, memberId, filterId);

		// Return
		return res.json(!instituteTransferReview ? null : { total_review_count: instituteChangeTotalReview, institute_transfer_review: instituteTransferReview || null });
	}),
);

// 기관 인덱스로 강사 리뷰 조회
router.get(
	'/institute/:institute_id/tutor/normal-review',
	...reviewValidator.getTutorReviewByInstituteId,
	wrapAsyncRouter(async (req, res) => {
		const instituteId = req.params.institute_id;
		const filterId = req.query.filter_id;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const tutorTotalReview = await reviewService.getTutorReviewCountByInstituteId(instituteId, filterId);
		const tutorReview = await reviewService.getBestTutorNormalReviewByInstituteId(instituteId, false, memberId, filterId);
		// Return
		return res.json(!tutorReview ? null : { total_review_count: tutorTotalReview, tutor_review: tutorReview || null });
	}),
);

// 기관 리뷰 조회
router.get(
	'/institute/:review_id',
	...reviewValidator.getInstituteReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const { ipAddress } = req;
		// 기관 리뷰 조회
		const instituteReview = await reviewService.getReviewByIdAndType(req.params.review_id, 'institute', memberId, ipAddress);

		// Return
		return res.json(!instituteReview ? null : { institute_review: instituteReview });
	}),
);

// 기관 리뷰 목록 조회
router.get(
	'/institute',
	...reviewValidator.getInstituteReviews,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청 변수 정리
		const searchFields = { review: { review_type: 'institute', is_deleted: 'N', is_confirm: ['Y', 'N'] } };

		// institute_reviews
		const instituteReviewSearchField = { filter_id: req.query.filter_id };
		if (req.query.institute_id) instituteReviewSearchField.institute_id = req.query.institute_id;
		// if (req.query.subject_id) instituteReviewSearchField['subject_id'] = req.query.subject_id;
		if (Object.keys(instituteReviewSearchField).length > 0) searchFields.institute_review = instituteReviewSearchField;

		// common
		const commonSearchField = {};
		if (req.query.order) commonSearchField.order = req.query.order;
		if (Object.keys(commonSearchField).length > 0) searchFields.common = commonSearchField;

		// 리뷰 & 회원 & 기관 & 필터 & 과목을 통한 기관 리뷰 목록 조회
		const reviews = await reviewService.getReviewsBySearchFields(searchFields, offset, limit, 'institute', loginMemberId);

		// Return
		return res.json(!reviews ? null : { ...reviews, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 강사 환승 리뷰 관련 정보 조회
router.get(
	'/tutor-change/:tutor_id/relation-info',
	...reviewValidator.getTutorChangeReviewRelationTutorsByTutorId,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const beforeLimit = req.query.before_limit ? req.query.before_limit : 3;
		const afterLimit = req.query.after_limit ? req.query.after_limit : 3;
		const filterId = req.query.filter_id;
		const { ipAddress } = req;

		const beforeTutors = await reviewService.getTutorChangeReviewRelationTutorsByTutorId(req.params.tutor_id, 'before', beforeLimit, filterId);
		const targetTutor = await tutorService.getTutorById(req.params.tutor_id, null, null, ipAddress);
		const afterTutors = await reviewService.getTutorChangeReviewRelationTutorsByTutorId(req.params.tutor_id, 'after', afterLimit, filterId);

		if (beforeTutors || targetTutor || afterTutors) response = { before_tutors: beforeTutors || null, target_tutor: targetTutor, after_tutors: afterTutors || null };

		// Return
		return res.json(response);
	}),
);

// 강사 환승 리뷰 조회
router.get(
	'/tutor-change/:review_id',
	...reviewValidator.getTutorChangeReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const { ipAddress } = req;

		// 강사 환승 리뷰 조회
		const tutorChangeReview = await reviewService.getReviewByIdAndType(req.params.review_id, 'tutor_change', memberId, ipAddress);

		// Return
		return res.json(!tutorChangeReview ? null : { tutor_change_review: tutorChangeReview });
	}),
);

// 강사 환승 리뷰 목록 조회
router.get(
	'/tutor-change',
	...reviewValidator.getTutorChangeReviews,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청 변수 정리
		const searchFields = { review: { review_type: 'tutor_change', is_deleted: 'N', is_confirm: ['Y', 'N'] } };

		// tutor_change_reviews
		const tutorChangeReviewSearchField = {};
		if (req.query.tutor_id) tutorChangeReviewSearchField.tutor_id = req.query.tutor_id;
		if (req.query.filter_id) tutorChangeReviewSearchField.filter_id = req.query.filter_id;
		// if (req.query.subject_id) tutorChangeReviewSearchField['subject_id'] = req.query.subject_id;
		if (Object.keys(tutorChangeReviewSearchField).length > 0) searchFields.tutor_change_review = tutorChangeReviewSearchField;

		// common
		const commonSearchField = {};
		if (req.query.order) commonSearchField.order = req.query.order;
		if (Object.keys(commonSearchField).length > 0) searchFields.common = commonSearchField;

		// 리뷰 & 회원 & 강사 & 기관 & 필터 & 과목을 통한 강사 리뷰 목록 조회
		const reviews = await reviewService.getReviewsBySearchFields(searchFields, offset, limit, 'tutor_change', loginMemberId);

		// Return
		return res.json(!reviews ? null : { ...reviews, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 기관 환승 리뷰 조회
router.get(
	'/institute-change/:review_id',
	...reviewValidator.getInstituteChangeReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const { ipAddress } = req;
		// 기관 환승 리뷰 조회
		const instituteChangeReview = await reviewService.getReviewByIdAndType(req.params.review_id, 'institute_change', memberId, ipAddress);

		// Return
		return res.json(!instituteChangeReview ? null : { institute_change_review: instituteChangeReview });
	}),
);

// 기관 환승 리뷰 목록 조회
router.get(
	'/institute-change',
	...reviewValidator.getInstituteChangeReviews,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const reviewType = 'institute_change';
		const searchFields = {};

		// 요청 변수 정리
		// reviews
		const reviewSearchField = { review_type: reviewType, is_deleted: 'N', is_confirm: ['Y', 'N'] };
		if (req.query.comment) reviewSearchField.comment = req.query.comment;
		if (Object.keys(reviewSearchField).length > 0) searchFields.review = reviewSearchField;

		// members
		const memberSearchField = {};
		if (req.query.member_id) memberSearchField.id = req.query.member_id;
		if (req.query.user_id) memberSearchField.user_id = req.query.user_id;
		if (req.query.nickname) memberSearchField.nickname = req.query.nickname;
		if (req.query.join_site) memberSearchField.join_site = req.query.join_site;
		if (req.query.join_type) memberSearchField.join_type = req.query.join_type;
		if (Object.keys(memberSearchField).length > 0) searchFields.member = memberSearchField;

		// before_institute
		const beforeInstituteSearchField = { is_deleted: 'N', is_confirm: ['Y'] };
		if (req.query.before_institute_id) beforeInstituteSearchField.id = req.query.before_institute_id;
		if (req.query.before_institute_name_ko) beforeInstituteSearchField.name_ko = req.query.before_institute_name_ko;
		if (req.query.before_institute_name_en) beforeInstituteSearchField.name_en = req.query.before_institute_name_en;
		if (req.query.before_institute_campus) beforeInstituteSearchField.campus = req.query.before_institute_campus;
		if (req.query.before_institute_type) beforeInstituteSearchField.type = req.query.before_institute_type;
		if (req.query.before_institute_has_online) beforeInstituteSearchField.has_online = req.query.before_institute_has_online;
		if (req.query.before_institute_has_review) beforeInstituteSearchField.has_review = req.query.before_institute_has_review;
		if (Object.keys(beforeInstituteSearchField).length > 0) searchFields.before_institute = beforeInstituteSearchField;

		// before_filters
		const beforeFilterSearchField = { is_deleted: 'N' };
		if (req.query.before_filter_id) beforeFilterSearchField.id = req.query.before_filter_id;
		if (req.query.before_filter_code) beforeFilterSearchField.code = req.query.before_filter_code;
		if (req.query.before_filter_name) beforeFilterSearchField.name = req.query.before_filter_name;
		if (Object.keys(beforeFilterSearchField).length > 0) searchFields.before_filter = beforeFilterSearchField;

		// before_subjects
		const beforeSubjectSearchField = { is_deleted: 'N' };
		if (req.query.before_subject_id) beforeSubjectSearchField.id = req.query.before_subject_id;
		if (req.query.before_subject_name) beforeSubjectSearchField.name = req.query.before_subject_name;
		if (req.query.before_subject_comment) beforeSubjectSearchField.comment = req.query.before_subject_comment;
		if (Object.keys(beforeSubjectSearchField).length > 0) searchFields.before_subject = beforeSubjectSearchField;

		// after_institute
		const afterInstituteSearchField = { is_deleted: 'N', is_confirm: ['Y'] };
		if (req.query.after_institute_id) afterInstituteSearchField.id = req.query.after_institute_id;
		if (req.query.after_institute_name_ko) afterInstituteSearchField.name_ko = req.query.after_institute_name_ko;
		if (req.query.after_institute_name_en) afterInstituteSearchField.name_en = req.query.after_institute_name_en;
		if (req.query.after_institute_campus) afterInstituteSearchField.campus = req.query.after_institute_campus;
		if (req.query.after_institute_type) afterInstituteSearchField.type = req.query.after_institute_type;
		if (req.query.after_institute_has_online) afterInstituteSearchField.has_online = req.query.after_institute_has_online;
		if (req.query.after_institute_has_review) afterInstituteSearchField.has_review = req.query.after_institute_has_review;
		if (Object.keys(afterInstituteSearchField).length > 0) searchFields.after_institute = afterInstituteSearchField;

		// after_filters
		const afterFilterSearchField = { is_deleted: 'N' };
		if (req.query.after_filter_id) afterFilterSearchField.id = req.query.after_filter_id;
		if (req.query.after_filter_code) afterFilterSearchField.code = req.query.after_filter_code;
		if (req.query.after_filter_name) afterFilterSearchField.name = req.query.after_filter_name;
		if (Object.keys(afterFilterSearchField).length > 0) searchFields.after_filter = afterFilterSearchField;

		// after_subjects
		const afterSubjectSearchField = { is_deleted: 'N' };
		if (req.query.after_subject_id) afterSubjectSearchField.id = req.query.after_subject_id;
		if (req.query.after_subject_name) afterSubjectSearchField.name = req.query.after_subject_name;
		if (req.query.after_subject_comment) afterSubjectSearchField.comment = req.query.after_subject_comment;
		if (Object.keys(afterSubjectSearchField).length > 0) searchFields.after_subject = afterSubjectSearchField;

		// 리뷰 & 회원 & 기관 & 필터 & 과목을 통한 강사 리뷰 목록 조회
		const reviews = await reviewService.getReviewsBySearchFields(searchFields, offset, limit, reviewType);

		// Return
		return res.json(!reviews ? null : { ...reviews, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 리뷰 추천
router.post(
	'/:review_id/recommend',
	...reviewValidator.postReviewRecommend,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const { ipAddress } = req;
		response = await reviewService.processReviewCount(req.params.review_id, 'recommend', memberId, ipAddress);

		// Return
		return res.json(response);
	}),
);

// 리뷰 비추천
router.post(
	'/:review_id/opposition',
	...reviewValidator.postReviewOpposition,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const { ipAddress } = req;
		response = await reviewService.processReviewCount(req.params.review_id, 'opposition', memberId, ipAddress);

		// Return
		return res.json(response);
	}),
);

// 리뷰 댓글 추천
router.post(
	'/comment/:review_comment_id/recommend',
	...reviewValidator.postReviewCommentRecommend,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		response = await reviewService.processReviewCommentCount(req.params.review_comment_id, 'recommend', memberId);

		// Return
		return res.json(response);
	}),
);

// 리뷰 댓글 비추천
router.post(
	'/comment/:review_comment_id/opposition',
	...reviewValidator.postReviewCommentOpposition,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		response = await reviewService.processReviewCommentCount(req.params.review_comment_id, 'opposition', memberId);

		// Return
		return res.json(response);
	}),
);

// 강사 리뷰 등록
router.post(
	'/tutor',
	...reviewValidator.postRegisterTutorReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청변수 정리
		// review
		const review = { member_id: memberId, review_type: 'tutor', is_deleted: 'N', is_confirm: 'REQUEST', created_ip: req.ipAddress };

		// tutor_review
		const tutorReview = { tutor_id: req.body.tutor_id, institute_id: req.body.institute_id, filter_id: req.body.filter_id, subject_id: req.body.subject_id };

		// tutor survey
		const tmpReviewSurveyData = JSON.parse(req.body.review_survey);
		const reviewSurveyArray = [];
		for (let i = 0; i < tmpReviewSurveyData.review_survey.length; i += 1) reviewSurveyArray.push(tmpReviewSurveyData.review_survey[i]);

		// 리뷰 등록
		const response = await reviewService.doRegisterReview(review, tutorReview, reviewSurveyArray);

		return res.json(!response ? null : { review: response });
	}),
);

// 기관 리뷰 등록
router.post(
	'/institute',
	...reviewValidator.postRegisterInstituteReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청변수 정리
		// review
		const review = { member_id: memberId, review_type: 'institute', is_deleted: 'N', is_confirm: 'REQUEST', created_ip: req.ipAddress };

		// institute_review
		const instituteReview = { institute_id: req.body.institute_id, filter_id: req.body.filter_id, subject_id: req.body.subject_id };

		// institute survey
		const tmpReviewSurveyData = JSON.parse(req.body.review_survey);
		const reviewSurveyArray = [];
		for (let i = 0; i < tmpReviewSurveyData.review_survey.length; i += 1) reviewSurveyArray.push(tmpReviewSurveyData.review_survey[i]);

		// 리뷰 등록
		const response = await reviewService.doRegisterReview(review, instituteReview, reviewSurveyArray);

		return res.json(!response ? null : { review: response });
	}),
);

// 강사 환승 리뷰 등록
router.post(
	'/tutor-change',
	...reviewValidator.postRegisterTutorChangeReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청변수 정리
		// review
		const review = { member_id: memberId, review_type: 'tutor_change', is_deleted: 'N', is_confirm: 'REQUEST', created_ip: req.ipAddress };

		// tutor_change_review
		const tutorChangeReview = {
			before_tutor_id: req.body.before_tutor_id,
			before_institute_id: req.body.before_institute_id,
			before_filter_id: req.body.before_filter_id,
			before_subject_id: req.body.before_subject_id,
			after_tutor_id: req.body.after_tutor_id,
			after_institute_id: req.body.after_institute_id,
			after_filter_id: req.body.after_filter_id,
			after_subject_id: req.body.after_subject_id,
		};

		// tutor change survey
		const tmpReviewSurveyData = JSON.parse(req.body.review_survey);
		const reviewSurveyArray = [];
		for (let i = 0; i < tmpReviewSurveyData.review_survey.length; i += 1) reviewSurveyArray.push(tmpReviewSurveyData.review_survey[i]);

		// 리뷰 등록
		const response = await reviewService.doRegisterReview(review, tutorChangeReview, reviewSurveyArray);

		return res.json(!response ? null : { review: response });
	}),
);

// 기관 환승 리뷰 등록
router.post(
	'/institute-change',
	...reviewValidator.postRegisterInstituteChangeReview,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청변수 정리
		// review
		const review = { member_id: memberId, review_type: 'institute_change', is_deleted: 'N', is_confirm: 'REQUEST', created_ip: req.ipAddress };

		// institute_change_review
		const instituteChangeReview = {
			before_institute_id: req.body.before_institute_id,
			before_filter_id: req.body.before_filter_id,
			before_subject_id: req.body.before_subject_id,
			after_institute_id: req.body.after_institute_id,
			after_filter_id: req.body.after_filter_id,
			after_subject_id: req.body.after_subject_id,
		};

		// institute change survey
		const tmpReviewSurveyData = JSON.parse(req.body.review_survey);
		const reviewSurveyArray = [];
		for (let i = 0; i < tmpReviewSurveyData.review_survey.length; i += 1) reviewSurveyArray.push(tmpReviewSurveyData.review_survey[i]);

		// 리뷰 등록
		const response = await reviewService.doRegisterReview(review, instituteChangeReview, reviewSurveyArray);

		return res.json(!response ? null : { review: response });
	}),
);

// 리뷰 댓글 목록 조회
router.get(
	'/:review_id/comment',
	...reviewValidator.getReviewComment,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const searchFields = { review_comment: { review_id: req.params.review_id, is_deleted: 'N' } };

		// 리뷰 댓글 목록 조회
		const reviewComments = await reviewService.getReviewCommentBySearchFields(searchFields, offset, limit, memberId);

		// Return
		return res.json(!reviewComments ? null : { ...reviewComments, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 리뷰 댓글 등록
router.post(
	'/:review_id/comment',
	...reviewValidator.postReviewComment,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// review_comment
		const reviewComment = {
			review_id: req.params.review_id,
			member_id: loginMemberId,
			nickname: req.body.nickname ? req.body.nickname : null,
			is_anonymous: req.body.is_anonymous ? req.body.is_anonymous : 'N',
			institute_id: req.body.institute_id,
			tutor_id: req.body.tutor_id ? req.body.tutor_id : null,
			parent_id: req.body.parent_id ? req.body.parent_id : null,
			is_deleted: 'N',
			created_ip: req.ipAddress,
			created_at: await commonComponent.nowDateTime(),
			updated_at: await commonComponent.nowDateTime(),
		};

		// review_comment_contents
		const reviewCommentContent = { title: req.body.title, content: req.body.content };
		// review_comment_counts
		const reviewCommentCount = { view: 0, recommend: 0, opposition: 0 };
		// 리뷰 댓글 등록
		const response = await reviewService.doRegisterReviewComment(reviewComment, reviewCommentContent, reviewCommentCount);

		return res.json(!response ? null : { review_comment: response });
	}),
);

// 리뷰 댓글 삭제
router.delete(
	'/comment/:review_comment_id',
	...reviewValidator.deleteReviewComment,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 리뷰 댓글 삭제
		await reviewService.deleteReviewCommentById(req.params.review_comment_id, loginMemberId);
		// Return
		return res.json(null);
	}),
);

// Lv0 페이지 지금 뜨는 리뷰
router.get(
	'/main-page/now',
	...reviewValidator.getMainPageNowReview,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const response = await reviewService.getMainPageNowReview(loginMemberId);

		// Return
		return res.json(!response ? null : { list: response });
	}),
);

// Lv0 페이지 리뷰 Live 20
router.get(
	'/main-page/live',
	...reviewValidator.getMainPageLiveReview,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const response = await reviewService.getMainPageLiveReview(loginMemberId);

		// Return
		return res.json(!response ? null : { list: response });
	}),
);

// Lv1 페이지 리뷰 조회
router.get(
	'/main-page',
	...reviewValidator.getMainPageReview,
	cache('5 minutes'),
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 요청 변수 정리
		const filterId = req.query.filter_id;
		const reviewType = req.query.review_type;
		const pageType = req.query.page_type;
		const reviewAttitudeDivision = req.query.review_attitude_division;
		const regionId = req.query.region_id ? req.query.region_id : null;
		const minPoint = null;
		let maxPoint = null;
		const order = 'last_at';
		let limit = 1;

		// 로그인한 회원의 인덱스
		let loginMemberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) loginMemberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 비수능 강사 부정 일반 리뷰
		if (pageType === 'non-csat' && reviewType === 'tutor' && reviewAttitudeDivision === 'negative') maxPoint = 70000;

		// 비수능 강사 부정 환승 리뷰
		if (pageType === 'non-csat' && reviewType === 'tutor_change' && reviewAttitudeDivision === 'negative') maxPoint = 70000;

		// 교수 리뷰 조회
		if (pageType === 'professor') limit = 5;

		// 유치원 리뷰 조회
		if (pageType === 'kindergarten') limit = 5;

		// 수능 강사 & 강사환승 & 기관 & 기관환승 리뷰 조회
		if (pageType === 'csat') response = null;

		const searchFields = { review_attitude_division: reviewAttitudeDivision, filter_id: filterId, region_id: regionId, min_point: minPoint, max_point: maxPoint, order };

		// 리뷰 조회
		if (Object.keys(searchFields).length > 0) response = await reviewService.getMainPageReviewByReviewTypeAndSearchFields(pageType, reviewType, loginMemberId, searchFields, limit);

		// Return
		return res.json(!response ? null : { reviews: response });
	}),
);

export default router;
