import { Sequelize } from 'sequelize';
import { getModel, sequelize } from '../../database';

import * as reviewQuestionComponent from './reviewQuestion';
import * as filterComponent from '../filter/filter';
import * as regionComponent from '../region/region';
import * as instituteComponent from '../institute/institute';
import * as commonComponent from '../common';
import { throwError } from '../../services';

const Op = Sequelize.Op;
const Review = getModel('Review');
const ReviewCount = getModel('ReviewCount');
const ReviewCountLog = getModel('ReviewCountLog');
const ReviewComment = getModel('ReviewComment');
const ReviewCommentCount = getModel('ReviewCommentCount');
const ReviewCommentCountLog = getModel('ReviewCommentCountLog');
const ReviewCommentContent = getModel('ReviewCommentContent');
const TutorReview = getModel('TutorReview');
const InstituteReview = getModel('InstituteReview');
const TutorChangeReview = getModel('TutorChangeReview');
const InstituteChangeReview = getModel('InstituteChangeReview');
const ReviewQuestion = getModel('ReviewQuestion');
const ReviewQuestionFilter = getModel('ReviewQuestionFilter');
const ReviewQuestionChoice = getModel('ReviewQuestionChoice');
const ReviewAnswer = getModel('ReviewAnswer');
const ReviewAnswerPoint = getModel('ReviewAnswerPoint');
const ReviewAnswerText = getModel('ReviewAnswerText');
const ReviewAnswerChoice = getModel('ReviewAnswerChoice');
const ReviewAnswerYear = getModel('ReviewAnswerYear');
const ReviewAnswerRegion = getModel('ReviewAnswerRegion');
const MemberAuthReview = getModel('MemberAuthReview');
const Member = getModel('Member');
const MemberAttribute = getModel('MemberAttribute');
const Tutor = getModel('Tutor');
const TutorAttribute = getModel('TutorAttribute');
const TutorInstitute = getModel('TutorInstitute');
const Institute = getModel('Institute');
const InstituteAttribute = getModel('InstituteAttribute');
const Filter = getModel('Filter');
const Subject = getModel('Subject');
const Region = getModel('Region');

// 리뷰 인덱스 존재여부 확인
export const isExistReviewId = async (reviewId) => ((await Review.count({ where: { id: reviewId } })) > 0 ? true : false); // eslint-disable-next-no-unneeded-ternary

// 리뷰 선택형 질문 인덱스 유효성 확인
export const isValidReviewQuestionId = async (reviewQuestionId) => ((await ReviewQuestion.count({ where: { id: reviewQuestionId, answer_type: 'choice' } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

/** @description 리뷰 선택형 답변 범위 조회 */
export const getReviewAnswerPointRangeByReviewAnswerPointId = async (reviewAnswerPointId) => {
	let response = null;
	const sql = [
		'SELECT `review_questions`.`min_point`, `review_questions`.`max_point` ',
		'FROM `review_answer_points` ',
		'INNER JOIN `review_answers` ON `review_answers`.`id` = `review_answer_points`.`review_answer_id` ',
		'INNER JOIN `review_questions` ON `review_questions`.`id` = `review_answers`.`review_question_id` ',
		'WHERE `review_answer_points`.`id` = ' + reviewAnswerPointId + '; ', // eslint-disable-line prefer-template
	].join(' ');
	// Return
	const pointAnswerData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
	if (Object.keys(pointAnswerData).length > 0) response = { min_point: pointAnswerData[0].min_point, max_point: pointAnswerData[0].max_point };
	return response;
};

/**
 * @description 리뷰 선택형 답변 인덱스 유효성 확인
 * @param {Int} reviewAnswerChoiceId
 */
export const isValidReviewChoiceId = async (reviewAnswerChoiceId) => {
	const values = { answerchoiceId: reviewAnswerChoiceId };
	const sql = [
		'SELECT `id` ',
		'FROM `review_question_choices` ',
		'WHERE `review_question_id` =  ',
		'	( ',
		'		SELECT `review_question_id` ',
		'		FROM `review_question_choices` ',
		'		WHERE `id` =  ',
		'		( ',
		'			SELECT `review_question_choice_id` ',
		'			FROM `review_answer_choices` ',
		'			WHERE `id` = :answerchoiceId ',
		'		) ',
		'	) ',
	].join(' ');

	// Return
	const choiceIdsData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	const choiceIds = choiceIdsData.map((choiceId) => choiceId.id);
	return choiceIds;
};

/**
 * @description 리뷰 질문 필터 인덱스 존재 여부 확인
 * @param {Int} reviewQuestionFilterId
 */
export const isExistReviewQuestionFilterId = async (reviewQuestionFilterId) => ((await ReviewQuestionFilter.count({ where: { id: reviewQuestionFilterId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 리뷰 정성 답변 인덱스 존재여부 확인
export const isExistReviewAnswerTextId = async (textId) => ((await ReviewAnswerText.count({ where: { id: textId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 리뷰 정량 답변 인덱스 존재여부 확인
export const isExistReviewAnswerPointId = async (pointId) => ((await ReviewAnswerPoint.count({ where: { id: pointId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 리뷰 년도 답변 인덱스 존재여부 확인
export const isExistReviewAnswerYearId = async (yearId) => ((await ReviewAnswerYear.count({ where: { id: yearId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 리뷰 선택형 답변 인덱스 존재여부 확인
export const isExistReviewAnswerChoiceId = async (choiceId) => ((await ReviewAnswerChoice.count({ where: { id: choiceId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 리뷰 댓글 인덱스 존재여부 확인
export const isExistReviewCommentId = async (reviewCommentId) => ((await ReviewComment.count({ where: { id: reviewCommentId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 리뷰 열람 권한 존재여부 확인
export const isExistReviewAuth = async (memberId) => {
	const nowDate = await commonComponent.nowDateTime();
	const existNum = await MemberAuthReview.count({ where: { expire_date: { [Op.gt]: nowDate }, member_id: memberId, is_deleted: 'N' } });
	return existNum > 0;
};

// 리뷰 열람 권한 인덱스 존재여부 확인
// eslint-disable-next-line no-unneeded-ternary
export const isExistReviewAuthId = async (reviewAuthId) => ((await MemberAuthReview.count({ where: { id: reviewAuthId } })) > 0 ? true : false);

// 회원 리뷰 열람권한 반환
export const isExistReviewReadAuth = async (memberId) => {
	let response = 'REJECT';
	const nowDate = await commonComponent.nowDateTime();

	// 리뷰 권한 테이블에 리뷰가 존재하는지 확인
	const memberAuthReview = await MemberAuthReview.findOne({ where: { expire_date: { [Op.gt]: nowDate }, is_deleted: 'N', member_id: memberId } });

	if (memberAuthReview) {
		response = 'CONFIRM';
	} else {
		// 승인 대기중이 리뷰가 존재하는지 확인
		const review = await Review.findOne({ where: { member_id: memberId, is_confirm: 'REQUEST' } });
		// 리뷰가 존재하는 경우 response 를 REQUEST 로 변경
		if (review) response = 'REQUEST';
	}

	// Return
	return response;
};

// 리뷰 추천 여부 확인
export const isExistReviewRecommend = async (reviewId, memberId) => {
	// 리뷰 추천 여부 조회
	const memberReviewRecommend = await ReviewCountLog.findOne({ where: { review_id: reviewId, type: 'recommend', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberReviewRecommend ? true : false;
};

// 리뷰 비추천 여부 확인
export const isExistReviewOpposition = async (reviewId, memberId) => {
	// 리뷰 비추천 여부 조회
	const memberReviewOpposition = await ReviewCountLog.findOne({ where: { review_id: reviewId, type: 'opposition', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberReviewOpposition ? true : false;
};

// 리뷰 댓글 추천 여부 확인
export const isExistReviewCommentRecommend = async (commentId, memberId) => {
	// 리뷰 댓글 추천 여부 조회
	const memberReviewCommentRecommend = await ReviewCommentCountLog.findOne({ where: { review_comment_id: commentId, type: 'recommend', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberReviewCommentRecommend ? true : false;
};

// 리뷰 댓글 비추천 여부 확인
export const isExistReviewCommentOpposition = async (commentId, memberId) => {
	// 리뷰 댓글 비추천 여부 조회
	const memberReviewCommentOpposition = await ReviewCommentCountLog.findOne({ where: { review_comment_id: commentId, type: 'opposition', member_id: memberId } });
	// Return
	// eslint-disable-next-line no-unneeded-ternary
	return memberReviewCommentOpposition ? true : false;
};

// 리뷰 입력
export const addReview = async (review, isGetId = false, t) => {
	const response = await Review.create(
		{
			member_id: review.member_id,
			review_type: review.review_type,
			is_deleted: review.is_deleted,
			is_confirm: review.is_confirm,
			average_point: review.average_point,
			created_ip: review.created_ip,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.id : response;
};

// 리뷰 카운터 입력
export const addReviewCount = async (reviewCount, isGetId = false, t) => {
	const response = await ReviewCount.create(
		{
			review_id: reviewCount.review_id,
			recommend: reviewCount.recommend,
			opposition: reviewCount.opposition,
			view: reviewCount.view,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.review_id : null;
};

// 강사 리뷰 입력
export const addTutorReview = async (tutorReview, isGetId = false, t) => {
	const response = await TutorReview.create(
		{
			review_id: tutorReview.review_id,
			tutor_id: tutorReview.tutor_id,
			institute_id: tutorReview.institute_id,
			filter_id: tutorReview.filter_id,
			subject_id: tutorReview.subject_id,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.review_id : null;
};

// 기관 리뷰 입력
export const addInstituteReview = async (instituteReview, isGetId = false, t) => {
	const response = await InstituteReview.create(
		{
			review_id: instituteReview.review_id,
			institute_id: instituteReview.institute_id,
			filter_id: instituteReview.filter_id,
			subject_id: instituteReview.subject_id,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.review_id : null;
};

// 강사 환승 리뷰 입력
export const addTutorChangeReview = async (tutorChangeReview, isGetId = false, t) => {
	const response = await TutorChangeReview.create(
		{
			review_id: tutorChangeReview.review_id,
			before_tutor_id: tutorChangeReview.before_tutor_id,
			before_institute_id: tutorChangeReview.before_institute_id,
			before_filter_id: tutorChangeReview.before_filter_id,
			before_subject_id: tutorChangeReview.before_subject_id,
			after_tutor_id: tutorChangeReview.after_tutor_id,
			after_institute_id: tutorChangeReview.after_institute_id,
			after_filter_id: tutorChangeReview.after_filter_id,
			after_subject_id: tutorChangeReview.after_subject_id,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.review_id : null;
};

// 기관 환승 리뷰 입력
export const addInstituteChangeReview = async (instituteChangeReview, isGetId = false, t) => {
	const response = await InstituteChangeReview.create(
		{
			review_id: instituteChangeReview.review_id,
			before_institute_id: instituteChangeReview.before_institute_id,
			before_filter_id: instituteChangeReview.before_filter_id,
			before_subject_id: instituteChangeReview.before_subject_id,
			after_institute_id: instituteChangeReview.after_institute_id,
			after_filter_id: instituteChangeReview.after_filter_id,
			after_subject_id: instituteChangeReview.after_subject_id,
		},
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.review_id : null;
};

// 리뷰 답변 입력
export const addReviewAnswers = async (reviewAnswer, isGetId = false, t) => {
	const response = await ReviewAnswer.create({ review_id: reviewAnswer.review_id, review_question_id: reviewAnswer.review_question_id }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 리뷰 답변 (포인트) 입력
export const addReviewAnswerPoint = async (reviewAnswerPoint, isGetId = false, t) => {
	const response = await ReviewAnswerPoint.create({ review_answer_id: reviewAnswerPoint.review_answer_id, point: reviewAnswerPoint.point }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 리뷰 답변 (텍스트) 입력
export const addReviewAnswerText = async (reviewAnswerText, isGetId = false, t) => {
	const response = await ReviewAnswerText.create({ review_answer_id: reviewAnswerText.review_answer_id, answer: reviewAnswerText.answer }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 리뷰 답변 (객관식) 입력
export const addReviewAnswerChoice = async (reviewAnswerChoice, isGetId = false, t) => {
	const response = await ReviewAnswerChoice.create(
		{ review_answer_id: reviewAnswerChoice.review_answer_id, review_question_choice_id: reviewAnswerChoice.review_question_choice_id },
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 리뷰 답변 (년도) 입력
export const addReviewAnswerYear = async (reviewAnswerYear, isGetId = false, t) => {
	const response = await ReviewAnswerYear.create({ review_answer_id: reviewAnswerYear.review_answer_id, answer: reviewAnswerYear.answer }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 리뷰 답변 (지역) 입력
export const addReviewAnswerRegion = async (reviewAnswerRegion, isGetId = false, t) => {
	const response = await ReviewAnswerRegion.create({ review_answer_id: reviewAnswerRegion.review_answer_id, region_id: reviewAnswerRegion.region_id }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 강사 리뷰 조회
export const getTutorReviewById = async (reviewId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { id: reviewId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
			{
				model: TutorReview,
				as: 'tutor_review',
				attributes: ['tutor_id', 'institute_id', 'filter_id', 'subject_id'],
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
				required: true,
			},
		],
	});

	// Return
	return response;
};

// 기관 리뷰 조회
export const getInstituteReviewById = async (reviewId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { id: reviewId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
			{
				model: InstituteReview,
				as: 'institute_review',
				attributes: ['institute_id', 'filter_id', 'subject_id'],
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
				required: true,
			},
		],
	});

	// 지역 추가
	if (response) {
		let region = null;
		const relationRegion = await regionComponent.getRegionInfoByInstituteId(response.dataValues.institute_review.dataValues.institute_id);
		if (relationRegion) region = await regionComponent.getFullRegionInfoById(relationRegion.dataValues.region_id);
		response.dataValues.institute_review.dataValues.institute.dataValues.region = region;
	}

	// Return
	return response;
};

// 강사 환승 리뷰 조회
export const getTutorChangeReviewById = async (reviewId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { id: reviewId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				attributes: ['before_tutor_id', 'before_institute_id', 'before_filter_id', 'before_subject_id', 'after_tutor_id', 'after_institute_id', 'after_filter_id', 'after_subject_id'],
				include: [
					{
						model: Tutor,
						as: 'before_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
					{
						model: Tutor,
						as: 'after_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
				required: true,
			},
		],
	});

	// Return
	return response;
};

// 기관 환승 리뷰 조회
export const getInstituteChangeReviewById = async (reviewId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { id: reviewId, is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
			{
				model: InstituteChangeReview,
				as: 'institute_change_review',
				attributes: ['before_institute_id', 'before_filter_id', 'before_subject_id', 'after_institute_id', 'after_filter_id', 'after_subject_id'],
				include: [
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
				required: true,
			},
		],
	});

	// 지역 추가
	if (response) {
		let beforeRegion = null;
		let afterRegion = null;
		const beforeRelationRegion = await regionComponent.getRegionInfoByInstituteId(response.dataValues.institute_change_review.dataValues.before_institute_id);
		const afterRelationRegion = await regionComponent.getRegionInfoByInstituteId(response.dataValues.institute_change_review.dataValues.after_institute_id);
		if (beforeRelationRegion) beforeRegion = await regionComponent.getFullRegionInfoById(beforeRelationRegion.dataValues.region_id);
		if (afterRelationRegion) afterRegion = await regionComponent.getFullRegionInfoById(afterRelationRegion.dataValues.region_id);
		response.dataValues.institute_change_review.dataValues.before_institute.dataValues.region = beforeRegion;
		response.dataValues.institute_change_review.dataValues.after_institute.dataValues.region = afterRegion;
	}

	// Return
	return response;
};

// TutorId 로 Best 긍정 강사 리뷰 조회
export const getPositiveTutorBestNormalReviewByTutorId = async (tutorId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y', average_point: { [Op.gte]: process.env.REVIEW_POSITIVE_NEGATIVE_DIVISION_BASE_POINT } },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { tutor_id: tutorId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['average_point', 'DESC'],
			['created_at', 'DESC'],
		],
	});

	// Return
	return response;
};

// TutorId 로 Best 부정 강사 리뷰 조회
export const getNegativeTutorBestNormalReviewByTutorId = async (tutorId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y', average_point: { [Op.lt]: process.env.REVIEW_POSITIVE_NEGATIVE_DIVISION_BASE_POINT } },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { tutor_id: tutorId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['average_point', 'ASC'],
			['created_at', 'DESC'],
		],
	});

	// Return
	return response;
};

// ReviewAnswer_id 로 point 답변 조회
export const getReviewPointAnswerByReviewAnswerId = async (reviewAnswerId) => {
	const response = await ReviewAnswerPoint.findOne({ attributes: ['id', 'point'], where: { review_answer_id: reviewAnswerId } });
	return response;
};

// ReviewAnswer_id 로 text 답변 조회
export const getReviewTextAnswerByReviewAnswerId = async (reviewAnswerId) => {
	const response = await ReviewAnswerText.findOne({ attributes: ['id', 'answer'], where: { review_answer_id: reviewAnswerId } });
	return response;
};

// ReviewAnswer_id 로 year 답변 조회
export const getReviewYearAnswerByReviewAnswerId = async (reviewAnswerId) => {
	const response = await ReviewAnswerYear.findOne({ attributes: ['id', 'answer'], where: { review_answer_id: reviewAnswerId } });
	return response;
};

// ReviewAnswer_id 로 choice 답변 조회
export const getReviewChoiceAnswerByReviewAnswerId = async (reviewAnswerId) => {
	const response = await ReviewQuestionChoice.findOne({
		attributes: ['id', 'answer'],
		include: [{ model: ReviewAnswerChoice, as: 'review_answer_choice', attributes: [], where: { review_answer_id: reviewAnswerId } }],
	});
	return response;
};

// ReviewAnswer_id 로 region 답변 조회
export const getReviewRegionAnswerByReviewAnswerId = async (reviewAnswerId) => {
	const response = await Region.findOne({
		attributes: ['id', 'parent_id', 'code', 'type', 'name', 'is_deleted'],
		include: [{ model: ReviewAnswerRegion, as: 'review_answer_region', attributes: [], where: { review_answer_id: reviewAnswerId } }],
	});
	return response;
};

// ReviewId 로 리뷰 질문 및 답변 조회
export const getReviewQuestionAndAnswerByReviewId = async (reviewId) => {
	let response = null;
	const question = await ReviewAnswer.findAll({
		attributes: ['id'],
		where: { review_id: reviewId },
		include: [{ model: ReviewQuestion, as: 'review_question', attributes: ['id', 'answer_type', 'question', 'text_answer_type'], required: true }],
	});

	for (let i = 0; i < question.length; i += 1) {
		switch (question[i].dataValues.review_question.dataValues.answer_type) {
			case 'point':
				// eslint-disable-next-line no-await-in-loop
				question[i].dataValues.answer = await getReviewPointAnswerByReviewAnswerId(question[i].dataValues.id);
				break;
			case 'text':
				// eslint-disable-next-line no-await-in-loop
				question[i].dataValues.answer = await getReviewTextAnswerByReviewAnswerId(question[i].dataValues.id);
				break;
			case 'year':
				// eslint-disable-next-line no-await-in-loop
				question[i].dataValues.answer = await getReviewYearAnswerByReviewAnswerId(question[i].dataValues.id);
				break;
			case 'choice':
				// eslint-disable-next-line no-await-in-loop
				question[i].dataValues.answer = await getReviewChoiceAnswerByReviewAnswerId(question[i].dataValues.id);
				break;
			case 'region':
				// eslint-disable-next-line no-await-in-loop
				question[i].dataValues.answer = await getReviewRegionAnswerByReviewAnswerId(question[i].dataValues.id);
				break;
			default:
				throwError("Invalid 'answer_type'", 400);
				break;
		}
	}

	response = question;

	// Return
	return response;
};

// 강사 리뷰 목록 조회
export const getTutorReviewsBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const review = searchFields.review ? searchFields.review : null;
	const tutorReview = searchFields.tutor_review ? searchFields.tutor_review : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;

	let bestPositiveReview = null;
	let bestNegativeReview = null;
	let limitSubtract = 0;
	const ignoreReviewId = [];

	// 검색 조건
	const reviewAttr = {};
	if (review) {
		if (review.review_type) reviewAttr.review_type = review.review_type;
		if (review.is_deleted) reviewAttr.is_deleted = review.is_deleted;
		if (review.is_confirm) reviewAttr.is_confirm = { [Op.in]: [review.is_confirm] };
	}

	const tutorReviewAttr = {};
	if (tutorReview) {
		if (tutorReview.tutor_id) tutorReviewAttr.tutor_id = tutorReview.tutor_id;
		if (tutorReview.institute_id) tutorReviewAttr.institute_id = tutorReview.institute_id;
		tutorReviewAttr.filter_id = { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(tutorReview.filter_id) };
		if (tutorReview.subject_id) tutorReviewAttr.subject_id = tutorReview.subject_id;
	}

	const commonAttr = {};
	if (common) if (common.order) commonAttr.order = common.order;

	if (!common || !common.order) {
		// best 긍정 리뷰 조회
		bestPositiveReview = await getPositiveTutorBestNormalReviewByTutorId(tutorReview.tutor_id, tutorReview.filter_id);
		if (bestPositiveReview) {
			bestPositiveReview.dataValues.review_question_answer = await getReviewQuestionAndAnswerByReviewId(bestPositiveReview.dataValues.id);
			ignoreReviewId.push(bestPositiveReview.dataValues.id);
			if (offset === 0) limitSubtract = parseInt(limitSubtract, 10) + parseInt(1, 10);
		}
		// best 부정 리뷰 조회
		bestNegativeReview = await getNegativeTutorBestNormalReviewByTutorId(tutorReview.tutor_id, tutorReview.filter_id);
		if (bestNegativeReview) {
			bestNegativeReview.dataValues.review_question_answer = await getReviewQuestionAndAnswerByReviewId(bestNegativeReview.dataValues.id);
			ignoreReviewId.push(bestNegativeReview.dataValues.id);
			if (offset === 0) limitSubtract = parseInt(limitSubtract, 10) + parseInt(1, 10);
		}
	}

	const sql = {
		where: reviewAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: tutorReviewAttr,
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
	};

	// Total
	const total = await Review.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment', 'average_point', 'created_at'];
		if (Object.keys(ignoreReviewId).length > 0) sql.where.id = { [Op.notIn]: ignoreReviewId };

		// 베스트순
		if (commonAttr.order === 'best') {
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else if (commonAttr.order === 'last_order') {
			// 최신순
			sql.order = [
				['is_confirm', 'ASC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else if (commonAttr.order === 'high_rating') {
			// 평점 높은순
			sql.order = [
				['average_point', 'DESC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else if (commonAttr.order === 'low_rating') {
			// 평점 낮은순
			sql.order = [
				['average_point', 'ASC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else {
			// 전체 ( 긍정 1개, 부정 1개, 나머지는 최신순 1page 만 )
			sql.order = [
				['is_confirm', 'ASC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		}
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10) - parseInt(limitSubtract, 10);

		// 리뷰 정보 조회
		const reviews = [];

		// 1페이지에서 긍정 또는 부정 리뷰가 있는 경우
		if (offset === 0) {
			if (bestPositiveReview) reviews.push(bestPositiveReview);
			if (bestNegativeReview) reviews.push(bestNegativeReview);
		}
		const reviewData = await Review.findAll(sql);
		for (let i = 0; i < reviewData.length; i += 1) reviews.push(reviewData[i]);

		response = { total, list: reviews };
	}

	// Return
	return response || null;
};

// 강사 환승 리뷰 목록 조회
export const getTutorChangeReviewsBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const review = searchFields.review ? searchFields.review : null;
	const tutorChangeReview = searchFields.tutor_change_review ? searchFields.tutor_change_review : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;

	// 검색 조건
	const reviewAttr = {};
	if (review) {
		if (review.review_type) reviewAttr.review_type = review.review_type;
		if (review.is_deleted) reviewAttr.is_deleted = review.is_deleted;
		if (review.is_confirm) reviewAttr.is_confirm = { [Op.in]: [review.is_confirm] };
	}

	let tutorChangeReviewAttr = {};
	if (tutorChangeReview) {
		const tmpData = [];
		if (common && (common.order !== 'before_only' || common.order !== 'after_only')) {
			tmpData.push({ [Op.or]: [{ before_tutor_id: tutorChangeReview.tutor_id }, { after_tutor_id: tutorChangeReview.tutor_id }] });
		}
		if (tutorChangeReview.filter_id && tutorChangeReview.subject_id) {
			tmpData.push({
				[Op.or]: [
					{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(tutorChangeReview.filter_id) } },
					{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(tutorChangeReview.filter_id) } },
					{ before_subject_id: tutorChangeReview.subject_id },
					{ after_subject_id: tutorChangeReview.subject_id },
				],
			});
		} else if (tutorChangeReview.filter_id && !tutorChangeReview.subject_id) {
			tmpData.push({
				[Op.or]: [
					{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(tutorChangeReview.filter_id) } },
					{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(tutorChangeReview.filter_id) } },
				],
			});
		} else if (!tutorChangeReview.filter_id && tutorChangeReview.subject_id) {
			tmpData.push({
				[Op.or]: [{ before_subject_id: tutorChangeReview.subject_id }, { after_subject_id: tutorChangeReview.subject_id }],
			});
		}
		tutorChangeReviewAttr = { [Op.and]: tmpData };
	}

	if (common) {
		if (common.order === 'before_only') tutorChangeReviewAttr.before_tutor_id = tutorChangeReview.tutor_id;
		if (common.order === 'after_only') tutorChangeReviewAttr.after_tutor_id = tutorChangeReview.tutor_id;
	}

	const sql = {
		where: reviewAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				where: tutorChangeReviewAttr,
				required: true,
				include: [
					{
						model: Tutor,
						as: 'before_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
					{
						model: Tutor,
						as: 'after_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
	};

	// Total
	const total = await Review.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment', 'average_point', 'created_at'];

		sql.order = [
			['is_confirm', 'ASC'],
			['created_at', 'DESC'],
			['id', 'DESC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.subQuery = false;

		// 리뷰 정보 조회
		const reviews = await Review.findAll(sql);

		response = { total, list: reviews };
	}

	// Return
	return response || null;
};

// 유치원에 대한 리뷰 목록 조회인 경우 특정 기간 이후의 반려 리뷰인 경우 해당 리뷰를 제외 ( 기관 리뷰 인덱스 기준 146177 이후 부터 )
export const expectInstitute = async (instituteId) => {
	const sql = [
		'SELECT `reviews`.`id` ',
		'FROM `reviews` ',
		'INNER JOIN `institute_reviews` ON `institute_reviews`.`review_id` = `reviews`.`id` ',
		'INNER JOIN `institutes` ON `institutes`.`id` = `institute_reviews`.`institute_id` ',
		'WHERE `reviews`.`id` > 146177 ',
		'AND `reviews`.`is_confirm` = "N" ',
		'AND `institute_reviews`.`institute_id` = ' + instituteId + ' ',
		'AND `institutes`.`type` IN ( "kindergarten", "daycare" ); ',
	].join(' ');
	let ids = null;
	const expectInstituteIds = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
	if (Object.keys(expectInstituteIds).length > 0) ids = expectInstituteIds.map((expectInstituteIds) => expectInstituteIds.id);
	return ids;
};

// 기관 리뷰 목록 조회
export const getInstituteReviewsBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const review = searchFields.review ? searchFields.review : null;
	const instituteReview = searchFields.institute_review ? searchFields.institute_review : null;
	const common = searchFields.common ? searchFields.common : null;
	let response = null;

	// 검색 조건
	const reviewAttr = {};
	if (review) {
		if (review.review_type) reviewAttr.review_type = review.review_type;
		if (review.is_deleted) reviewAttr.is_deleted = review.is_deleted;
		if (review.is_confirm) reviewAttr.is_confirm = { [Op.in]: [review.is_confirm] };
	}

	const instituteReviewAttr = {};
	if (instituteReview) {
		if (instituteReview.institute_id) {
			instituteReviewAttr.institute_id = instituteReview.institute_id;
			/** @description 유치원에 대한 리뷰 목록 조회인 경우 특정 기간 이후의 반려 리뷰인 경우 해당 리뷰를 제외 ( 기관 리뷰 인덱스 기준 146177 이후 부터 ) */
			const expectInstituteIds = await expectInstitute(instituteReview.institute_id);
			if (expectInstituteIds) reviewAttr.id = { [Op.notIn]: expectInstituteIds };
		}
		instituteReviewAttr.filter_id = { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(instituteReview.filter_id) };
		if (instituteReview.subject_id) instituteReviewAttr.subject_id = InstituteReview.subject_id;
	}

	const commonAttr = {};
	if (common) if (common.order) commonAttr.order = common.order;

	const sql = {
		where: reviewAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: InstituteReview,
				as: 'institute_review',
				where: instituteReviewAttr,
				required: true,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
	};

	// Total
	const total = await Review.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment', 'average_point', 'created_at'];

		// 베스트순
		if (commonAttr.order === 'best') {
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else if (commonAttr.order === 'last_order') {
			// 최신순
			sql.order = [
				['is_confirm', 'ASC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else if (commonAttr.order === 'high_rating') {
			// 평점 높은순
			sql.order = [
				['average_point', 'DESC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else if (commonAttr.order === 'low_rating') {
			// 평점 낮은순
			sql.order = [
				['average_point', 'ASC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		} else {
			sql.order = [
				['is_confirm', 'ASC'],
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		}
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		const reviews = await Review.findAll(sql);

		for (let i = 0; i < reviews.length; i += 1) {
			const instituteId = reviews[i].dataValues.institute_review.dataValues.institute_id;
			const instituteType = reviews[i].dataValues.institute_review.dataValues.institute.dataValues.type;

			let children = null;
			if (['kindergarten', 'daycare'].includes(instituteType)) children = await instituteComponent.getInstituteChildrenByInstituteId(instituteId); // eslint-disable-line no-await-in-loop
			reviews[i].dataValues.institute_review.dataValues.institute.dataValues.children = children;
		}

		response = { total, list: reviews };
	}

	// Return
	return response || null;
};

// 기관 환승 리뷰 목록 조회
export const getInstituteChangeReviewsBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const review = searchFields.review ? searchFields.review : null;
	const member = searchFields.member ? searchFields.member : null;
	const beforeInstitute = searchFields.before_institute ? searchFields.before_institute : null;
	const beforeFilter = searchFields.before_filter ? searchFields.before_filter : null;
	const beforeSubject = searchFields.before_subject ? searchFields.before_subject : null;
	const afterInstitute = searchFields.after_institute ? searchFields.after_institute : null;
	const afterFilter = searchFields.after_filter ? searchFields.after_filter : null;
	const afterSubject = searchFields.after_subject ? searchFields.after_subject : null;
	let response = null;

	// 검색 조건
	const reviewAttr = {};
	const reviewContentAttr = {};
	if (review) {
		if (review.comment) reviewContentAttr.answer = { [Op.like]: [`%${review.comment}%`] };
		if (review.review_type) reviewAttr.review_type = review.review_type;
		if (review.is_deleted) reviewAttr.is_deleted = review.is_deleted;
		if (review.is_confirm) reviewAttr.is_confirm = { [Op.in]: [review.is_confirm] };
	}

	const memberAttr = {};
	if (member) {
		if (member.id) memberAttr.id = member.id;
		if (member.user_id) memberAttr.user_id = { [Op.like]: [`%${member.user_id}%`] };
		if (member.nickname) memberAttr.nickname = { [Op.like]: [`%${member.nickname}%`] };
		if (member.join_site) memberAttr.join_site = member.join_site;
		if (member.join_type) memberAttr.join_type = member.join_type;
	}

	const beforeInstituteAttr = {};
	if (beforeInstitute) {
		if (beforeInstitute.id) beforeInstituteAttr.id = beforeInstitute.id;
		if (beforeInstitute.name_ko) beforeInstituteAttr.name_ko = { [Op.like]: [`%${beforeInstitute.name_ko}%`] };
		if (beforeInstitute.name_en) beforeInstituteAttr.name_en = { [Op.like]: [`%${beforeInstitute.name_en}%`] };
		if (beforeInstitute.campus) beforeInstituteAttr.campus = { [Op.like]: [`%${beforeInstitute.campus}%`] };
		if (beforeInstitute.has_online) beforeInstituteAttr.has_online = beforeInstitute.has_online;
		if (beforeInstitute.has_review) beforeInstituteAttr.has_review = beforeInstitute.has_review;
		if (beforeInstitute.is_deleted) beforeInstituteAttr.is_deleted = beforeInstitute.is_deleted;
		if (beforeInstitute.is_confirm) beforeInstituteAttr.is_confirm = { [Op.in]: [beforeInstitute.is_confirm] };
	}

	const beforeFilterAttr = {};
	if (beforeFilter) {
		if (beforeFilter.id) beforeFilterAttr.id = beforeFilter.id;
		if (beforeFilter.code) beforeFilterAttr.code = beforeFilter.code;
		if (beforeFilter.name) beforeFilterAttr.name = { [Op.like]: [`%${beforeFilter.name}%`] };
		if (beforeFilter.is_deleted) beforeFilterAttr.is_deleted = beforeFilter.is_deleted;
	}

	const beforeSubjectAttr = {};
	if (beforeSubject) {
		if (beforeSubject.id) beforeSubjectAttr.id = beforeSubject.id;
		if (beforeSubject.name) beforeSubjectAttr.name = { [Op.like]: [`%${beforeSubject.name}%`] };
		if (beforeSubject.comment) beforeSubjectAttr.comment = { [Op.like]: [`%${beforeSubject.comment}%`] };
		if (beforeSubject.is_deleted) beforeSubjectAttr.is_deleted = beforeSubject.is_deleted;
	}

	const afterInstituteAttr = {};
	if (afterInstitute) {
		if (afterInstitute.id) afterInstituteAttr.id = afterInstitute.id;
		if (afterInstitute.name_ko) afterInstituteAttr.name_ko = { [Op.like]: [`%${afterInstitute.name_ko}%`] };
		if (afterInstitute.name_en) afterInstituteAttr.name_en = { [Op.like]: [`%${afterInstitute.name_en}%`] };
		if (afterInstitute.campus) afterInstituteAttr.campus = { [Op.like]: [`%${afterInstitute.campus}%`] };
		if (afterInstitute.has_online) afterInstituteAttr.has_online = afterInstitute.has_online;
		if (afterInstitute.has_review) afterInstituteAttr.has_review = afterInstitute.has_review;
		if (afterInstitute.is_deleted) afterInstituteAttr.is_deleted = afterInstitute.is_deleted;
		if (afterInstitute.is_confirm) afterInstituteAttr.is_confirm = { [Op.in]: [afterInstitute.is_confirm] };
	}

	const afterFilterAttr = {};
	if (afterFilter) {
		if (afterFilter.id) afterFilterAttr.id = afterFilter.id;
		if (afterFilter.code) afterFilterAttr.code = afterFilter.code;
		if (afterFilter.name) afterFilterAttr.name = { [Op.like]: [`%${afterFilter.name}%`] };
		if (afterFilter.is_deleted) afterFilterAttr.is_deleted = afterFilter.is_deleted;
	}

	const afterSubjectAttr = {};
	if (afterSubject) {
		if (afterSubject.id) afterSubjectAttr.id = afterSubject.id;
		if (afterSubject.name) afterSubjectAttr.name = { [Op.like]: [`%${afterSubject.name}%`] };
		if (afterSubject.comment) afterSubjectAttr.comment = { [Op.like]: [`%${afterSubject.comment}%`] };
		if (afterSubject.is_deleted) afterSubjectAttr.is_deleted = afterSubject.is_deleted;
	}

	const sql = {
		where: reviewAttr,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: InstituteChangeReview,
				as: 'institute_change_review',
				include: [
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: beforeInstituteAttr,
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'], where: beforeFilterAttr },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'], where: beforeSubjectAttr },
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: afterInstituteAttr,
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'], where: afterFilterAttr },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'], where: afterSubjectAttr },
				],
				required: true,
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
			{
				model: ReviewAnswer,
				as: 'review_question_answer',
				attributes: ['id'],
				include: [
					{
						model: ReviewQuestion,
						as: 'review_question',
						where: { answer_type: 'text', text_answer_type: 'title' },
						attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
						required: true,
					},
					{ model: ReviewAnswerText, as: 'review_answer', where: reviewContentAttr, attributes: ['id', 'answer'], required: true },
				],
				required: true,
			},
		],
		distinct: true,
	};

	// Total
	const total = await Review.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment'];
		sql.order = [
			['is_confirm', 'ASC'],
			['id', 'ASC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.subQuery = false;

		// 리뷰 정보 조회
		const reviews = await Review.findAll(sql);
		if (Object.keys(reviews).length > 0) response = { total, list: reviews };
	}

	// Return
	return response || null;
};

// TutorId 로 Best 강사 환승 리뷰 조회
export const getBestTutorTransferReviewByTutorId = async (tutorId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id` AND `review_comments`.`is_deleted` = "N"  )'),
				'comment_count',
			],
		],
		where: { is_confirm: 'Y', is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				where: {
					[Op.and]: [
						{ [Op.or]: [{ before_tutor_id: tutorId }, { after_tutor_id: tutorId }] },
						{
							[Op.or]: [
								{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
								{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
							],
						},
					],
				},
				required: true,
				include: [
					{
						model: Tutor,
						as: 'before_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
					{
						model: Tutor,
						as: 'after_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// ReviewId 로 리뷰 제목 조회
export const getReviewTitleByReviewId = async (reviewId) => {
	const response = await ReviewAnswer.findOne({
		attributes: ['id'],
		where: { review_id: reviewId },
		include: [
			{
				model: ReviewQuestion,
				as: 'review_question',
				where: { answer_type: 'text', text_answer_type: 'title' },
				attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
				required: true,
			},
			{ model: ReviewAnswerText, as: 'review_answer', attributes: ['id', 'answer'], required: true },
		],
	});
	return response;
};

/**
 * @TODO
 * TutorId 로 Best 강사 환승 리뷰 조회
 */

// 실시간 강사 리뷰 & 강사 환승 리뷰 & 강사 댓글 조회
export const getTutorRealTimeReviewAndComment = async (tutorId, instituteId, limitParam = 15, filterId) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 필터 인덱스 조회
	const filterIds = await filterComponent.getSubFilterIdsByFilterId(filterId);

	// 검색 조건
	const values = { tutor_id: tutorId, institute_id: instituteId, filter_ids: filterIds, limit: parseInt(limit, 10) };

	// prettier-ignore
	const sql = [
		'SELECT `real_time_order`.`*` ',
		'FROM ( ',
		'	SELECT `reviews`.`id` AS `review_id`, `reviews`.`review_type`, null AS `comment_id`, `reviews`.`created_at` ',
		'	FROM `reviews` ',
		'	WHERE `reviews`.`is_deleted` = "N" ',
		'	AND `reviews`.`is_confirm` IN ( "Y", "N" ) ',
		'	AND `reviews`.`id` IN ( ',
		'		SELECT `union_review`.`review_id` ',
		'		FROM ( ',
		'			SELECT `tutor_reviews`.`review_id` ',
		'			FROM `tutor_reviews` ',
		'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_reviews`.`review_id` ',
		'			WHERE  `tutor_reviews`.`review_id` IS NOT NULL ',
		'			AND `reviews`.`is_deleted` = "N" ',
		'			AND `reviews`.`is_confirm` IN ( "Y", "N" ) ',
		(values.tutor_id != null) ? '	AND `tutor_reviews`.`tutor_id` = :tutor_id ' : ' ',
		(values.institute_id != null) ? '	AND `tutor_reviews`.`institute_id` = :institute_id ' : ' ',
		'			AND `tutor_reviews`.`filter_id` IN (:filter_ids) ',
		'				UNION ',
		'			SELECT `tutor_change_reviews`.`review_id` ',
		'			FROM `tutor_change_reviews` ',
		'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_change_reviews`.`review_id` ',
		'			WHERE  `tutor_change_reviews`.`review_id` IS NOT NULL ',
		'			AND `reviews`.`is_deleted` = "N" ',
		'			AND `reviews`.`is_confirm` IN ( "Y", "N" ) ',
		(values.tutor_id != null) ? '	AND ( `tutor_change_reviews`.`before_tutor_id` = :tutor_id OR `tutor_change_reviews`.`after_tutor_id` = :tutor_id ) ' : ' ',
		(values.institute_id != null) ? '	AND ( `tutor_change_reviews`.`before_institute_id` = :institute_id OR `tutor_change_reviews`.`after_institute_id` = :institute_id ) ' : ' ',
		'			AND ( `tutor_change_reviews`.`before_filter_id` IN (:filter_ids) OR `tutor_change_reviews`.`after_filter_id` IN (:filter_ids) ) ',
		'		) AS `union_review` ',
		'	) ',
		'		UNION ',
		'	SELECT `review_comments`.`review_id` AS `reveiw_id`, "comment", `review_comments`.`id` AS `comment_id`, `review_comments`.`created_at` ',
		'	FROM `review_comments` ',
		'	WHERE `review_comments`.`is_deleted` = "N" ',
		'	AND `review_comments`.`review_id` IN ( ',
		'	SELECT `union_review`.`review_id` ',
		'		FROM ( ',
		'			SELECT `tutor_reviews`.`review_id` ',
		'			FROM `tutor_reviews` ',
		'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_reviews`.`review_id` ',
		'			WHERE  `tutor_reviews`.`review_id` IS NOT NULL ',
		'			AND `reviews`.`is_deleted` = "N" ',
		'			AND `reviews`.`is_confirm` = "Y" ',
		(values.tutor_id != null) ? '	AND `tutor_reviews`.`tutor_id` = :tutor_id ' : ' ',
		(values.institute_id != null) ? '	AND `tutor_reviews`.`institute_id` = :institute_id ' : ' ',
		'			AND `tutor_reviews`.`filter_id` IN (:filter_ids) ',
		'				UNION ',
		'			SELECT `tutor_change_reviews`.`review_id` ',
		'			FROM `tutor_change_reviews` ',
		'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_change_reviews`.`review_id` ',
		'			WHERE  `tutor_change_reviews`.`review_id` IS NOT NULL ',
		'			AND `reviews`.`is_deleted` = "N" ',
		'			AND `reviews`.`is_confirm` = "Y" ',
		(values.tutor_id != null) ? '	AND ( `tutor_change_reviews`.`before_tutor_id` = :tutor_id OR `tutor_change_reviews`.`after_tutor_id` = :tutor_id ) ' : ' ',
		(values.institute_id != null) ? '	AND ( `tutor_change_reviews`.`before_institute_id` = :institute_id OR `tutor_change_reviews`.`after_institute_id` = :institute_id ) ' : ' ',
		'			AND ( `tutor_change_reviews`.`before_filter_id` IN (:filter_ids) OR `tutor_change_reviews`.`after_filter_id` IN (:filter_ids) ) ',
		'		) AS `union_review` ',
		'	) ',
		') AS `real_time_order` ',
		'ORDER BY `created_at` DESC ',
		'LIMIT 0, :limit; ',
	].join(' ');

	const reviewAndCommentList = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });

	return reviewAndCommentList;
};

// review_comment_id 로 리뷰 댓글 조회
export const getReviewCommentByReviewCommentId = async (reviewCommentId) => {
	const response = await ReviewComment.findOne({
		attributes: ['id', 'review_id', 'member_id', 'institute_id', 'tutor_id', 'family', 'sort_no', 'parent_id', 'depth', 'is_deleted', 'created_ip', 'created_at', 'updated_at'],
		where: { id: reviewCommentId },
		include: [
			{ model: Review, as: 'review' },
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCommentCount, as: 'count', attributes: ['view', 'recommend', 'opposition'] },
			{ model: ReviewCommentContent, as: 'content', attributes: ['title', 'content'] },
		],
	});
	return response;
};

// review_id 와 type 으로 리뷰 조회
export const getRealTimeReviewByIdAndType = async (reviewId, type) => {
	const response = await Review.findOne({
		attributes: ['id', 'member_id', `review_type`, 'is_confirm', 'average_point', 'created_at'],
		where: { id: reviewId, review_type: type },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
			{
				model: ReviewAnswer,
				as: 'review_question_answer',
				attributes: ['id'],
				include: [
					{
						model: ReviewQuestion,
						as: 'review_question',
						where: { answer_type: 'text', text_answer_type: 'title' },
						attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
						required: true,
					},
					{ model: ReviewAnswerText, as: 'review_answer', attributes: ['id', 'answer'], required: true },
				],
				required: true,
			},
		],
		distinct: true,
		subQuery: false,
	});
	return response;
};

// InstituteId 로 기관 리뷰 조회
export const getInstituteReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: InstituteReview,
				as: 'institute_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 Best 강사 리뷰 목록 조회
export const getBestTutorNormalReviewListByInstituteId = async (instituteId, limit, filterId) => {
	const response = await Review.findAll({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		limit: parseInt(limit, 10),
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 Best 강사 리뷰 조회
export const getBestTutorNormalReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 Best 강사 환승 리뷰 조회
export const getBestTutorTransferReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				where: {
					[Op.and]: [
						{ [Op.or]: [{ before_institute_id: instituteId }, { after_institute_id: instituteId }] },
						{
							[Op.or]: [
								{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
								{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
							],
						},
					],
				},
				required: true,
				include: [
					{
						model: Tutor,
						as: 'before_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
					{
						model: Tutor,
						as: 'after_tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 Best 기관 리뷰 목록 조회
export const getBestInstituteNormalReviewsByInstituteId = async (instituteId, filterId, offset = 0, limit = 10) => {
	const response = await Review.findAll({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: InstituteReview,
				as: 'institute_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	});

	for (let i = 0; i < response.length; i += 1) {
		const instituteType = response[i].dataValues.institute_review.dataValues.institute.dataValues.type;
		let children = null;
		if (['kindergarten', 'daycare'].includes(instituteType)) children = await instituteComponent.getInstituteChildrenByInstituteId(response[i].dataValues.institute_review.dataValues.institute_id); // eslint-disable-line no-await-in-loop
		response[i].dataValues.institute_review.dataValues.institute.dataValues.children = children;
	}

	// Return
	return response;
};

// InstituteId 로 Best 기관 리뷰 조회
export const getBestInstituteNormalReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: InstituteReview,
				as: 'institute_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 Best 기관 환승 리뷰 조회
export const getBestInstituteTransferReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: InstituteChangeReview,
				as: 'institute_change_review',
				where: {
					[Op.and]: [
						{ [Op.or]: [{ before_institute_id: instituteId }, { after_institute_id: instituteId }] },
						{
							[Op.or]: [
								{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
								{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
							],
						},
					],
				},
				required: true,
				include: [
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'before_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'after_subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 긍정 강사 Best 리뷰 조회
export const getPositiveTutorBestNormalReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y', average_point: { [Op.gte]: process.env.REVIEW_POSITIVE_NEGATIVE_DIVISION_BASE_POINT } },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['average_point', 'DESC'],
			['created_at', 'DESC'],
		],
	});

	// Return
	return response;
};

// InstituteId 로 부정 강사 Best 리뷰 조회
export const getNegativeTutorBestNormalReviewByInstituteId = async (instituteId, filterId) => {
	const response = await Review.findOne({
		attributes: [
			'id',
			'member_id',
			'review_type',
			'is_deleted',
			'is_confirm',
			'denied_comment',
			'average_point',
			'created_at',
			[
				sequelize.literal('(SELECT COUNT(`review_comments`.`id`) FROM `review_comments` WHERE `review_comments`.`review_id` = `Review`.`id`AND `review_comments`.`is_deleted` = "N")'),
				'comment_count',
			],
		],
		where: { is_deleted: 'N', is_confirm: 'Y', average_point: { [Op.lt]: process.env.REVIEW_POSITIVE_NEGATIVE_DIVISION_BASE_POINT } },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'sort_no', 'is_deleted'] },
					{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'] },
				],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition'] },
		],
		distinct: true,
		subQuery: false,
		order: [
			['average_point', 'ASC'],
			['created_at', 'DESC'],
		],
	});

	// Return
	return response;
};

// 실시간 기관 리뷰 & 기관 환승 리뷰 & 기관 댓글 조회
export const getInstituteRealTimeReviewAndComment = async (tutorId, instituteId, limitParam = 15, filterId) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 필터 인덱스 조회
	const filterIds = await filterComponent.getSubFilterIdsByFilterId(filterId);

	// 검색 조건
	const values = { tutor_id: tutorId, institute_id: instituteId, filter_ids: filterIds, limit: parseInt(limit, 10) };

	// prettier-ignore
	const sql = [
			'SELECT `real_time_order`.`*` ',
			'FROM ( ',
			'	SELECT `reviews`.`id` AS `review_id`, `reviews`.`review_type`, null AS `comment_id`, `reviews`.`created_at` ',
			'	FROM `reviews` ',
			'	WHERE `reviews`.`is_deleted` = "N" ',
			'	AND `reviews`.`is_confirm` IN ( "Y", "N" )',
			'	AND `reviews`.`id` IN ( ',
			'		SELECT `union_review`.`review_id` ',
			'		FROM ( ',
			'			SELECT `institute_reviews`.`review_id` ',
			'			FROM `institute_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `institute_reviews`.`review_id` ',
			'			WHERE `institute_reviews`.`institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` IN ( "Y", "N" )',
			'			AND `institute_reviews`.`filter_id` IN (:filter_ids) ',
			'				UNION ',
			'			SELECT `institute_change_reviews`.`review_id` ',
			'			FROM `institute_change_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `institute_change_reviews`.`review_id` ',
			'			WHERE `institute_change_reviews`.`before_institute_id` = :institute_id OR `institute_change_reviews`.`after_institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` IN ( "Y", "N" )',
			'			AND ( `institute_change_reviews`.`before_filter_id` IN (:filter_ids) OR `institute_change_reviews`.`after_filter_id` IN (:filter_ids) ) ',
			'				UNION ',
			'			SELECT `tutor_reviews`.`review_id` ',
			'			FROM `tutor_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_reviews`.`review_id` ',
			'			WHERE `tutor_reviews`.`institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` IN ( "Y", "N" )',
			'			AND `tutor_reviews`.`filter_id` IN (:filter_ids) ',
			'				UNION ',
			'			SELECT `tutor_change_reviews`.`review_id` ',
			'			FROM `tutor_change_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_change_reviews`.`review_id` ',
			'			WHERE `tutor_change_reviews`.`before_institute_id` = :institute_id OR `tutor_change_reviews`.`after_institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` IN ( "Y", "N" )',
			'			AND ( `tutor_change_reviews`.`before_filter_id` IN (:filter_ids) OR `tutor_change_reviews`.`after_filter_id` IN (:filter_ids) ) ',
			'		) AS `union_review` ',
			'	) ',
			'		UNION ',
			'	SELECT `review_comments`.`review_id` AS `reveiw_id`, "comment", `review_comments`.`id` AS `comment_id`, `review_comments`.`created_at` ',
			'	FROM `review_comments` ',
			'	WHERE `review_comments`.`is_deleted` = "N" ',
			'	AND `review_comments`.`review_id` IN ( ',
			'	SELECT `union_review`.`review_id` ',
			'		FROM ( ',
			'			SELECT `institute_reviews`.`review_id` ',
			'			FROM `institute_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `institute_reviews`.`review_id` ',
			'			WHERE `institute_reviews`.`institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` = "Y" ',
			'			AND `institute_reviews`.`filter_id` IN (:filter_ids) ',
			'				UNION ',
			'			SELECT `institute_change_reviews`.`review_id` ',
			'			FROM `institute_change_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `institute_change_reviews`.`review_id` ',
			'			WHERE `institute_change_reviews`.`before_institute_id` = :institute_id OR `institute_change_reviews`.`after_institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` = "Y" ',
			'			AND ( `institute_change_reviews`.`before_filter_id` IN (:filter_ids) OR `institute_change_reviews`.`after_filter_id` IN (:filter_ids) ) ',
			'				UNION ',
			'			SELECT `tutor_reviews`.`review_id` ',
			'			FROM `tutor_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_reviews`.`review_id` ',
			'			WHERE `tutor_reviews`.`institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` = "Y" ',
			'			AND `tutor_reviews`.`filter_id` IN (:filter_ids) ',
			'				UNION ',
			'			SELECT `tutor_change_reviews`.`review_id` ',
			'			FROM `tutor_change_reviews` ',
			'			INNER JOIN `reviews` ON `reviews`.`id` = `tutor_change_reviews`.`review_id` ',
			'			WHERE `tutor_change_reviews`.`before_institute_id` = :institute_id OR `tutor_change_reviews`.`after_institute_id` = :institute_id ',
			'			AND `reviews`.`is_deleted` = "N" ',
			'			AND `reviews`.`is_confirm` = "Y" ',
			'			AND ( `tutor_change_reviews`.`before_filter_id` IN (:filter_ids) OR `tutor_change_reviews`.`after_filter_id` IN (:filter_ids) ) ',
			'		) AS `union_review` ',
			'	) ',
			') AS `real_time_order` ',
			'ORDER BY `created_at` DESC ',
			'LIMIT 0, :limit; ',
		].join(' ');

	const reviewAndCommentList = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });

	return reviewAndCommentList;
};

// 리뷰 로그 정보 조회
export const getCheckReviewLog = async (reviewId, memberId, createdIp) => {
	// 검색 조건
	const values = { review_id: reviewId, member_id: memberId, created_ip: createdIp };

	const sql = [
		'SELECT COUNT(`review_id`) AS `count` ',
		'FROM `review_count_logs` ',
		'WHERE `review_count_logs`.`review_id` = :review_id ',
		values.member_id != null ? 'AND `review_count_logs`.`member_id` = :member_id ' : 'AND `review_count_logs`.`member_id` IS NULL ',
		'AND `review_count_logs`.`created_ip` = :created_ip ',
		'AND TIMESTAMPDIFF(minute, date_format(`review_count_logs`.`created_at`, "%Y-%m-%d %H:%i"), date_format(NOW(), "%Y-%m-%d %H:%i")) < 10; ',
	].join(' ');

	// Return
	const response = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	return response[0].count;
};

// 리뷰 조회수 증가
export const postPlusReviewViewCount = async (reviewId, t) => {
	const response = await ReviewCount.update({ view: sequelize.literal(`view + 1`) }, { where: { review_id: reviewId }, transaction: t });
	return response;
};

// 리뷰 추천 및 비추천 여부 조회
export const isExistReviewCountLog = async (reviewId, type, memberId) => {
	const response = await ReviewCountLog.findOne({ where: { review_id: reviewId, type, member_id: memberId } });
	return response;
};

// 리뷰 추천 & 비추천 로그 작성
export const postReviewCountLog = async (reviewId, type, memberId, createdIp, isGetId = false, t) => {
	const response = await ReviewCountLog.create({ review_id: reviewId, type, member_id: memberId, created_ip: createdIp }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.review_id : response;
};

// 리뷰 추천 & 비추천 로그 삭제
export const deleteReviewCountLog = async (reviewId, type, memberId, t) => {
	const response = await ReviewCountLog.destroy({ where: { review_id: reviewId, type, member_id: memberId }, transaction: t });
	return response;
};

// 리뷰 추천 카운트 증가
export const postPlusReviewRecommend = async (reviewId, t) => {
	const response = await ReviewCount.update({ recommend: sequelize.literal(`recommend + 1`) }, { where: { review_id: reviewId }, transaction: t });
	return response;
};

// 리뷰 비추천 카운트 증가
export const postPlusReviewOpposition = async (reviewId, t) => {
	const response = await ReviewCount.update({ opposition: sequelize.literal(`opposition + 1`) }, { where: { review_id: reviewId }, transaction: t });
	return response;
};

// 리뷰 추천 카운트 감소
export const postMinusReviewRecommend = async (reviewId, t) => {
	const response = await ReviewCount.update({ recommend: sequelize.literal(`recommend - 1`) }, { where: { review_id: reviewId }, transaction: t });
	return response;
};

// 리뷰 비추천 카운트 감소
export const postMinusReviewOpposition = async (reviewId, t) => {
	const response = await ReviewCount.update({ opposition: sequelize.literal(`opposition - 1`) }, { where: { review_id: reviewId }, transaction: t });
	return response;
};

// 리뷰 댓글 추천 및 비추천 여부 조회
export const isExistReviewCommentCountLog = async (reviewCommentId, memberId) => {
	const response = await ReviewCommentCountLog.findOne({ where: { review_comment_id: reviewCommentId, member_id: memberId } });
	return response;
};

// 리뷰 댓글 추천 & 비추천 로그 작성
export const postReviewCommentCountLog = async (reviewCommentId, type, memberId, isGetId = false, t) => {
	const response = await ReviewCommentCountLog.create({ review_comment_id: reviewCommentId, type, member_id: memberId }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.review_comment_id : response;
};

// 리뷰 댓글 추천 & 비추천 로그 삭제
export const deleteReviewCommentCountLog = async (reviewCommentId, type, memberId, t) => {
	const response = await ReviewCommentCountLog.destroy({ where: { review_comment_id: reviewCommentId, type, member_id: memberId }, transaction: t });
	return response;
};

// 리뷰 댓글 추천 카운트 증가
export const postPlusReviewCommentRecommend = async (reviewCommentId, t) => {
	const response = await ReviewCommentCount.update({ recommend: sequelize.literal(`recommend + 1`) }, { where: { review_comment_id: reviewCommentId }, transaction: t });
	return response;
};

// 리뷰 댓글 비추천 카운트 증가
export const postPlusReviewCommentOpposition = async (reviewCommentId, t) => {
	const response = await ReviewCommentCount.update({ opposition: sequelize.literal(`opposition + 1`) }, { where: { review_comment_id: reviewCommentId }, transaction: t });
	return response;
};

// 리뷰 댓글 추천 카운트 감소
export const postMinusReviewCommentRecommend = async (reviewCommentId, t) => {
	const response = await ReviewCommentCount.update({ recommend: sequelize.literal(`recommend - 1`) }, { where: { review_comment_id: reviewCommentId }, transaction: t });
	return response;
};

// 리뷰 댓글 비추천 카운트 감소
export const postMinusReviewCommentOpposition = async (reviewCommentId, t) => {
	const response = await ReviewCommentCount.update({ opposition: sequelize.literal(`opposition - 1`) }, { where: { review_comment_id: reviewCommentId }, transaction: t });
	return response;
};

// 리뷰 댓글 수정
export const updateReviewCommentByCommentId = async (reviewComment, t) => {
	const response = await ReviewComment.update({ family: reviewComment.family }, { where: { id: reviewComment.id }, transaction: t });
	return response;
};

// 강사 인덱스와 과목 인덱스에 따른 리뷰 갯수 조회
export const getTutorReviewByTutorIdAndSubjectId = async (tutorId, subjectId, filterId) => {
	const response = await TutorReview.count({ where: { tutor_id: tutorId, subject_id: subjectId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } } });
	return response;
};

// 해당 강사로 변경을 많이한 강사 조회
export const getBeforeChangeTutorIdAndCountByTutorId = async (tutorId, limit, filterId) => {
	const response = await TutorChangeReview.findAll({
		attributes: ['before_tutor_id', [sequelize.literal('COUNT(`before_tutor_id`)'), 'before_tutor_count']],
		where: {
			after_tutor_id: tutorId,
			[Op.or]: [
				{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
			],
		},
		include: [{ model: Review, as: 'review', where: { is_confirm: 'Y' }, attributes: [] }],
		group: 'before_tutor_id',
		order: [
			[sequelize.literal('COUNT(`before_tutor_id`)'), 'DESC'],
			['before_tutor_id', 'ASC'],
		],
		limit,
	});
	return response;
};

// 해당 강사에서 변경을 많이한 강사 조회
export const getAfterChangeTutorIdAndCountByTutorId = async (tutorId, limit, filterId) => {
	const response = await TutorChangeReview.findAll({
		attributes: ['after_tutor_id', [sequelize.literal('COUNT(`after_tutor_id`)'), 'after_tutor_count']],
		where: {
			before_tutor_id: tutorId,
			[Op.or]: [
				{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
			],
		},
		include: [{ model: Review, as: 'review', where: { is_confirm: 'Y' }, attributes: [] }],
		group: 'after_tutor_id',
		order: [
			[sequelize.literal('COUNT(`after_tutor_id`)'), 'DESC'],
			['after_tutor_id', 'ASC'],
		],
		limit,
	});
	return response;
};

// 강사 인덱스로 강사 총 리뷰 수 조회
export const getTutorReviewCountByTutorId = async (tutorId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'tutor', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, is_deleted: 'N' },
		include: [{ model: TutorReview, as: 'tutor_review', where: { tutor_id: tutorId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } } }],
	});
	return response;
};

// 강사 인덱스로 강사 환승 총 리뷰 수 조회
export const getTutorChangeReviewCountByTutorId = async (tutorId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'tutor_change', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, is_deleted: 'N' },
		include: [
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				where: {
					[Op.and]: [
						{ [Op.or]: [{ before_tutor_id: tutorId }, { after_tutor_id: tutorId }] },
						{
							[Op.or]: [
								{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
								{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
							],
						},
					],
				},
			},
		],
	});
	return response;
};

// 기관 인덱스로 강사 총 리뷰 수 조회
export const getTutorReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'tutor', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, is_deleted: 'N' },
		include: [{ model: TutorReview, as: 'tutor_review', where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } } }],
	});
	return response;
};

// 기관 인덱스로 강사 환승 총 리뷰 수 조회
export const getTutorChangeReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'tutor_change', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, is_deleted: 'N' },
		include: [
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				where: {
					[Op.and]: [
						{ [Op.or]: [{ before_institute_id: instituteId }, { after_institute_id: instituteId }] },
						{
							[Op.or]: [
								{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
								{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
							],
						},
					],
				},
			},
		],
	});
	return response;
};

// 기관 인덱스로 기관 총 리뷰 수 조회
export const getInstituteReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'institute', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, is_deleted: 'N' },
		include: [{ model: InstituteReview, as: 'institute_review', where: { institute_id: instituteId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } } }],
	});
	return response;
};

// 기관 인덱스로 기관 환승 총 리뷰 수 조회
export const getInstituteChangeReviewCountByInstituteId = async (instituteId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'institute_change', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, is_deleted: 'N' },
		include: [
			{
				model: InstituteChangeReview,
				as: 'institute_change_review',
				where: {
					[Op.and]: [
						{ [Op.or]: [{ before_institute_id: instituteId }, { after_institute_id: instituteId }] },
						{
							[Op.or]: [
								{ before_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
								{ after_filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
							],
						},
					],
				},
			},
		],
	});
	return response;
};

// 리뷰 인덱스로 리뷰 총 댓글 수 조회
export const getReviewCommentCountByReviewId = async (reviewId) => {
	const response = await ReviewComment.count({ where: { review_id: reviewId, is_deleted: 'N' } });
	return response;
};

// 리뷰 인덱스로 최근 작성된 리뷰 조회
export const getLastCreateReviewCommentByReviewId = async (reviewId) => {
	const response = await ReviewComment.findOne({
		attributes: ['id', 'sort_no', 'parent_id', 'depth', 'is_deleted'],
		where: { review_id: reviewId, is_deleted: 'N' },
		include: [{ model: ReviewCommentContent, as: 'content', attributes: ['title', 'content'] }],
		order: [['created_at', 'DESC']],
	});
	return response;
};

// 검색 항목에 따른 리뷰 댓글 목록 조회
export const getReviewCommentBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const reviewComment = searchFields.review_comment ? searchFields.review_comment : null;
	let response = null;

	// 검색 조건
	const values = { review_id: reviewComment.review_id, offset: parseInt(offset, 10), limit: parseInt(limit, 10) };
	if (reviewComment) values.is_deleted = reviewComment.is_deleted || null;

	const sql = [
		'FROM `review_comments` AS `comment` ',
		'INNER JOIN `review_comment_contents` AS `content` ON `comment`.`id` = `content`.`review_comment_id` ',
		'INNER JOIN `review_comment_counts` AS `count` ON `comment`.`id` = `count`.`review_comment_id` ',
		'INNER JOIN `members` AS `member` ON `comment`.`member_id` = `member`.`id` ',
		'INNER JOIN `member_attributes` AS `attribute` ON `member`.`id` = `attribute`.`member_id` ',
		'WHERE `comment`.`id` IS NOT NULL ',
		'AND `comment`.`review_id` = :review_id ',
		values.is_deleted ? 'AND `comment`.`is_deleted` = :is_deleted ' : ' ',
		'ORDER BY `family` DESC, `sort_no` ASC ',
	].join(' ');

	const countSql = ['SELECT ', '	COUNT(`comment`.`id`) AS `total` '].join(' ') + sql;

	// Total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const reviewCommentSql =
			// eslint-disable-next-line prefer-template
			[
				'SELECT ',
				'	`comment`.`id`, ',
				'	`comment`.`review_id`, ',
				'	`comment`.`member_id`, ',
				'	`comment`.`nickname`, ',
				'	`comment`.`is_anonymous`, ',
				'	`comment`.`institute_id`, ',
				'	`comment`.`tutor_id`, ',
				'	CASE ',
				'		WHEN ',
				'			`comment`.`family` IS NULL ',
				'		THEN ',
				'			`comment`.`id` ',
				'		ELSE ',
				'			`comment`.`family` ',
				'	END `family`, ',
				'	`comment`.`sort_no`, ',
				'	`comment`.`parent_id`, ',
				'	`comment`.`depth`, ',
				'	`comment`.`is_deleted`, ',
				'	`comment`.`created_ip`, ',
				'	`comment`.`created_at`, ',
				'	`comment`.`updated_at`, ',
				'	`content`.`title`, ',
				'	`content`.`content`, ',
				'	`count`.`view`, ',
				'	`count`.`recommend`, ',
				'	`count`.`opposition`, ',
				'	`member`.`user_id`, ',
				'	`member`.`nickname`, ',
				'	`member`.`join_site`, ',
				'	`member`.`join_type`, ',
				'	`member`.`join_ip`, ',
				'	`attribute`.`name`, ',
				'	`attribute`.`sex`, ',
				'	`attribute`.`birthday`, ',
				'	`attribute`.`email`, ',
				'	`attribute`.`phone`, ',
				'	`attribute`.`thumbnail` ',
			].join(' ') +
			sql +
			'LIMIT :offset, :limit;';

		// 리뷰 댓글 목록 조회
		const reviewCommentData = await sequelize.query(reviewCommentSql, { type: sequelize.QueryTypes.SELECT, replacements: values });

		const reviewComments = [];

		for (let i = 0; i < reviewCommentData.length; i += 1) {
			const tmpData = {
				id: reviewCommentData[i].id,
				review_id: reviewCommentData[i].review_id,
				member_id: reviewCommentData[i].member_id,
				nickname: reviewCommentData[i].nickname,
				is_anonymous: reviewCommentData[i].is_anonymous,
				member: {
					user_id: reviewCommentData[i].user_id,
					nickname: reviewCommentData[i].nickname,
					join_site: reviewCommentData[i].join_site,
					join_type: reviewCommentData[i].join_type,
					join_ip: reviewCommentData[i].join_ip,
					attribute: {
						name: reviewCommentData[i].name,
						sex: reviewCommentData[i].sex,
						birthday: reviewCommentData[i].birthday,
						email: reviewCommentData[i].email,
						phone: reviewCommentData[i].phone,
						thumbnail: reviewCommentData[i].thumbnail,
					},
				},
				institute_id: reviewCommentData[i].institute_id,
				tutor_id: reviewCommentData[i].tutor_id,
				family: reviewCommentData[i].family,
				sort_no: reviewCommentData[i].sort_no,
				parent_id: reviewCommentData[i].parent_id,
				depth: reviewCommentData[i].depth,
				is_deleted: reviewCommentData[i].is_deleted,
				created_ip: reviewCommentData[i].created_ip,
				created_at: reviewCommentData[i].created_at,
				updated_at: reviewCommentData[i].updated_at,
				content: { title: reviewCommentData[i].title, content: reviewCommentData[i].content },
				count: {
					view: reviewCommentData[i].view,
					recommend: reviewCommentData[i].recommend,
					opposition: reviewCommentData[i].opposition,
				},
			};
			reviewComments[i] = tmpData;
		}
		if (Object.keys(reviewComments).length > 0) response = { total, list: reviewComments };
	}

	// Return
	return response || null;
};

// 리뷰 댓글 삭제
export const deleteReviewCommentById = async (reviewCommentId, loginMemberId) => {
	const response = await ReviewComment.update({ is_deleted: 'Y' }, { where: { id: reviewCommentId, member_id: loginMemberId } });
	return response;
};

// 리뷰 댓글 Depth 1의 마지막 sort_no 반환
export const getReviewCommentDapthOneLastSortNoByReviewId = async (reviewId) => {
	const response = await ReviewComment.findOne({ where: { review_id: reviewId, depth: 1 }, order: [['sort_no', 'DESC']] });
	return response;
};

// review_comment 에서 같은 family 에 소속되어 있고 해당 sort_no 보다 큰 comment 들의 sort_no + 1 추가
export const updateReviewCommentSortNo = async (family, sortNo) => {
	const response = await ReviewComment.update({ sort_no: sequelize.literal('sort_no + 1') }, { where: { family, sort_no: { [Op.gt]: sortNo } } });
	return response;
};

// 리뷰 댓글 등록
export const addReviewComment = async (reviewComment, isGetId = false, t) => {
	const response = await ReviewComment.create(
		{
			review_id: reviewComment.review_id,
			member_id: reviewComment.member_id,
			nickname: reviewComment.nickname,
			is_anonymous: reviewComment.is_anonymous,
			institute_id: reviewComment.institute_id,
			tutor_id: reviewComment.tutor_id,
			family: reviewComment.family,
			sort_no: reviewComment.sort_no,
			parent_id: reviewComment.parent_id,
			depth: reviewComment.depth,
			is_deleted: reviewComment.is_deleted,
			created_ip: reviewComment.created_ip,
			created_at: reviewComment.created_at,
			updated_at: reviewComment.updated_at,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 리뷰 내용 등록
export const addreviewCommentContent = async (reviewCommentContent, isGetId = false, t) => {
	const response = await ReviewCommentContent.create(
		{
			review_comment_id: reviewCommentContent.review_comment_id,
			title: reviewCommentContent.title,
			content: reviewCommentContent.content,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.review_comment_id : response;
};

// 리뷰 조회수 및 추천수 등록
export const addReviewCommentCount = async (reviewCommentCount, isGetId = false, t) => {
	const response = await ReviewCommentCount.create(
		{ review_comment_id: reviewCommentCount.review_comment_id, view: reviewCommentCount.view, recommend: reviewCommentCount.recommend, opposition: reviewCommentCount.opposition },
		{ transaction: t },
	);

	// Return
	return isGetId ? response.dataValues.review_comment_id : response;
};

// 강사 인덱스와 과목 인덱스에 따른 강사 긍정 리뷰 수
export const getPositiveTutorReviewCountByTutorIdAndSubjectId = async (tutorId, subjectId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'tutor', is_deleted: 'N', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, average_point: { [Op.gte]: process.env.REVIEW_GOOD_NORMAL_DIVISION_BASE_POINT } },
		include: [
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { tutor_id: tutorId, subject_id: subjectId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
			},
		],
	});
	return response;
};

// 강사 인덱스와 과목 인덱스에 따른 강사 보통 리뷰 수
export const getNormalTutorReviewCountByTutorIdAndSubjectId = async (tutorId, subjectId, filterId) => {
	const response = await Review.count({
		where: {
			review_type: 'tutor',
			is_deleted: 'N',
			is_confirm: { [Op.in]: ['REQUEST', 'Y'] },
			[Op.and]: [{ average_point: { [Op.gte]: process.env.REVIEW_NORMAL_BAD_DIVISION_BASE_POINT } }, { average_point: { [Op.lt]: process.env.REVIEW_GOOD_NORMAL_DIVISION_BASE_POINT } }],
		},
		include: [
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { tutor_id: tutorId, subject_id: subjectId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
			},
		],
	});
	return response;
};

// 강사 인덱스와 과목 인덱스에 따른 강사 부정 리뷰 수
export const getNegativeTutorReviewCountByTutorIdAndSubjectId = async (tutorId, subjectId, filterId) => {
	const response = await Review.count({
		where: { review_type: 'tutor', is_deleted: 'N', is_confirm: { [Op.in]: ['REQUEST', 'Y'] }, average_point: { [Op.lt]: process.env.REVIEW_NORMAL_BAD_DIVISION_BASE_POINT } },
		include: [
			{
				model: TutorReview,
				as: 'tutor_review',
				where: { tutor_id: tutorId, subject_id: subjectId, filter_id: { [Op.in]: await filterComponent.getSubFilterIdsByFilterId(filterId) } },
				required: true,
			},
		],
	});
	return response;
};

// 리뷰 조회 카운트 증가
export const addReviewViewCount = async (reviewId, memberId) => {
	await ReviewCount.update({ view: sequelize.literal(`view + 1`) }, { where: { review_id: reviewId } });
	const response = await ReviewCountLog.create({ review_id: reviewId, type: 'view', member_id: memberId });
	return response;
};

// 검색 항목에 따른 메인페이지 강사 일반 리뷰 목록 조회
export const getMainPageTutorNormalReviewsBySearchFields = async (searchFields, limit) => {
	// 검색필터
	const reviewAttr = {};
	if (searchFields.min_point) reviewAttr.average_point = { [Op.gte]: parseInt(searchFields.min_point, 10) };
	if (searchFields.max_point) reviewAttr.average_point = { [Op.lte]: parseInt(searchFields.max_point, 10) };

	const tutorReviewAttr = {};
	if (searchFields.filter_id) {
		const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
		tutorReviewAttr.filter_id = { [Op.in]: filterIds };
	}

	const sql = {
		attributes: ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment', 'average_point', 'created_ip', 'created_at', 'updated_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: TutorReview,
				as: 'tutor_review',
				attributes: ['tutor_id', 'institute_id', 'filter_id', 'subject_id'],
				where: tutorReviewAttr,
				required: true,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
						required: true,
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
						required: true,
					},
					{ model: Filter, as: 'filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
					{ model: Subject, as: 'subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
				],
			},
		],
		limit: parseInt(limit, 10),
		subQuery: false,
	};

	// 정렬순서
	if (searchFields.order === 'last_at')
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

	// Return
	const response = await Review.findAll(sql);
	return response;
};

// 검색 항목에 따른 메인페이지 강사 환승 리뷰 조회
export const getMainPageTutorChangeReviewsBySearchFields = async (searchFields, limit) => {
	// 검색필터
	const tutorChangeReviewAttr = {};
	if (searchFields.filter_id) {
		const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
		tutorChangeReviewAttr[Op.or] = [{ before_filter_id: { [Op.in]: filterIds } }, { after_filter_id: { [Op.in]: filterIds } }];
	}

	const sql = {
		attributes: ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment', 'average_point', 'created_ip', 'created_at', 'updated_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				attributes: ['before_tutor_id', 'before_institute_id', 'before_filter_id', 'before_subject_id', 'after_tutor_id', 'after_institute_id', 'after_filter_id', 'after_subject_id'],
				where: tutorChangeReviewAttr,
				required: true,
				include: [
					{
						model: Tutor,
						as: 'before_tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
						required: true,
					},
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
						required: true,
					},
					{ model: Filter, as: 'before_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
					{ model: Subject, as: 'before_subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
					{
						model: Tutor,
						as: 'after_tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
						required: true,
					},
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
						required: true,
					},
					{ model: Filter, as: 'after_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
					{ model: Subject, as: 'after_subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
				],
			},
		],
		limit: parseInt(limit, 10),
		subQuery: false,
	};

	// 정렬순서
	if (searchFields.order === 'last_at')
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

	// Return
	const response = await Review.findAll(sql);
	return response;
};

// 검색 항목에 따른 메인페이지 기관 일반 리뷰 목록 조회
export const getMainPageInstituteNormalReviewsBySearchFields = async (searchFields, limit) => {
	let response = null;
	// 검색 필터
	const reviewAttr = {};
	if (searchFields.min_point) reviewAttr.average_point = { [Op.gte]: parseInt(searchFields.min_point, 10) };
	if (searchFields.max_point) reviewAttr.average_point = { [Op.lte]: parseInt(searchFields.max_point, 10) };

	const instituteReviewAttr = {};
	if (searchFields.filter_id) {
		const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
		instituteReviewAttr.filter_id = { [Op.in]: filterIds };
	}

	const sql = {
		attributes: ['id', 'member_id', 'review_type', 'is_deleted', 'is_confirm', 'denied_comment', 'average_point', 'created_ip', 'created_at', 'updated_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
				required: true,
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: InstituteReview,
				as: 'institute_review',
				attributes: ['institute_id', 'filter_id', 'subject_id'],
				where: instituteReviewAttr,
				required: true,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
						required: true,
					},
					{ model: Filter, as: 'filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
					{ model: Subject, as: 'subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' }, required: true },
				],
			},
		],
		limit: parseInt(limit, 10),
		subQuery: false,
	};

	// 정렬순서
	if (searchFields.order === 'last_at')
		sql.order = [
			['created_at', 'DESC'],
			['id', 'DESC'],
		];

	const instituteReviews = await Review.findAll(sql);
	if (instituteReviews) {
		for (let i = 0; i < instituteReviews.length; i += 1) {
			let region = null;
			const relationRegion = await regionComponent.getRegionInfoByInstituteId(instituteReviews[i].dataValues.institute_review.dataValues.institute_id); // eslint-disable-line no-await-in-loop
			if (relationRegion) region = await regionComponent.getFullRegionInfoById(relationRegion.dataValues.region_id); // eslint-disable-line no-await-in-loop
			instituteReviews[i].dataValues.institute_review.dataValues.institute.dataValues.region = region;
		}
		response = instituteReviews;
	}
	// Return
	return response;
};

// 승인된 강사 리뷰 Last_at 조회
export const getLastTutorReviewBySearchFieldsAndInstituteIds = async (searchFields, instituteIds = []) => {
	const tutorReviewAttr = {};
	if (searchFields.filter_id) {
		const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
		tutorReviewAttr.filter_id = { [Op.in]: filterIds };
	}
	if (Object.keys(instituteIds).length > 0) tutorReviewAttr.institute_id = { [Op.in]: instituteIds };
	const response = await Review.findOne({
		attributes: ['id', 'member_id', `review_type`, 'is_confirm', 'average_point', 'created_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: TutorReview,
				as: 'tutor_review',
				attributes: ['tutor_id', 'institute_id', 'filter_id', 'subject_id'],
				where: tutorReviewAttr,
				include: [
					{
						model: Tutor,
						as: 'tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						where: { is_deleted: 'N' },
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N' },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{ model: Subject, as: 'subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
				],
				required: true,
			},
			{
				model: ReviewAnswer,
				as: 'review_question_answer',
				attributes: ['id'],
				include: [
					{
						model: ReviewQuestion,
						as: 'review_question',
						where: { answer_type: 'text', text_answer_type: 'title' },
						attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
						required: true,
					},
					{ model: ReviewAnswerText, as: 'review_answer', attributes: ['id', 'answer'], required: true },
				],
				required: true,
			},
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});
	return response;
};

// 승인된 강사 환승 리뷰 Last_at 조회
export const getLastTutorChangeReviewBySearchFieldsAndInstituteIds = async (searchFields, instituteIds = []) => {
	const tutorChangeReviewAttr = {};
	const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
	// eslint-disable-next-line no-unused-expressions
	Object.keys(instituteIds).length > 0
		? (tutorChangeReviewAttr[Op.and] = [
				{ [Op.or]: [{ before_filter_id: { [Op.in]: filterIds } }, { after_filter_id: { [Op.in]: filterIds } }] },
				{ [Op.or]: [{ before_institute_id: { [Op.in]: instituteIds } }, { after_institute_id: { [Op.in]: instituteIds } }] },
		  ])
		: (tutorChangeReviewAttr[Op.or] = [{ before_filter_id: { [Op.in]: filterIds } }, { after_filter_id: { [Op.in]: filterIds } }]);
	const response = await Review.findOne({
		attributes: ['id', 'member_id', `review_type`, 'is_confirm', 'average_point', 'created_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: TutorChangeReview,
				as: 'tutor_change_review',
				attributes: ['before_tutor_id', 'before_institute_id', 'before_filter_id', 'before_subject_id', 'after_tutor_id', 'after_institute_id', 'after_filter_id', 'after_subject_id'],
				where: tutorChangeReviewAttr,
				include: [
					{
						model: Tutor,
						as: 'before_tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						where: { is_deleted: 'N' },
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N' },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{ model: Subject, as: 'before_subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{
						model: Tutor,
						as: 'after_tutor',
						attributes: ['name', 'is_deleted', 'is_confirm'],
						where: { is_deleted: 'N' },
						include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
					},
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N' },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{ model: Subject, as: 'after_subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
				],
				required: true,
			},
			{
				model: ReviewAnswer,
				as: 'review_question_answer',
				attributes: ['id'],
				include: [
					{
						model: ReviewQuestion,
						as: 'review_question',
						where: { answer_type: 'text', text_answer_type: 'title' },
						attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
						required: true,
					},
					{ model: ReviewAnswerText, as: 'review_answer', attributes: ['id', 'answer'], required: true },
				],
				required: true,
			},
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});
	return response;
};

// 승인된 기관 리뷰 Last_at 조회
export const getLastInstituteReviewBySearchFieldsAndInstituteIds = async (searchFields, instituteIds = []) => {
	const instituteReviewAttr = {};
	if (searchFields.filter_id) {
		const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
		instituteReviewAttr.filter_id = { [Op.in]: filterIds };
	}
	if (Object.keys(instituteIds).length > 0) instituteReviewAttr.institute_id = { [Op.in]: instituteIds };

	const review = await Review.findOne({
		attributes: ['id', 'member_id', `review_type`, 'is_confirm', 'average_point', 'created_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: InstituteReview,
				as: 'institute_review',
				attributes: ['institute_id', 'filter_id', 'subject_id'],
				where: instituteReviewAttr,
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N' },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{ model: Subject, as: 'subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
				],
				required: true,
			},
			{
				model: ReviewAnswer,
				as: 'review_question_answer',
				attributes: ['id'],
				include: [
					{
						model: ReviewQuestion,
						as: 'review_question',
						where: { answer_type: 'text', text_answer_type: 'title' },
						attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
						required: true,
					},
					{ model: ReviewAnswerText, as: 'review_answer', attributes: ['id', 'answer'], required: true },
				],
				required: true,
			},
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	if (review) {
		let region = null;
		const relationRegion = await regionComponent.getRegionInfoByInstituteId(review.dataValues.institute_review.dataValues.institute_id);
		if (relationRegion) region = await regionComponent.getFullRegionInfoById(relationRegion.dataValues.region_id);
		review.dataValues.institute_review.dataValues.institute.dataValues.region = region;
	}

	// Return
	return review;
};

// 승인된 기관 환승 리뷰 Last_at 조회
export const getLastInstituteChangeReviewBySearchFieldsAndInstituteIds = async (searchFields, instituteIds = []) => {
	const instituteChangeReviewAttr = {};
	const filterIds = await filterComponent.getSubFilterIdsByFilterId(searchFields.filter_id);
	// eslint-disable-next-line no-unused-expressions
	Object.keys(instituteIds).length > 0
		? (instituteChangeReviewAttr[Op.and] = [
				{ [Op.or]: [{ before_filter_id: { [Op.in]: filterIds } }, { after_filter_id: { [Op.in]: filterIds } }] },
				{ [Op.or]: [{ before_institute_id: { [Op.in]: instituteIds } }, { after_institute_id: { [Op.in]: instituteIds } }] },
		  ])
		: (instituteChangeReviewAttr[Op.or] = [{ before_filter_id: { [Op.in]: filterIds } }, { after_filter_id: { [Op.in]: filterIds } }]);

	const review = await Review.findOne({
		attributes: ['id', 'member_id', `review_type`, 'is_confirm', 'average_point', 'created_at'],
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['user_id', 'nickname', 'join_site', 'join_type', 'join_ip'],
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'birthday', 'email', 'phone', 'thumbnail'] }],
			},
			{ model: ReviewCount, as: 'count', attributes: ['recommend', 'opposition', 'view'] },
			{
				model: InstituteChangeReview,
				as: 'institute_change_review',
				attributes: ['before_institute_id', 'before_filter_id', 'before_subject_id', 'after_institute_id', 'after_filter_id', 'after_subject_id'],
				where: instituteChangeReviewAttr,
				include: [
					{
						model: Institute,
						as: 'before_institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N' },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'before_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{ model: Subject, as: 'before_subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{
						model: Institute,
						as: 'after_institute',
						attributes: ['name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						where: { is_deleted: 'N' },
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
					{ model: Filter, as: 'after_filter', attributes: ['code', 'name', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
					{ model: Subject, as: 'after_subject', attributes: ['name', 'comment', 'sort_no', 'is_deleted'], where: { is_deleted: 'N' } },
				],
				required: true,
			},
			{
				model: ReviewAnswer,
				as: 'review_question_answer',
				attributes: ['id'],
				include: [
					{
						model: ReviewQuestion,
						as: 'review_question',
						where: { answer_type: 'text', text_answer_type: 'title' },
						attributes: ['id', 'answer_type', 'question', 'text_answer_type'],
						required: true,
					},
					{ model: ReviewAnswerText, as: 'review_answer', attributes: ['id', 'answer'], required: true },
				],
				required: true,
			},
		],
		distinct: true,
		subQuery: false,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
	});

	if (review) {
		let beforeRegion = null;
		let afterRegion = null;
		const beforeRelationRegion = await regionComponent.getRegionInfoByInstituteId(review.dataValues.institute_change_review.dataValues.before_institute_id);
		const afterRelationRegion = await regionComponent.getRegionInfoByInstituteId(review.dataValues.institute_change_review.dataValues.after_institute_id);
		if (beforeRelationRegion) beforeRegion = await regionComponent.getFullRegionInfoById(beforeRelationRegion.dataValues.region_id);
		if (afterRelationRegion) afterRegion = await regionComponent.getFullRegionInfoById(afterRelationRegion.dataValues.region_id);
		review.dataValues.institute_change_review.dataValues.before_institute.dataValues.region = beforeRegion;
		review.dataValues.institute_change_review.dataValues.after_institute.dataValues.region = afterRegion;
	}

	// Return
	return review;
};

// 타입에 따른 Last_at 리뷰 조회
export const getReviewsByTypeAndConfirm = async (type, confirm, limit) => {
	const reviewAttr = {};
	if (type) reviewAttr.review_type = type;
	if (confirm) reviewAttr.is_confirm = confirm;
	reviewAttr.is_deleted = 'N';

	const response = await Review.findAll({
		attributes: ['id', 'review_type', 'is_deleted', 'is_confirm', 'created_at'],
		where: reviewAttr,
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
		distinct: true,
		limit: parseInt(limit, 10),
	});
	return Object.keys(response).length === parseInt(limit, 10) ? response : null;
};

// 리뷰 댓글 Last_at 조회
export const getReviewComments = async (limit) => {
	const response = await ReviewComment.findAll({
		attributes: ['id', 'review_id', 'is_deleted', 'nickname', 'is_anonymous'],
		where: { is_deleted: 'N' },
		order: [
			['created_at', 'DESC'],
			['id', 'DESC'],
		],
		distinct: true,
		limit: parseInt(limit, 10),
	});
	return Object.keys(response).length === parseInt(limit, 10) ? response : null;
};

// reviews 에서 같은 family_id 에 속해 있는 댓글 수 조회
export const getReviewFamilyCountByFamily = async (family) => {
	const response = await ReviewComment.count({ where: { family } });
	return response;
};
