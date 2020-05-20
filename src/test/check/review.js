import * as common from '../component/common';

// reviews check
export const checkReview = (review) => {
	if (review.id) expect(typeof review.id).toEqual('number');
	if (review.review_type) expect(typeof review.review_type).toEqual('string');
	if (review.is_deleted) expect(common.agreementCheck(review.is_deleted)).toEqual(true);
	if (review.is_confirm) expect(common.confirmCheck(review.is_confirm)).toEqual(true);
	if (review.denied_comment) expect(typeof review.denied_comment).toEqual('string');
	if (review.average_point) expect(typeof review.average_point).toEqual('number');
	if (review.created_ip) expect(typeof review.created_ip).toEqual('string');

	return null;
};

// review_questions check
export const checkReviewQuestion = (reviewQuestion) => {
	if (reviewQuestion.id) expect(typeof reviewQuestion.id).toEqual('number');
	if (reviewQuestion.answer_type) expect(common.answerTypeCheck(reviewQuestion.answer_type)).toEqual(true);
	if (reviewQuestion.question) expect(typeof reviewQuestion.question).toEqual('string');
	if (reviewQuestion.placeholder) expect(typeof reviewQuestion.placeholder).toEqual('string');
	if (reviewQuestion.text_answer_type) expect(common.textAnserTypeCheck(reviewQuestion.text_answer_type)).toEqual(true);
	if (reviewQuestion.pentagon) expect(common.pentagonCheck(reviewQuestion.pentagon)).toEqual(true);
	if (reviewQuestion.collection_qeustion_id) expect(typeof reviewQuestion.collection_qeustion_id).toEqual('number');
	if (reviewQuestion.collection_answer_id) expect(typeof reviewQuestion.collection_answer_id).toEqual('object');
	if (reviewQuestion.min_point) expect(typeof reviewQuestion.min_point).toEqual('number');
	if (reviewQuestion.max_point) expect(typeof reviewQuestion.max_point).toEqual('number');
	if (reviewQuestion.is_collection) expect(common.agreementCheck(reviewQuestion.is_collection)).toEqual(true);
	if (reviewQuestion.is_deleted) expect(common.agreementCheck(reviewQuestion.is_deleted)).toEqual(true);
	if (reviewQuestion.total_answer_count) expect(typeof reviewQuestion.total_answer_count).toEqual('number');
	if (reviewQuestion.total_point_answer_count) expect(typeof reviewQuestion.total_point_answer_count).toEqual('number');

	return null;
};

// review_question_filters check
export const checkReviewQuestionFilter = (reviewQuestionFilter) => {
	if (reviewQuestionFilter.id) expect(typeof reviewQuestionFilter.id).toEqual('number');
	if (reviewQuestionFilter.review_question_id) expect(typeof reviewQuestionFilter.review_question_id).toEqual('number');
	if (reviewQuestionFilter.filter_id) expect(typeof reviewQuestionFilter.filter_id).toEqual('number');
	if (reviewQuestionFilter.review_type) expect(common.reviewTypeCheck(reviewQuestionFilter.review_type)).toEqual(true);
	if (reviewQuestionFilter.sort) expect(typeof reviewQuestionFilter.sort).toEqual('number');
	if (reviewQuestionFilter.step) expect(typeof reviewQuestionFilter.step).toEqual('number');
	if (reviewQuestionFilter.is_deleted) expect(common.agreementCheck(reviewQuestionFilter.is_deleted)).toEqual(true);

	return null;
};

// review_question_choices check
export const checkReviewQuestionChoice = (reviewQuestionChoice) => {
	if (reviewQuestionChoice.id) expect(typeof reviewQuestionChoice.id).toEqual('number');
	if (reviewQuestionChoice.review_question_id) expect(typeof reviewQuestionChoice.review_question_id).toEqual('number');
	if (reviewQuestionChoice.answer) expect(typeof reviewQuestionChoice.answer).toEqual('string');
	if (reviewQuestionChoice.is_deleted) expect(common.agreementCheck(reviewQuestionChoice.is_deleted)).toEqual(true);

	return null;
};

// review_answers check
export const checkReviewAnswer = (reviewAnswer) => {
	if (reviewAnswer.id) expect(typeof reviewAnswer.id).toEqual('number');
	if (reviewAnswer.review_id) expect(typeof reviewAnswer.review_id).toEqual('number');
	if (reviewAnswer.review_question_id) expect(typeof reviewAnswer.review_question_id).toEqual('number');
	return null;
};

// review_answer_points check
export const checkReviewAnswerPoint = (reviewAnswerPoint) => {
	if (reviewAnswerPoint.id) expect(typeof reviewAnswerPoint.id).toEqual('number');
	if (reviewAnswerPoint.review_answer_id) expect(typeof reviewAnswerPoint.review_answer_id).toEqual('number');
	if (reviewAnswerPoint.point) expect(typeof reviewAnswerPoint.point).toEqual('number');
	return null;
};

// review_answer_years check
export const checkReviewAnswerYear = (reviewAnswerYear) => {
	if (reviewAnswerYear.id) expect(typeof reviewAnswerYear.id).toEqual('number');
	if (reviewAnswerYear.review_answer_id) expect(typeof reviewAnswerYear.review_answer_id).toEqual('number');
	if (reviewAnswerYear.answer) expect(typeof reviewAnswerYear.answer).toEqual('number');
	return null;
};

// review_answer_choices check
export const checkReviewAnswerChoice = (reviewAnswerChoice) => {
	if (reviewAnswerChoice.id) expect(typeof reviewAnswerChoice.id).toEqual('number');
	if (reviewAnswerChoice.review_answer_id) expect(typeof reviewAnswerChoice.review_answer_id).toEqual('number');
	if (reviewAnswerChoice.review_question_choice_id) expect(typeof reviewAnswerChoice.review_question_choice_id).toEqual('number');
	return null;
};

// review_answer_regions check
export const checkReviewAnswerRegion = (reviewAnswerRegion) => {
	if (reviewAnswerRegion.id) expect(typeof reviewAnswerRegion.id).toEqual('number');
	if (reviewAnswerRegion.review_answer_id) expect(typeof reviewAnswerRegion.review_answer_id).toEqual('number');
	if (reviewAnswerRegion.region_id) expect(typeof reviewAnswerRegion.region_id).toEqual('number');
	return null;
};

// review_answer_texts check
export const checkReviewAnswerText = (reviewAnswerText) => {
	if (reviewAnswerText.id) expect(typeof reviewAnswerText.id).toEqual('number');
	if (reviewAnswerText.review_answer_id) expect(typeof reviewAnswerText.review_answer_id).toEqual('number');
	if (reviewAnswerText.answer) expect(typeof reviewAnswerText.answer).toEqual('string');
	return null;
};

// review_counts check
export const checkReviewCount = (reviewCount) => {
	if (reviewCount.review_id) expect(typeof reviewCount.review_id).toEqual('number');
	if (reviewCount.recommend) expect(typeof reviewCount.recommend).toEqual('number');
	if (reviewCount.opposition) expect(typeof reviewCount.opposition).toEqual('number');
	if (reviewCount.view) expect(typeof reviewCount.view).toEqual('number');

	return null;
};

// review_count_logs check
export const checkReviewCountLog = (reviewCountLog) => {
	if (reviewCountLog.review_id) expect(typeof reviewCountLog.review_id).toEqual('number');
	if (reviewCountLog.type) expect(typeof reviewCountLog.type).toEqual('number');
	if (reviewCountLog.member_id) expect(typeof reviewCountLog.member_id).toEqual('number');

	return null;
};

// review_comments check
export const checkReviewComment = (reviewComment) => {
	if (reviewComment.id) expect(typeof reviewComment.id).toEqual('number');
	if (reviewComment.review_id) expect(typeof reviewComment.review_id).toEqual('number');
	if (reviewComment.member_id) expect(typeof reviewComment.member_id).toEqual('number');
	if (reviewComment.nickname) expect(typeof reviewComment.nickname).toEqual('string');
	if (reviewComment.is_anonymous) expect(typeof reviewComment.is_anonymous).toEqual('string');
	if (reviewComment.institute_id) expect(typeof reviewComment.institute_id).toEqual('number');
	if (reviewComment.tutor_id) expect(typeof reviewComment.tutor_id).toEqual('number');
	if (reviewComment.family) expect(typeof reviewComment.family).toEqual('number');
	if (reviewComment.sort_no) expect(typeof reviewComment.sort_no).toEqual('number');
	if (reviewComment.parent_id) expect(typeof reviewComment.parent_id).toEqual('number');
	if (reviewComment.depth) expect(typeof reviewComment.depth).toEqual('number');
	if (reviewComment.is_deleted) expect(common.agreementCheck(reviewComment.is_deleted)).toEqual(true);
	if (reviewComment.created_ip) expect(typeof reviewComment.created_ip).toEqual('string');

	return null;
};

// review_comment_counts check
export const checkReviewCommentCount = (reviewCommentCount) => {
	if (reviewCommentCount.review_comment_id) expect(typeof reviewCommentCount.review_comment_id).toEqual('number');
	if (reviewCommentCount.recommend) expect(typeof reviewCommentCount.recommend).toEqual('number');
	if (reviewCommentCount.opposition) expect(typeof reviewCommentCount.opposition).toEqual('number');
	if (reviewCommentCount.view) expect(typeof reviewCommentCount.view).toEqual('number');

	return null;
};

// review_comment_count_logs check
export const checkReviewCommentCountLog = (reviewCommentCountLog) => {
	if (reviewCommentCountLog.review_id) expect(typeof reviewCommentCountLog.review_id).toEqual('number');
	if (reviewCommentCountLog.type) expect(typeof reviewCommentCountLog.type).toEqual('number');
	if (reviewCommentCountLog.member_id) expect(typeof reviewCommentCountLog.member_id).toEqual('number');

	return null;
};

// review_comment_contents check
export const checkReviewCommentContent = (reviewCommentContent) => {
	if (reviewCommentContent.review_comment_id) expect(typeof reviewCommentContent.review_comment_id).toEqual('number');
	if (reviewCommentContent.title) expect(typeof reviewCommentContent.title).toEqual('string');
	if (reviewCommentContent.content) expect(typeof reviewCommentContent.content).toEqual('string');

	return null;
};

// tutor_review check
export const checkTutorReview = (tutorReview) => {
	if (tutorReview.review_id) expect(typeof tutorReview.review_id).toEqual('number');
	if (tutorReview.tutor_id) expect(typeof tutorReview.tutor_id).toEqual('number');
	if (tutorReview.institute_id) expect(typeof tutorReview.institute_id).toEqual('number');
	if (tutorReview.subject_id) expect(typeof tutorReview.subject_id).toEqual('number');
	if (tutorReview.filter_id) expect(typeof tutorReview.filter_id).toEqual('number');

	return null;
};

// tutor_change_review check
export const checkTutorChangeReview = (tutorChangeReview) => {
	if (tutorChangeReview.review_id) expect(typeof tutorChangeReview.review_id).toEqual('number');
	if (tutorChangeReview.before_tutor_id) expect(typeof tutorChangeReview.before_tutor_id).toEqual('number');
	if (tutorChangeReview.after_tutor_id) expect(typeof tutorChangeReview.after_tutor_id).toEqual('number');
	if (tutorChangeReview.before_institute_id) expect(typeof tutorChangeReview.before_institute_id).toEqual('number');
	if (tutorChangeReview.after_institute_id) expect(typeof tutorChangeReview.after_institute_id).toEqual('number');
	if (tutorChangeReview.before_subject_id) expect(typeof tutorChangeReview.before_subject_id).toEqual('number');
	if (tutorChangeReview.after_subject_id) expect(typeof tutorChangeReview.after_subject_id).toEqual('number');
	if (tutorChangeReview.before_filter_id) expect(typeof tutorChangeReview.before_filter_id).toEqual('number');
	if (tutorChangeReview.after_filter_id) expect(typeof tutorChangeReview.after_filter_id).toEqual('number');

	return null;
};

// institute_review check
export const checkInstituteReview = (instituteReview) => {
	if (instituteReview.review_id) expect(typeof instituteReview.review_id).toEqual('number');
	if (instituteReview.institute_id) expect(typeof instituteReview.institute_id).toEqual('number');
	if (instituteReview.subject_id) expect(typeof instituteReview.subject_id).toEqual('number');
	if (instituteReview.filter_id) expect(typeof instituteReview.filter_id).toEqual('number');

	return null;
};

// institute_change_review check
export const checkInstituteChangeReview = (instituteChangeReview) => {
	if (instituteChangeReview.review_id) expect(typeof instituteChangeReview.review_id).toEqual('number');
	if (instituteChangeReview.before_institute_id) expect(typeof instituteChangeReview.before_institute_id).toEqual('number');
	if (instituteChangeReview.after_institute_id) expect(typeof instituteChangeReview.after_institute_id).toEqual('number');
	if (instituteChangeReview.before_subject_id) expect(typeof instituteChangeReview.before_subject_id).toEqual('number');
	if (instituteChangeReview.after_subject_id) expect(typeof instituteChangeReview.after_subject_id).toEqual('number');
	if (instituteChangeReview.before_filter_id) expect(typeof instituteChangeReview.before_filter_id).toEqual('number');
	if (instituteChangeReview.after_filter_id) expect(typeof instituteChangeReview.after_filter_id).toEqual('number');

	return null;
};

// text, choice answer 검사
export const checkTextChoiceAnswer = (textChoiceAnswer) => {
	if (textChoiceAnswer.id) expect(typeof textChoiceAnswer.id).toEqual('number');
	if (textChoiceAnswer.answer) expect(typeof textChoiceAnswer.answer).toEqual('string');
};

// point, year answer 검사
export const checkPointYearAnswer = (pointYearAnswer) => {
	if (pointYearAnswer.id) expect(typeof pointYearAnswer.id).toEqual('number');
	if (pointYearAnswer.answer) expect(typeof pointYearAnswer.answer).toEqual('number');
};

// 기관 환승 리뷰 목록 조회시 befor after count
export const checkInstituteChageReviewCount = (changeReviewCount) => {
	if (changeReviewCount.before_institute_change_review_count) expect(typeof changeReviewCount.before_institute_change_review_count).toEqual('number');
	if (changeReviewCount.after_institute_change_review_count) expect(typeof changeReviewCount.after_institute_change_review_count).toEqual('number');
	if (changeReviewCount.before_institute_normal_review_count) expect(typeof changeReviewCount.before_institute_normal_review_count).toEqual('number');
	if (changeReviewCount.after_institute_normal_review_count) expect(typeof changeReviewCount.after_institute_normal_review_count).toEqual('number');
};

// 환승 리뷰 목록 조회 시 제목 총평 검사
export const checkChangeReviewTitleResult = (changeReviewTitleResult) => {
	if (changeReviewTitleResult.review_title) expect(typeof changeReviewTitleResult.review_title).toEqual('string');
	if (changeReviewTitleResult.review_result) expect(typeof changeReviewTitleResult.review_result).toEqual('string');
};

// 일반 리뷰 목록 조회시 리뷰 카운트 검사
export const checkNormalReviewCount = (normalReviewCount) => {
	if (normalReviewCount.institute_change_review_count) expect(typeof normalReviewCount.institute_change_review_count).toEqual('number');
	if (normalReviewCount.institute_normal_review_count) expect(typeof normalReviewCount.institute_normal_review_count).toEqual('number');
};

// 강사 환승 리뷰 목록 조회시 before after count
export const checkTutorChangeReviewCount = (changeReviewCount) => {
	if (changeReviewCount.before_tutor_change_review_count) expect(typeof changeReviewCount.before_tutor_change_review_count).toEqual('number');
	if (changeReviewCount.after_tutor_change_review_count) expect(typeof changeReviewCount.after_tutor_change_review_count).toEqual('number');
	if (changeReviewCount.before_tutor_normal_review_count) expect(typeof changeReviewCount.before_tutor_normal_review_count).toEqual('number');
	if (changeReviewCount.after_tutor_normal_review_count) expect(typeof changeReviewCount.after_tutor_normal_review_count).toEqual('number');

	return null;
};
