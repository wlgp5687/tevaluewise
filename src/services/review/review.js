import { sequelize } from '../../database';
import { throwError } from '..';

import * as tutorComponent from '../../component/tutor/tutor';
import * as instituteComponent from '../../component/institute/institute';
import * as reviewComponent from '../../component/review/review';
import * as filterComponent from '../../component/filter/filter';
import * as regionComponent from '../../component/region/region';
import * as statisticsComponent from '../../component/statistics/statistics';
import * as commonComponent from '../../component/common';

// 리뷰 인덱스 존재여부 확인
export const isExistReviewId = async (reviewId) => {
	const response = await reviewComponent.isExistReviewId(reviewId);
	return response;
};

// 리뷰 선택형 질문
export const isValidReviewQuestionId = async (reviewQuestionId) => {
	const response = await reviewComponent.isValidReviewQuestionId(reviewQuestionId);
	return response;
};

// 리뷰 선택형 답변
export const isValidReviewChoiceId = async (reviewAnswerChoiceId) => {
	const response = await reviewComponent.isValidReviewChoiceId(reviewAnswerChoiceId);
	return response;
};

/**
 * 리뷰 정성 평가 인덱스로 답변 변위 조회
 * @param {Int} reviewAnswerPointId
 * @param {Int} answer
 */
export const isValidReviewAnswerPoint = async (reviewAnswerPointId, answer) => {
	const response = await reviewComponent.getReviewAnswerPointRangeByReviewAnswerPointId(reviewAnswerPointId);
	return response.min_point <= answer || response.max_point >= answer ? true : false; // eslint-disable-line no-unneeded-ternary
};

/**
 * @description 리뷰 질문 필터 인덱스 존재 여부 확인
 * @param {Int} reviewQuestionFilterId
 */
export const isExistReviewQuestionFilterId = async (reviewQuestionFilterId) => {
	const response = await reviewComponent.isExistReviewQuestionFilterId(reviewQuestionFilterId);
	return response;
};

// 리뷰 정성 평가 인덱스 존재 여부 확인
export const isExistReviewAnswerTextId = async (reviewAnswerTextId) => {
	const response = await reviewComponent.isExistReviewAnswerTextId(reviewAnswerTextId);
	return response;
};

// 리뷰 정량 평가 인덱스 존재 여부 확인
export const isExistReviewAnswerPointId = async (reviewAnswerPointId) => {
	const response = await reviewComponent.isExistReviewAnswerPointId(reviewAnswerPointId);
	return response;
};

// 리뷰 년도 답변 인덱스 존재 여부 확인
export const isExistReviewAnswerYearId = async (reviewAnswerYearId) => {
	const response = await reviewComponent.isExistReviewAnswerYearId(reviewAnswerYearId);
	return response;
};

// 리뷰 선택형 답변 인덱스 존재 여부 확인
export const isExistReviewAnswerChoiceId = async (reviewAnswerChoiceId) => {
	const response = await reviewComponent.isExistReviewAnswerChoiceId(reviewAnswerChoiceId);
	return response;
};

// 리뷰 댓글 인덱스 존재여부 확인
export const isExistReviewCommentId = async (reviewCommentId) => {
	const response = await reviewComponent.isExistReviewCommentId(reviewCommentId);
	return response;
};

// 리뷰 열람 권한 존재여부 확인
export const isExistReviewAuth = async (memberId) => {
	const response = await reviewComponent.isExistReviewAuth(memberId);
	return response;
};

// 리뷰 열람 권한 인덱스 존재여부 확인
export const isExistReviewAuthId = async (reviewAuthId) => {
	const response = await reviewComponent.isExistReviewAuthId(reviewAuthId);
	return response;
};

// 리뷰 답변 추가
export const addReviewAnswers = async (reviewId, reviewSurveyArray, t) => {
	// 리뷰에 대한 답변
	for (let i = 0; i < reviewSurveyArray.length; i += 1) {
		const questionId = reviewSurveyArray[i].question_id;
		const answerType = reviewSurveyArray[i].answer_type;
		const collectionQuestionId = reviewSurveyArray[i].collection_question_id;
		const collectionAnswerId = reviewSurveyArray[i].collection_answer_id;
		const isCollection = reviewSurveyArray[i].is_collection;
		const { answer } = reviewSurveyArray[i];
		let isBranch = false;

		// validation
		if (i > 0 && isCollection === 'Y') {
			// check prevQuestion and collectionQuestion
			if (collectionQuestionId === reviewSurveyArray[i - 1].question_id && collectionAnswerId.includes(String(reviewSurveyArray[i - 1].answer))) isBranch = true;
		} else {
			isBranch = true;
		}

		if (isBranch) {
			// eslint-disable-next-line no-await-in-loop
			const reviewAnswerId = await reviewComponent.addReviewAnswers({ review_id: reviewId, review_question_id: questionId }, true, t);

			switch (answerType) {
				case 'point':
					// eslint-disable-next-line no-await-in-loop
					await reviewComponent.addReviewAnswerPoint({ review_answer_id: reviewAnswerId, point: parseInt(answer, 10) }, false, t);
					break;
				case 'text':
					// eslint-disable-next-line no-await-in-loop
					await reviewComponent.addReviewAnswerText({ review_answer_id: reviewAnswerId, answer }, false, t);
					break;
				case 'choice':
					// eslint-disable-next-line no-await-in-loop
					await reviewComponent.addReviewAnswerChoice({ review_answer_id: reviewAnswerId, review_question_choice_id: parseInt(answer, 10) }, false, t);
					break;
				case 'year':
					// eslint-disable-next-line no-await-in-loop
					await reviewComponent.addReviewAnswerYear({ review_answer_id: reviewAnswerId, answer: parseInt(answer, 10) }, false, t);
					break;
				case 'region':
					// eslint-disable-next-line no-await-in-loop
					await reviewComponent.addReviewAnswerRegion({ review_answer_id: reviewAnswerId, region_id: parseInt(answer, 10) }, false, t);
					break;
				default:
					throwError('Invalid review answer type error', 400);
					break;
			}
		}
	}
	// Return
	return true;
};

// 타입에 따른 리뷰 등록
export const doRegisterReview = async (reviewParam, reviewByTypeParam, reviewSurveyArray) => {
	let response = null;
	const review = reviewParam;
	const reviewByType = reviewByTypeParam;

	await sequelize.transaction(async (t) => {
		// 리뷰 평점 계산
		review.average_point = await calculateReviewRating(reviewByType.institute_id, review.review_type, reviewByType.filter_id, reviewSurveyArray);
		// 리뷰 기본정보 추가
		const reviewData = await reviewComponent.addReview(review, false, t);

		// 리뷰 카운트 추가
		await reviewComponent.addReviewCount({ review_id: reviewData.id, recommend: 0, opposition: 0, view: 0 }, false, t);

		// 타입에 따른 리뷰 추가
		reviewByType.review_id = reviewData.id;

		switch (review.review_type) {
			case 'tutor':
				await reviewComponent.addTutorReview(reviewByType, false, t);
				await tutorComponent.postPlusReviewCount(reviewByType.tutor_id, t);
				await instituteComponent.postPlusReviewCount(reviewByType.institute_id, t);
				break;
			case 'institute':
				await reviewComponent.addInstituteReview(reviewByType, false, t);
				await instituteComponent.postPlusReviewCount(reviewByType.institute_id, t);
				break;
			case 'tutor_change':
				await reviewComponent.addTutorChangeReview(reviewByType, false, t);
				await tutorComponent.postPlusReviewCount(reviewByType.before_tutor_id, t);
				await instituteComponent.postPlusReviewCount(reviewByType.before_institute_id, t);
				await tutorComponent.postPlusReviewCount(reviewByType.after_tutor_id, t);
				await instituteComponent.postPlusReviewCount(reviewByType.after_institute_id, t);
				break;
			case 'institute_change':
				await reviewComponent.addInstituteChangeReview(reviewByType, false, t);
				await instituteComponent.postPlusReviewCount(reviewByType.before_institute_id, t);
				await instituteComponent.postPlusReviewCount(reviewByType.after_institute_id, t);
				break;
			default:
				throwError("Invalid 'review_type'.", 400);
				break;
		}

		// 리뷰에 대한 답변
		await addReviewAnswers(reviewData.id, reviewSurveyArray, t);
		response = reviewData;
	});

	return response;
};

// 리뷰 조회수 증가
export const addReviewViewCount = async (reviewId, memberId = null, ipAddress) => {
	// 리뷰 조회수 로그 조회
	const viewLog = await reviewComponent.getCheckReviewLog(reviewId, memberId, ipAddress);
	if (viewLog === 0) {
		await sequelize.transaction(async (t) => {
			// 리뷰 조회수 증가
			await reviewComponent.postPlusReviewViewCount(reviewId, t);
			// 리뷰 조회수 로그 작성
			await reviewComponent.postReviewCountLog(reviewId, 'view', memberId, ipAddress, false, t);
		});
	}
};

// 리뷰 Id 와 타입에 따른 리뷰 조회
export const getReviewByIdAndType = async (reviewId, reviewType, memberId = null, ipAddress) => {
	let review = null;
	switch (reviewType) {
		case 'tutor':
			review = await reviewComponent.getTutorReviewById(reviewId);
			break;
		case 'institute':
			review = await reviewComponent.getInstituteReviewById(reviewId);
			break;
		case 'tutor_change':
			review = await reviewComponent.getTutorChangeReviewById(reviewId);
			break;
		case 'institute_change':
			review = await reviewComponent.getInstituteChangeReviewById(reviewId);
			break;
		default:
			throwError("Invalid 'review_type'.", 400);
			break;
	}

	if (review) {
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];

		review.dataValues.review_question_answer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);

		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;

		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;

		// review view count
		await addReviewViewCount(reviewId, memberId, ipAddress);
	}

	// Return
	return review;
};

// 검색 항목에 따른 리뷰 조회
export const getReviewsBySearchFields = async (searchFields, offset = 0, limit = 10, type, loginMemberId = null) => {
	let reviews = null;
	switch (type) {
		case 'tutor':
			reviews = await reviewComponent.getTutorReviewsBySearchFields(searchFields, offset, limit);
			break;
		case 'institute':
			reviews = await reviewComponent.getInstituteReviewsBySearchFields(searchFields, offset, limit);
			break;
		case 'tutor_change':
			reviews = await reviewComponent.getTutorChangeReviewsBySearchFields(searchFields, offset, limit);
			break;
		case 'institute_change':
			reviews = await reviewComponent.getInstituteChangeReviewsBySearchFields(searchFields, offset, limit);
			break;
		default:
			throwError("Invalid 'review_type'.", 400);
			break;
	}

	if (reviews) {
		const reviewList = reviews.list;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		const relationInstitute = [];
		let commentCount = 0;
		let lastCreateComment = null;
		for (let i = 0; i < reviewList.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(reviewList[i].dataValues.id);
			reviews.list[i].dataValues.review_question_answer = reivewQuestionAnswer;
			if (loginMemberId) {
				isRecommend = await reviewComponent.isExistReviewRecommend(reviewList[i].dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
				isOpposition = await reviewComponent.isExistReviewOpposition(reviewList[i].dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
			}
			commentCount = await reviewComponent.getReviewCommentCountByReviewId(reviewList[i].dataValues.id); // eslint-disable-line no-await-in-loop
			if (commentCount > 0) {
				lastCreateComment = await reviewComponent.getLastCreateReviewCommentByReviewId(reviewList[i].dataValues.id); // eslint-disable-line no-await-in-loop
			}

			// 강사 회원의 경우 강사 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (reviewList[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(reviewList[i].dataValues.member_id);
			// 기관 회원의 경우 기관 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (reviewList[i].dataValues.member.dataValues.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(reviewList[i].dataValues.member_id);

			reviews.list[i].dataValues.is_recommend = isRecommend;
			reviews.list[i].dataValues.is_opposition = isOpposition;
			reviews.list[i].dataValues.comment_count = commentCount;
			reviews.list[i].dataValues.last_comment = lastCreateComment;
			reviews.list[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			reviews.list[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}
	// Return
	return reviews;
};

// TutorId 로 Best 강사 환승 리뷰 조회
export const getBestTutorTransferReviewByTutorId = async (tutorId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getBestTutorTransferReviewByTutorId(tutorId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		const relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.dataValues.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);

		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}
	// Return
	return response;
};

// TutorId 로 Best 긍정 강사 리뷰 조회
export const getPositiveTutorBestNormalReviewByTutorId = async (tutorId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getPositiveTutorBestNormalReviewByTutorId(tutorId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		const relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.dataValues.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);

		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}
	// Return
	return response;
};

// TutorId 로 Best 부정 강사 리뷰
export const getNegativeTutorBestNormalReviewByTutorId = async (tutorId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getNegativeTutorBestNormalReviewByTutorId(tutorId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		const relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.dataValues.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);

		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}
	// Return
	return response;
};

// InstituteId 로 기관 리뷰 조회
export const getInstituteReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getInstituteReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}

	return response;
};

// InstituteId 로 Best 강사 리뷰 목록 조회
export const getBestTutorNormalReviewListByInstituteId = async (instituteId, isTitleOnly = false, limit = 2, memberId = null, filterId) => {
	const response = [];
	const reviews = await reviewComponent.getBestTutorNormalReviewListByInstituteId(instituteId, limit, filterId);

	if (reviews) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		for (let i = 0; i < reviews.length; i += 1) {
			if (isTitleOnly) {
				// eslint-disable-next-line no-await-in-loop
				reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(reviews[i].dataValues.id);
				reviews[i].dataValues.review_question_answer = [reivewQuestionAnswer];
				response[i] = reviews[i].dataValues;
			} else {
				// eslint-disable-next-line no-await-in-loop
				reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(reviews[i].dataValues.id);
				reviews[i].dataValues.review_question_answer = reivewQuestionAnswer;
				response[i] = reviews[i].dataValues;
			}
			if (memberId) {
				isRecommend = await reviewComponent.isExistReviewRecommend(reviews[i].dataValues.id, memberId); // eslint-disable-line no-await-in-loop
				isOpposition = await reviewComponent.isExistReviewOpposition(reviews[i].dataValues.id, memberId); // eslint-disable-line no-await-in-loop
			}
			// 강사 회원의 경우 강사 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (reviews[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(reviews[i].dataValues.member_id);
			// 기관 회원의 경우 기관 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (reviews[i].dataValues.member.dataValues.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(reviews[i].dataValues.member_id);
			reviews[i].dataValues.is_recommend = isRecommend;
			reviews[i].dataValues.is_opposition = isOpposition;
			reviews[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			reviews[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}

	// Return
	return Object.keys(response).length > 0 ? response : null;
};

// InstituteId 로 Best 강사 리뷰 조회
export const getBestTutorNormalReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getBestTutorNormalReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];

		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);

		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}

	// Return
	return response;
};

// InstituteId 로 Best 강사 환승 리뷰 조회
export const getBestTutorTransferReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getBestTutorTransferReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}

	// Return
	return response;
};

// InstituteId 로 Best 기관 리뷰 조회
export const getBestInstituteNormalReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getBestInstituteNormalReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;

		response = review.dataValues;
	}

	// Return
	return response;
};

// InstituteId 로 Best 기관 리뷰 목록 조회
export const getBestInstituteNormalReviewsByInstituteId = async (instituteId, memberId = null, filterId, offset = 0, limit = 10) => {
	let response = null;
	const reviews = await reviewComponent.getBestInstituteNormalReviewsByInstituteId(instituteId, filterId, offset, limit);

	if (reviews) {
		for (let i = 0; i < reviews.length; i += 1) {
			let reivewQuestionAnswer = null;
			let isRecommend = false;
			let isOpposition = false;
			let relationTutor = [];
			let relationInstitute = [];
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(reviews[i].dataValues.id); // eslint-disable-line no-await-in-loop
			reviews[i].dataValues.review_question_answer = reivewQuestionAnswer;

			if (memberId) {
				isRecommend = await reviewComponent.isExistReviewRecommend(reviews[i].dataValues.id, memberId); // eslint-disable-line no-await-in-loop
				isOpposition = await reviewComponent.isExistReviewOpposition(reviews[i].dataValues.id, memberId); // eslint-disable-line no-await-in-loop
			}
			// 강사 회원의 경우 강사 회원 정보 조회
			if (reviews[i].dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(reviews[i].dataValues.member_id); // eslint-disable-line no-await-in-loop
			// 기관 회원의 경우 기관 회원 정보 조회
			if (reviews[i].dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(reviews[i].dataValues.member_id); // eslint-disable-line no-await-in-loop
			reviews[i].dataValues.is_recommend = isRecommend;
			reviews[i].dataValues.is_opposition = isOpposition;
			reviews[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			reviews[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}

		response = reviews;
	}

	// Return
	return response;
};

// InstituteId 로 Best 기관 환승 리뷰 조회
export const getBestInstituteTransferReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getBestInstituteTransferReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}

	// Return
	return response;
};

// InstituteId 로 강사 긍정 Best 리뷰 조회
export const getPositiveTutorBestNormalReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getPositiveTutorBestNormalReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}

	// Return
	return response;
};

// InstituteId 로 강사 부정 Best 리뷰 조회
export const getNegativeTutorBestNormalReviewByInstituteId = async (instituteId, isTitleOnly = false, memberId = null, filterId) => {
	let response = null;
	const review = await reviewComponent.getNegativeTutorBestNormalReviewByInstituteId(instituteId, filterId);

	if (review) {
		let reivewQuestionAnswer = null;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		let relationInstitute = [];
		if (isTitleOnly) {
			reivewQuestionAnswer = await reviewComponent.getReviewTitleByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = [reivewQuestionAnswer];
			response = review.dataValues;
		} else {
			reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			response = review.dataValues;
		}
		if (memberId) {
			isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId);
			isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId);
		}
		// 강사 회원의 경우 강사 회원 정보 조회
		if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
		// 기관 회원의 경우 기관 회원 정보 조회
		if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
		review.dataValues.is_recommend = isRecommend;
		review.dataValues.is_opposition = isOpposition;
		review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
		review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
	}

	// Return
	return response;
};

// TutorId 또는 InstituteId 로 타입에 따른 실시간 리뷰 및 댓글 조회
export const getRealTimeReviewAndComment = async (tutorId, instituteId, target, limit = 15, memberId, filterId) => {
	let response = null;
	let reviewAndCommentList = null;

	if (target === 'tutor') reviewAndCommentList = await reviewComponent.getTutorRealTimeReviewAndComment(tutorId, instituteId, limit, filterId);
	if (target === 'institute') reviewAndCommentList = await reviewComponent.getInstituteRealTimeReviewAndComment(tutorId, instituteId, limit, filterId);

	if (reviewAndCommentList) {
		const tmpData = [];
		for (let i = 0; i < reviewAndCommentList.length; i += 1) {
			const reviewType = reviewAndCommentList[i].review_type;
			let reivewQuestionAnswer = null;
			let isRecommend = false;
			let isOpposition = false;
			let relationTutor = [];
			const relationInstitute = [];

			switch (reviewType) {
				case 'tutor':
				case 'tutor_change':
				case 'institute':
				case 'institute_change':
					// eslint-disable-next-line no-await-in-loop, no-case-declarations
					const review = await reviewComponent.getRealTimeReviewByIdAndType(reviewAndCommentList[i].review_id, reviewType, filterId);

					if (memberId) {
						isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, memberId); // eslint-disable-line no-await-in-loop
						isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, memberId); // eslint-disable-line no-await-in-loop
					}
					// 강사 회원의 경우 강사 회원 정보 조회
					// eslint-disable-next-line no-await-in-loop
					if (review.dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
					// 기관 횐원의 경우 기관 회원 정보 조회
					// eslint-disable-next-line no-await-in-loop
					if (review.dataValues.member.dataValues.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);
					// 리뷰 질의 조회
					reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id); // eslint-disable-line no-await-in-loop

					tmpData[i] = {
						review_id: review.dataValues.id,
						comment_id: null,
						member_id: review.dataValues.member_id,
						type: review.dataValues.review_type,
						is_confirm: review.dataValues.is_confirm,
						average_point: review.dataValues.average_point,
						created_at: review.dataValues.created_at,
						member: {
							user_id: review.dataValues.member.dataValues.user_id,
							nickname: review.dataValues.member.dataValues.nickname,
							join_site: review.dataValues.member.dataValues.join_site,
							join_type: review.dataValues.member.dataValues.join_type,
							join_ip: review.dataValues.member.dataValues.join_ip,
							attribute: {
								name: review.dataValues.member.dataValues.attribute.dataValues.name,
								sex: review.dataValues.member.dataValues.attribute.dataValues.sex,
								birthday: review.dataValues.member.dataValues.attribute.dataValues.birthday,
								email: review.dataValues.member.dataValues.attribute.dataValues.email,
								phone: review.dataValues.member.dataValues.attribute.dataValues.phone,
								thumbnail: review.dataValues.member.dataValues.attribute.dataValues.thumbnail,
							},
							relation_tutor: Object.keys(relationTutor).length > 0 ? relationTutor : null,
							relation_institute: Object.keys(relationInstitute).length > 0 ? relationInstitute : null,
						},
						count: {
							recommend: review.dataValues.count.dataValues.recommend,
							opposition: review.dataValues.count.dataValues.opposition,
						},
						content: {
							title: review.dataValues.review_question_answer[0].dataValues.review_question.dataValues.question,
							content: review.dataValues.review_question_answer[0].dataValues.review_answer.dataValues.answer,
						},
						review_question_answer: reivewQuestionAnswer,
						is_recommend: isRecommend,
						is_opposition: isOpposition,
					};
					break;
				case 'comment':
					// eslint-disable-next-line no-await-in-loop, no-case-declarations
					const comment = await reviewComponent.getReviewCommentByReviewCommentId(reviewAndCommentList[i].comment_id);
					if (memberId) {
						isRecommend = await reviewComponent.isExistReviewCommentRecommend(comment.dataValues.id, memberId); // eslint-disable-line no-await-in-loop
						isOpposition = await reviewComponent.isExistReviewCommentOpposition(comment.dataValues.id, memberId); // eslint-disable-line no-await-in-loop
					}
					tmpData[i] = {
						review_id: comment.dataValues.review_id,
						comment_id: comment.dataValues.id,
						member_id: comment.dataValues.member_id,
						type: comment.dataValues.review.dataValues.review_type,
						average_point: comment.dataValues.review.dataValues.average_point,
						created_at: comment.dataValues.created_at,
						member: {
							user_id: comment.dataValues.member.dataValues.user_id,
							nickname: comment.dataValues.member.dataValues.nickname,
							join_site: comment.dataValues.member.dataValues.join_site,
							join_type: comment.dataValues.member.dataValues.join_type,
							join_ip: comment.dataValues.member.dataValues.join_ip,
							attribute: {
								name: comment.dataValues.member.dataValues.attribute.dataValues.name,
								sex: comment.dataValues.member.dataValues.attribute.dataValues.sex,
								birthday: comment.dataValues.member.dataValues.attribute.dataValues.birthday,
								email: comment.dataValues.member.dataValues.attribute.dataValues.email,
								phone: comment.dataValues.member.dataValues.attribute.dataValues.phone,
								thumbnail: comment.dataValues.member.dataValues.attribute.dataValues.thumbnail,
							},
						},
						count: {
							recommend: comment.dataValues.count.dataValues.recommend,
							opposition: comment.dataValues.count.dataValues.opposition,
						},
						content: {
							title: comment.dataValues.content.dataValues.title,
							content: comment.dataValues.content.dataValues.content,
						},
						is_recommend: isRecommend,
						is_opposition: isOpposition,
					};
					break;
				default:
					throwError("Invalid 'review_type'", 400);
					break;
			}
			response = tmpData;
		}
	}

	return response;
};

// 리뷰 추천 & 비추천 프로세스
export const processReviewCount = async (reviewId, type, memberId, ipAddress) => {
	let response = null;
	// 이전에 추천 & 비추천 리뷰가 있는지를 확인
	const isRecommend = await reviewComponent.isExistReviewCountLog(reviewId, type, memberId);

	await sequelize.transaction(async (t) => {
		// 이전 리뷰가 있는 경우
		if (isRecommend) {
			// validation
			if ((isRecommend.dataValues.type === 'opposition' && type === 'recommend') || (isRecommend.dataValues.type === 'recommend' && type === 'opposition'))
				throwError('Previous request exists', 400);

			// 리뷰 추천 & 비추천 취소 처리
			await reviewComponent.deleteReviewCountLog(reviewId, type, memberId, t);

			// 리뷰 카운트 감소
			if (type === 'recommend') await reviewComponent.postMinusReviewRecommend(reviewId, t);
			if (type === 'opposition') await reviewComponent.postMinusReviewOpposition(reviewId, t);
		} else {
			// 리뷰 추천 & 비추천
			response = await reviewComponent.postReviewCountLog(reviewId, type, memberId, ipAddress, false, t);

			// 리뷰 카운트 증가
			if (type === 'recommend') await reviewComponent.postPlusReviewRecommend(reviewId, t);
			if (type === 'opposition') await reviewComponent.postPlusReviewOpposition(reviewId, t);
		}
	});

	// Return
	return response;
};

// 리뷰 댓글 추천 & 비추천 프로세스
export const processReviewCommentCount = async (reviewCommentId, type, memberId) => {
	let response = null;
	// 이전에 추천 & 비추천 리뷰 댓글이 있는지를 확인
	const isRecommend = await reviewComponent.isExistReviewCommentCountLog(reviewCommentId, memberId);

	await sequelize.transaction(async (t) => {
		// 이전 리뷰 댓글이 있는 경우
		if (isRecommend) {
			// validation
			if ((isRecommend.dataValues.type === 'opposition' && type === 'recommend') || (isRecommend.dataValues.type === 'recommend' && type === 'opposition'))
				throwError('Previous request exists', 400);

			// 리뷰 댓글 추천 & 비추천 취소 처리
			await reviewComponent.deleteReviewCommentCountLog(reviewCommentId, type, memberId, t);

			// 리뷰 댓글 카운트 감소
			if (type === 'recommend') await reviewComponent.postMinusReviewCommentRecommend(reviewCommentId, t);
			if (type === 'opposition') await reviewComponent.postMinusReviewCommentOpposition(reviewCommentId, t);
		} else {
			// 리뷰 댓글 추천 & 비추천
			response = await reviewComponent.postReviewCommentCountLog(reviewCommentId, type, memberId, false, t);

			// 리뷰 댓글 카운트 증가
			if (type === 'recommend') await reviewComponent.postPlusReviewCommentRecommend(reviewCommentId, t);
			if (type === 'opposition') await reviewComponent.postPlusReviewCommentOpposition(reviewCommentId, t);
		}
	});

	// Return
	return response;
};

/** @TODO 강사 인덱스와 과목 인덱스에 따른 강사 리뷰 관련 정보 조회 ( 랭킹 이후 추가 작업 ) */
export const getTutorReviewRelationInfoByTutorIdAndSubjectId = async (tutorId, subjectId, filterId) => {
	let response = null;

	// 강사 인덱스와 과목 인덱스에 따른 리뷰 갯수 조회
	const reviewCount = await reviewComponent.getTutorReviewByTutorIdAndSubjectId(tutorId, subjectId, filterId);
	// 리뷰 분포 ( 긍정리뷰, 보통리뷰, 부정리뷰 수 )
	const reviewDistribution = {
		positive_review_count: await reviewComponent.getPositiveTutorReviewCountByTutorIdAndSubjectId(tutorId, subjectId, filterId),
		negative_review_count: await reviewComponent.getNegativeTutorReviewCountByTutorIdAndSubjectId(tutorId, subjectId, filterId),
		normal_review_count: await reviewComponent.getNormalTutorReviewCountByTutorIdAndSubjectId(tutorId, subjectId, filterId),
	};
	/** @TODO 오각형 요소 디테일 */
	const pentagonInfo = {
		tutor: {
			unknown: 5,
			recommendation: 4,
			materials: 3,
			students_communication: 2,
			humor_immersion: 1,
			improve_grade_hit_rate: 2,
			facility: 3,
			study_environment: 4,
			school_expenses: 0,
			difficulty: 0,
			test_frequency: 0,
			plan_agreement: 0,
			meeting_rate: 0,
			kindergarten_principal: 0,
			kindergarten_teacher: 0,
			safe: 0,
			time_adjustment: 0,
		},
		subject_average: {
			unknown: 3,
			recommendation: 2,
			materials: 5,
			students_communication: 4,
			humor_immersion: 2,
			improve_grade_hit_rate: 1,
			facility: 2,
			study_environment: 4,
			school_expenses: 0,
			difficulty: 0,
			test_frequency: 0,
			plan_agreement: 0,
			meeting_rate: 0,
			kindergarten_principal: 0,
			kindergarten_teacher: 0,
			safe: 0,
			time_adjustment: 0,
		},
	};

	response = { review_count: reviewCount, grage_point_average: gragePointAverage, review_distribution: reviewDistribution, pentagon_info: pentagonInfo };

	// Return
	return response;
};

// 강사 환승 리뷰 관련 정보 조회
export const getTutorChangeReviewRelationTutorsByTutorId = async (tutorId, type, limit, filterId) => {
	let response = null;
	let changeTutorIds = null;
	if (type === 'before') {
		// 해당 강사로 변경을 많이한 강사 조회
		changeTutorIds = await reviewComponent.getBeforeChangeTutorIdAndCountByTutorId(tutorId, limit, filterId);
	} else if (type === 'after') {
		// 해당 강사에서 변경을 많이한 강사 조회
		changeTutorIds = await reviewComponent.getAfterChangeTutorIdAndCountByTutorId(tutorId, limit, filterId);
	} else {
		throwError("Invalid 'type'", 400);
	}

	if (changeTutorIds) {
		const tmpData = [];
		for (let i = 0; i < changeTutorIds.length; i += 1) {
			const changeTutorId = type === 'before' ? changeTutorIds[i].dataValues.before_tutor_id : changeTutorIds[i].dataValues.after_tutor_id;
			const tutorCount = type === 'before' ? changeTutorIds[i].dataValues.before_tutor_count : changeTutorIds[i].dataValues.after_tutor_count;
			const tutor = await tutorComponent.getTutorById(changeTutorId); // eslint-disable-line no-await-in-loop
			if (tutor && tutorCount) tmpData[i] = { tutor, review_count: tutorCount };
		}
		response = Object.keys(tmpData).length > 0 ? tmpData : null;
	}

	// Return
	return response;
};

// 강사 인덱스로 강사 총 리뷰 수 조회
export const getTutorReviewCountByTutorId = async (tutorId, filterId) => {
	const response = await reviewComponent.getTutorReviewCountByTutorId(tutorId, filterId);
	return response;
};

// 강사 인덱스로 강사 환승 총 리뷰 수 조회
export const getTutorChangeReviewCountByTutorId = async (tutorId, filterId) => {
	const response = await reviewComponent.getTutorChangeReviewCountByTutorId(tutorId, filterId);
	return response;
};

// 기관 인덱스로 강사 총 리뷰 수 조회
export const getTutorReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await reviewComponent.getTutorReviewCountByInstituteId(instituteId, filterId);
	return response;
};

// 기관 인덱스로 강사 환승 총 리뷰 수 조회
export const getTutorChangeReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await reviewComponent.getTutorChangeReviewCountByInstituteId(instituteId, filterId);
	return response;
};

// 기관 인덱스로 기관 총 리뷰 수 조회
export const getInstituteReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await reviewComponent.getInstituteReviewCountByInstituteId(instituteId, filterId);
	return response;
};

// 기관 인덱스로 기관 환승 총 리뷰 수 조회
export const getInstituteChangeReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await reviewComponent.getInstituteChangeReviewCountByInstituteId(instituteId, filterId);
	return response;
};

// 검색 항목에 따른 리뷰 댓글 목록 조회
export const getReviewCommentBySearchFields = async (searchFields, offset = 0, limit = 10, loginMemberId) => {
	const comments = await reviewComponent.getReviewCommentBySearchFields(searchFields, offset, limit);

	if (comments) {
		const commentList = comments.list;
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		const relationInstitute = [];
		for (let i = 0; i < commentList.length; i += 1) {
			if (loginMemberId) {
				isRecommend = await reviewComponent.isExistReviewCommentRecommend(commentList[i].id, loginMemberId); // eslint-disable-line no-await-in-loop
				isOpposition = await reviewComponent.isExistReviewCommentOpposition(commentList[i].id, loginMemberId); // eslint-disable-line no-await-in-loop
			}
			// 강사 회원의 경우 강사 회원 정보 조회
			if (commentList[i].member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(commentList[i].member_id); // eslint-disable-line no-await-in-loop
			// 기관 회원의 경우 기관 회원 정보 조회
			if (commentList[i].member.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(commentList[i].member_id); // eslint-disable-line no-await-in-loop
			commentList[i].is_recommend = isRecommend;
			commentList[i].is_opposition = isOpposition;
			commentList[i].member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			commentList[i].member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
		}
	}

	return comments;
};

// 리뷰 댓글 등록
export const doRegisterReviewComment = async (reviewCommentParam, reviewCommentContentParam, reviewCommentCountParam) => {
	let response = null;
	const reviewComment = reviewCommentParam;
	const reviewCommentContent = reviewCommentContentParam;
	const reviewCommentCount = reviewCommentCountParam;

	await sequelize.transaction(async (t) => {
		// root 댓글의 경우
		if (reviewComment.parent_id == null) {
			const depthOneLastSortComment = await reviewComponent.getReviewCommentDapthOneLastSortNoByReviewId(reviewComment.review_id);
			reviewComment.family = null;
			reviewComment.sort_no = depthOneLastSortComment ? parseInt(depthOneLastSortComment.dataValues.sort_no, 10) + parseInt(1, 10) : parseInt(1, 10);
			reviewComment.depth = 1;
		} else {
			const parentComment = await reviewComponent.getReviewCommentByReviewCommentId(reviewComment.parent_id);
			if (!parentComment) throwError("Invalid 'parent_id'", 400);
			reviewComment.family = parentComment.dataValues.family ? parentComment.dataValues.family : parentComment.dataValues.id;
			reviewComment.sort_no = parseInt(parentComment.dataValues.sort_no, 10) + parseInt(1, 10);
			reviewComment.depth = parseInt(parentComment.dataValues.depth, 10) + parseInt(1, 10);
			const familyCount = await reviewComponent.getReviewFamilyCountByFamily(parentComment.dataValues.family ? parentComment.dataValues.family : parentComment.dataValues.id);
			if (familyCount > 1)
				await reviewComponent.updateReviewCommentSortNo(parentComment.dataValues.family ? parentComment.dataValues.family : parentComment.dataValues.id, parentComment.dataValues.sort_no);
		}

		// 리뷰에 대한 댓글 등록
		const reviewCommentData = await reviewComponent.addReviewComment(reviewComment, false, t);

		// 리뷰 내용 등록
		await reviewComponent.addreviewCommentContent({ ...reviewCommentContent, review_comment_id: reviewCommentData.dataValues.id }, false, t);

		// 리뷰 조회수 및 추천수 등록
		await reviewComponent.addReviewCommentCount({ ...reviewCommentCount, review_comment_id: reviewCommentData.dataValues.id }, false, t);

		response = reviewCommentData;
	});

	// root 리뷰 정보 업데이트 처리
	if (reviewComment.parent_id == null) await reviewComponent.updateReviewCommentByCommentId({ id: response.dataValues.id, family: response.dataValues.id });

	return response;
};

// 리뷰 댓글 삭제
export const deleteReviewCommentById = async (reviewCommentId, loginMemberId) => {
	const response = await reviewComponent.deleteReviewCommentById(reviewCommentId, loginMemberId);
	return response;
};

// Lv0 페이지 지금 뜨는 리뷰
export const getMainPageNowReview = async (loginMemberId = null) => {
	const response = [];

	// 종류별 리뷰 조회
	const tutorReivew = await reviewComponent.getReviewsByTypeAndConfirm('tutor', 'Y', 1);
	const tutorChangeReview = await reviewComponent.getReviewsByTypeAndConfirm('tutor_change', 'Y', 1);
	const instituteReview = await reviewComponent.getReviewsByTypeAndConfirm('institute', 'Y', 1);
	const instituteChangeReview = await reviewComponent.getReviewsByTypeAndConfirm('institute_change', 'Y', 1);

	if (tutorReivew && tutorChangeReview && instituteReview && instituteChangeReview) {
		const tmpList = [tutorReivew[0], tutorChangeReview[0], instituteReview[0], instituteChangeReview[0]];
		for (let i = 0; i < tmpList.length; i += 1) {
			let review = null;
			const reviewId = tmpList[i].dataValues.id;
			const reviewType = tmpList[i].dataValues.review_type;
			switch (reviewType) {
				case 'tutor':
					review = await reviewComponent.getTutorReviewById(reviewId); // eslint-disable-line no-await-in-loop
					break;
				case 'tutor_change':
					review = await reviewComponent.getTutorChangeReviewById(reviewId); // eslint-disable-line no-await-in-loop
					break;
				case 'institute':
					review = await reviewComponent.getInstituteReviewById(reviewId); // eslint-disable-line no-await-in-loop
					break;
				case 'institute_change':
					review = await reviewComponent.getInstituteChangeReviewById(reviewId); // eslint-disable-line no-await-in-loop
					break;
				default:
					throwError("Invalid 'review_type'.", 400);
					break;
			}

			// eslint-disable-next-line no-await-in-loop
			const commentCount = await reviewComponent.getReviewCommentCountByReviewId(review.dataValues.id);
			let isRecommend = false;
			let isOpposition = false;
			let relationTutor = [];
			let relationInstitute = [];

			// eslint-disable-next-line no-await-in-loop
			const reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id);
			if (loginMemberId) {
				isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
				isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
			}
			// 강사 회원의 경우 강사 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
			// 기관 회원의 경우 기관 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);

			review.dataValues.is_recommend = isRecommend;
			review.dataValues.is_opposition = isOpposition;
			review.dataValues.comment_count = commentCount;
			review.dataValues.review_question_answer = reivewQuestionAnswer;
			review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			response[i] = review;
		}
	}

	// Return
	return Object.keys(response).length > 0 ? response : null;
};

// Lv0 페이지 리뷰 Live 20
export const getMainPageLiveReview = async (loginMemberId = null) => {
	const response = [];
	let tmpList = [];
	const requestReviewCount = 4;
	let approveReviewCount = 9;
	const rejectReviewCount = 4;
	const reviewCommentCount = 3;

	// 대기중인 리뷰 4개
	const requestReviews = await reviewComponent.getReviewsByTypeAndConfirm(null, 'REQUEST', requestReviewCount);
	if (!requestReviews) approveReviewCount = 13;
	// 승인된 리뷰 9개
	const approveReviews = await reviewComponent.getReviewsByTypeAndConfirm(null, 'Y', approveReviewCount);
	// 반려된 리뷰 4개
	const rejectReviews = await reviewComponent.getReviewsByTypeAndConfirm(null, 'N', rejectReviewCount);
	// 댓글 3개
	const reviewComments = await reviewComponent.getReviewComments(reviewCommentCount);

	// 조건이 전부 일치하는 경우
	if (approveReviews && rejectReviews && reviewComments) {
		if (requestReviews) {
			tmpList = [
				requestReviews[0], // 대기중인 리뷰
				approveReviews[0], // 승인된 리뷰
				approveReviews[1], // 승인된 리뷰
				rejectReviews[0], // 반려된 리뷰
				reviewComments[0], // 댓글
				requestReviews[1], // 대기중인 리뷰
				approveReviews[2], // 승인된 리뷰
				rejectReviews[1], // 반려된 리뷰
				approveReviews[3], // 승인된 리뷰
				requestReviews[2], // 대기중인 리뷰
				reviewComments[1], // 댓글
				approveReviews[4], // 승인된 리뷰
				approveReviews[5], // 승인된 리뷰
				requestReviews[3], // 대기중인 리뷰
				rejectReviews[2], // 반려된 리뷰
				reviewComments[2], // 댓글
				approveReviews[6], // 승인된 리뷰
				rejectReviews[3], // 반려된 리뷰
				approveReviews[7], // 승인된 리뷰
				approveReviews[8], // 승인된 리뷰
			];
		} else if (!requestReviews) {
			tmpList = [
				approveReviews[0], // 승인된 리뷰
				approveReviews[1], // 승인된 리뷰
				approveReviews[2], // 승인된 리뷰
				rejectReviews[0], // 반려된 리뷰
				reviewComments[0], // 댓글
				approveReviews[3], // 승인된 리뷰
				approveReviews[4], // 승인된 리뷰
				rejectReviews[1], // 반려된 리뷰
				approveReviews[5], // 승인된 리뷰
				approveReviews[6], // 승인된 리뷰
				reviewComments[1], // 댓글
				approveReviews[7], // 승인된 리뷰
				approveReviews[8], // 승인된 리뷰
				approveReviews[9], // 승인된 리뷰
				rejectReviews[2], // 반려된 리뷰
				reviewComments[2], // 댓글
				approveReviews[10], // 승인된 리뷰
				rejectReviews[3], // 반려된 리뷰
				approveReviews[11], // 승인된 리뷰
				approveReviews[12], // 승인된 리뷰
			];
		}

		for (let i = 0; i < tmpList.length; i += 1) {
			// 리뷰
			if (['tutor', 'tutor_change', 'institute', 'institute_change'].includes(String(tmpList[i].dataValues.review_type))) {
				let review = null;
				const reviewId = tmpList[i].dataValues.id;
				const reviewType = tmpList[i].dataValues.review_type;
				switch (reviewType) {
					case 'tutor':
						review = await reviewComponent.getTutorReviewById(reviewId); // eslint-disable-line no-await-in-loop
						break;
					case 'tutor_change':
						review = await reviewComponent.getTutorChangeReviewById(reviewId); // eslint-disable-line no-await-in-loop
						break;
					case 'institute':
						review = await reviewComponent.getInstituteReviewById(reviewId); // eslint-disable-line no-await-in-loop
						break;
					case 'institute_change':
						review = await reviewComponent.getInstituteChangeReviewById(reviewId); // eslint-disable-line no-await-in-loop
						break;
					default:
						throwError("Invalid 'review_type'.", 400);
						break;
				}

				const commentCount = await reviewComponent.getReviewCommentCountByReviewId(review.dataValues.id); // eslint-disable-line no-await-in-loop
				let isRecommend = false;
				let isOpposition = false;
				let relationTutor = [];
				let relationInstitute = [];

				const reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(review.dataValues.id); // eslint-disable-line no-await-in-loop
				if (loginMemberId) {
					isRecommend = await reviewComponent.isExistReviewRecommend(review.dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
					isOpposition = await reviewComponent.isExistReviewOpposition(review.dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
				}
				// 강사 회원의 경우 강사 회원 정보 조회
				// eslint-disable-next-line no-await-in-loop
				if (review.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(review.dataValues.member_id);
				// 기관 회원의 경우 기관 회원 정보 조회
				// eslint-disable-next-line no-await-in-loop
				if (review.dataValues.member.join_type === 'institute') relationInstitute = await instituteComponent.getMemberRelationInstituteByMemberId(review.dataValues.member_id);

				review.dataValues.is_recommend = isRecommend;
				review.dataValues.is_opposition = isOpposition;
				review.dataValues.comment_count = commentCount;
				review.dataValues.review_question_answer = reivewQuestionAnswer;
				review.dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
				review.dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
				response[i] = review;
				// 댓글
			} else {
				let comment = null;
				const commentId = tmpList[i].dataValues.id;
				comment = await reviewComponent.getReviewCommentByReviewCommentId(commentId); // eslint-disable-line no-await-in-loop

				let isRecommend = false;
				let isOpposition = false;
				let relationTutor = [];
				const relationInstitute = [];
				const reviewType = comment.dataValues.review.review_type;
				let baseReview = null;

				switch (reviewType) {
					case 'tutor':
						baseReview = await reviewComponent.getTutorReviewById(comment.dataValues.review_id); // eslint-disable-line no-await-in-loop
						break;
					case 'institute':
						baseReview = await reviewComponent.getInstituteReviewById(comment.dataValues.review_id); // eslint-disable-line no-await-in-loop
						break;
					case 'tutor_change':
						baseReview = await reviewComponent.getTutorChangeReviewById(comment.dataValues.review_id); // eslint-disable-line no-await-in-loop
						break;
					case 'institute_change':
						baseReview = await reviewComponent.getInstituteChangeReviewById(comment.dataValues.review_id); // eslint-disable-line no-await-in-loop
						break;
					default:
						throwError("Invalid 'review_type'", 400);
						break;
				}

				if (loginMemberId) {
					isRecommend = await reviewComponent.isExistReviewCommentRecommend(comment.dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
					isOpposition = await reviewComponent.isExistReviewCommentOpposition(comment.dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
				}
				// 강사 회원의 경우 강사 회원 정보 조회
				// eslint-disable-next-line no-await-in-loop
				if (comment.dataValues.member.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(comment.dataValues.member_id);
				// 기관 회원의 경우 기관 회원 정보 조회
				// eslint-disable-next-line no-await-in-loop
				if (comment.dataValues.member.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(comment.dataValues.member_id);

				comment.dataValues.is_recommend = isRecommend;
				comment.dataValues.is_opposition = isOpposition;
				comment.dataValues.member.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
				comment.dataValues.member.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
				delete comment.dataValues.review;
				comment.dataValues.base_review = baseReview;

				response[i] = comment;
			}
		}
	}

	// Return
	return Object.keys(response).length > 0 ? response : null;
};

// 검색필터에 따른 메인페이지 리뷰 조회
export const getMainPageReviewByReviewTypeAndSearchFields = async (pageType, reviewType, loginMemberId = null, searchFields, limit = 1) => {
	let response = null;
	let reviews = [];

	// 비수능 강사 부정 일반 리뷰
	if (pageType === 'non-csat' && reviewType === 'tutor') reviews = await reviewComponent.getMainPageTutorNormalReviewsBySearchFields(searchFields, limit);

	// 비수능 강사 부정 환승 리뷰
	if (pageType === 'non-csat' && reviewType === 'tutor_change') reviews = await reviewComponent.getMainPageTutorChangeReviewsBySearchFields(searchFields, limit);

	// 교수 강사 리뷰 조회
	if (pageType === 'professor') reviews = await reviewComponent.getMainPageTutorNormalReviewsBySearchFields(searchFields, limit);

	// 유치원 리뷰 조회
	if (pageType === 'kindergarten') reviews = await reviewComponent.getMainPageInstituteNormalReviewsBySearchFields(searchFields, limit);

	// 수능 강사 & 강사환승 & 기관 & 기관환승 리뷰 조회
	if (pageType === 'csat') {
		/**
		 * @DESC : 지역에 소속된 기관을 기준으로 리뷰를 조회합니다.
		 * 3 depth 지역의 경우 해당 지역의 리뷰를 우선적으로 검색 후 해당 지역의 리뷰가 없는 경우 2depth 레벨의 리뷰를 조회합니다.
		 * 1 depth 지역 레벨로 조회하는 경우 2depth 까지의 2 depth 지역 레벨로 조회하는 경우 3 depth 까지의 지역 레벨을 포함하는 검색을 진행합니다.
		 */
		let regionIds = [];
		let instituteIds = [];
		let tutorReview = null;
		let tutorChangeReview = null;
		let instituteReview = null;
		let instituteChangeReview = null;
		let tempReview = null;

		// 지역에 소속된 기관을 기준으로 리뷰를 조회합니다.
		if (searchFields.region_id) {
			const region = await regionComponent.getRegionById(searchFields.region_id);
			let targetRegionId = searchFields.region_id;
			// 3depth 인 경우
			if ((await commonComponent.getLengthByCritertiaNumber(region.dataValues.code, 4)) === 3) {
				// 승인된 강사 리뷰 Last_at 조회
				tutorReview = await reviewComponent.getLastTutorReviewBySearchFieldsAndInstituteIds(searchFields, [region.dataValues.id]);
				// 승인된 강사 환승 리뷰 Last_at 조회
				tutorChangeReview = await reviewComponent.getLastTutorChangeReviewBySearchFieldsAndInstituteIds(searchFields, [region.dataValues.id]);
				// 승인된 기관 리뷰 Last_at 조회
				instituteReview = await reviewComponent.getLastInstituteReviewBySearchFieldsAndInstituteIds(searchFields, [region.dataValues.id]);
				// 승인된 기관 환승 리뷰 Last_at 조회
				instituteChangeReview = await reviewComponent.getLastInstituteChangeReviewBySearchFieldsAndInstituteIds(searchFields, [region.dataValues.id]);
				if (!tutorReview && !tutorChangeReview && !instituteReview && !instituteChangeReview) targetRegionId = region.dataValues.parent_id;
			}

			if (!tutorReview && !tutorChangeReview && !instituteReview && !instituteChangeReview) {
				// 하위 지역 Ids 정보 조회
				regionIds = await regionComponent.getSubRegionIdsByRegionId(targetRegionId);
				instituteIds = await instituteComponent.getInstituteIdsByRegionIds(regionIds);

				// 승인된 강사 리뷰 Last_at 조회
				tutorReview = await reviewComponent.getLastTutorReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
				// 승인된 강사 환승 리뷰 Last_at 조회
				tutorChangeReview = await reviewComponent.getLastTutorChangeReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
				// 승인된 기관 리뷰 Last_at 조회
				instituteReview = await reviewComponent.getLastInstituteReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
				// 승인된 기관 환승 리뷰 Last_at 조회
				instituteChangeReview = await reviewComponent.getLastInstituteChangeReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
			}
		} else {
			// 승인된 강사 리뷰 Last_at 조회
			tutorReview = await reviewComponent.getLastTutorReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
			// 승인된 강사 환승 리뷰 Last_at 조회
			tutorChangeReview = await reviewComponent.getLastTutorChangeReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
			// 승인된 기관 리뷰 Last_at 조회
			instituteReview = await reviewComponent.getLastInstituteReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
			// 승인된 기관 환승 리뷰 Last_at 조회
			instituteChangeReview = await reviewComponent.getLastInstituteChangeReviewBySearchFieldsAndInstituteIds(searchFields, instituteIds);
		}

		if (tempReview == null && tutorReview) tempReview = tutorReview;
		if (tempReview == null && tutorChangeReview) tempReview = tutorChangeReview;
		if (tempReview == null && instituteReview) tempReview = instituteReview;
		if (tempReview == null && instituteChangeReview) tempReview = instituteChangeReview;

		if (tutorReview && tutorReview.dataValues.created_at > tempReview.dataValues.created_at) tempReview = tutorReview;
		if (tutorChangeReview && tutorChangeReview.dataValues.created_at > tempReview.dataValues.created_at) tempReview = tutorChangeReview;
		if (instituteReview && instituteReview.dataValues.created_at > tempReview.dataValues.created_at) tempReview = instituteReview;
		if (instituteChangeReview && instituteChangeReview.dataValues.created_at > tempReview.dataValues.created_at) tempReview = instituteChangeReview;

		if (tempReview == null) {
			reviews = [];
		} else {
			reviews[0] = tempReview;
		}
	}

	if (Object.keys(reviews).length > 0) {
		let isRecommend = false;
		let isOpposition = false;
		let relationTutor = [];
		const relationInstitute = [];
		const commentCount = 0;
		for (let i = 0; i < reviews.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const reivewQuestionAnswer = await reviewComponent.getReviewQuestionAndAnswerByReviewId(reviews[i].dataValues.id);
			if (loginMemberId) {
				isRecommend = await reviewComponent.isExistReviewRecommend(reviews[i].dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
				isOpposition = await reviewComponent.isExistReviewOpposition(reviews[i].dataValues.id, loginMemberId); // eslint-disable-line no-await-in-loop
			}

			// 강사 회원의 경우 강사 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (reviews[i].dataValues.member.dataValues.join_type === 'tutor') relationTutor = await tutorComponent.getMemberRelationTutorByMemberId(reviews[i].dataValues.member_id);
			// 기관 회원의 경우 기관 회원 정보 조회
			// eslint-disable-next-line no-await-in-loop
			if (reviews[i].dataValues.member.dataValues.join_type === 'institute') relationTutor = await instituteComponent.getMemberRelationInstituteByMemberId(reviews[i].dataValues.member_id);

			reviews[i].dataValues.is_recommend = isRecommend;
			reviews[i].dataValues.is_opposition = isOpposition;
			reviews[i].dataValues.comment_count = commentCount;
			reviews[i].dataValues.member.dataValues.relation_tutor = Object.keys(relationTutor).length > 0 ? relationTutor : null;
			reviews[i].dataValues.member.dataValues.relation_institute = Object.keys(relationInstitute).length > 0 ? relationInstitute : null;
			reviews[i].dataValues.review_question_answer = reivewQuestionAnswer;
		}
		response = reviews;
	}

	// Return
	return response;
};
