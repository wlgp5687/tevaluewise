import { Sequelize } from 'sequelize';
import { getModel, sequelize } from '../../database';
import { throwError } from '../../services';

const Op = Sequelize.Op;
const Filter = getModel('Filter');
const ReviewQuestionFilter = getModel('ReviewQuestionFilter');
const ReviewQuestion = getModel('ReviewQuestion');
const ReviewQuestionChoice = getModel('ReviewQuestionChoice');
const ReviewAnswerPoint = getModel('ReviewAnswerPoint');
const ReviewAnswerText = getModel('ReviewAnswerText');
const ReviewAnswerRegion = getModel('ReviewAnswerRegion');
const ReviewAnswerYear = getModel('ReviewAnswerYear');
const ReviewAnswerChoice = getModel('ReviewAnswerChoice');
const ReviewAnswer = getModel('ReviewAnswer');

// 필터 Code 와 리뷰 Type 을 통한 리뷰 질문 목록 조회
export const getReviewQuestionsByFilterCodeAndReviewType = async (code, reviewType) => {
	// 코드 분할
	const separationCode = code.substr(0, 8);
	// Return
	const response = await ReviewQuestion.findAll({
		where: { is_deleted: 'N' },
		attributes: [
			'id',
			'answer_type',
			'question',
			'placeholder',
			'text_answer_type',
			'pentagon',
			'collection_question_id',
			'collection_answer_id',
			'min_point',
			'max_point',
			'is_collection',
			'is_deleted',
		],
		include: [
			{
				model: ReviewQuestionFilter,
				as: 'review_question',
				attributes: ['id', 'review_type', 'sort', 'step', 'is_deleted'],
				where: { review_type: reviewType, is_deleted: 'N' },
				include: [{ model: Filter, as: 'filter', attributes: ['id', 'code', 'name', 'is_deleted'], where: { code: { [Op.or]: [code, separationCode] }, is_deleted: 'N' } }],
				required: true,
				order: [
					['step', 'ASC'],
					['sort', 'ASC'],
				],
			},
		],
	});
	return response;
};

// 리뷰 질문 Id 로 리뷰 선택형 답변 목록 조회
export const getReviewQuestionChoicesByReviewQuestionId = async (reviewQuestionId) => {
	const response = await ReviewQuestionChoice.findAll({ where: { review_question_id: reviewQuestionId }, attributes: ['id', 'answer'], order: [['id', 'ASC']] });
	// Return
	return response;
};

// 리뷰 질문 Id 로 포인트 답변 평균치 조회
export const getReviewQuestionPointByReviewQuestionId = async (reviewQuestionId) => {
	// 검색 조건
	const values = { review_question_id: reviewQuestionId };
	// prettier-ignore
	const sql = [
		'SELECT ',
		'	COUNT(`review_answer_points`.`point`) AS `count`, SUM(`review_answer_points`.`point`) AS `total` ',
		'FROM `review_answers` ',
		'INNER JOIN `review_answer_points` ON `review_answer_points`.`review_answer_id` = `review_answers`.`id` ',
		'WHERE `review_answers`.`review_question_id` = :review_question_id; '
	].join(' ');
	const response = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	// Return
	return response;
};

// 필터 Code 와 리뷰 Type 으로 질문 목록 및 선택지 조회
export const getReviewQuestionsWithAnswerByFilterIdAndReviewType = async (code, reviewType = null) => {
	// 질문 목록 조회
	const reviewQuestions = await getReviewQuestionsByFilterCodeAndReviewType(code, reviewType);

	for (let i = 0; i < reviewQuestions.length; i += 1) {
		if (reviewQuestions[i].dataValues.answer_type === 'choice') {
			const questionChoice = await getReviewQuestionChoicesByReviewQuestionId(reviewQuestions[i].dataValues.id); // eslint-disable-line no-await-in-loop
			reviewQuestions[i].dataValues.choice = questionChoice || null;
			reviewQuestions[i].dataValues.total_point = 0;
			reviewQuestions[i].dataValues.count_answer_point = 0;
		} else if (reviewQuestions[i].dataValues.answer_type === 'point') {
			const questionAnswerPoint = await getReviewQuestionPointByReviewQuestionId(reviewQuestions[i].dataValues.id); // eslint-disable-line no-await-in-loop
			reviewQuestions[i].dataValues.choice = null;
			reviewQuestions[i].dataValues.total_point = questionAnswerPoint[0].total ? questionAnswerPoint[0].total : 0;
			reviewQuestions[i].dataValues.count_answer_point = questionAnswerPoint[0].count ? questionAnswerPoint[0].count : 0;
		} else {
			reviewQuestions[i].dataValues.choice = null;
			reviewQuestions[i].dataValues.total_point = 0;
			reviewQuestions[i].dataValues.count_answer_point = 0;
		}
	}

	return reviewQuestions;
};

// 리뷰 Id 와 질문 Id 를 통한 리뷰 점수형 답변 조회
export const getReviewPointAnswerByReviewIdAndReviewQuestionId = async (reviewId, reviewQuestionId) => {
	const response = await ReviewAnswerPoint.findOne({
		attributes: ['point'],
		include: [{ model: ReviewAnswer, as: 'review_answer', where: { review_id: reviewId, review_question_id: reviewQuestionId }, attributes: [] }],
	});

	// Return
	return response.dataValues.point;
};

// 리뷰 Id 와 질문 Id 를 통한 리뷰 주관식 답변 조회
export const getReviewTextAnswerByReviewIdAndReviewQuestionId = async (reviewId, reviewQuestionId) => {
	const response = await ReviewAnswerText.findOne({
		attributes: ['answer'],
		include: [{ model: ReviewAnswer, as: 'review_answer', where: { review_id: reviewId, review_question_id: reviewQuestionId }, attributes: [] }],
	});

	// Return
	return response.dataValues.answer;
};

// 리뷰 Id 와 질문 Id 를 통한 리뷰 연도 답변 조회
export const getReviewYearAnswerByReviewIdAndReviewQuestionId = async (reviewId, reviewQuestionId) => {
	const response = await ReviewAnswerYear.findOne({
		attributes: ['answer'],
		include: [{ model: ReviewAnswer, as: 'review_answer', where: { review_id: reviewId, review_question_id: reviewQuestionId }, attributes: [] }],
	});

	// Return
	return response.dataValues.answer;
};

// 리뷰 Id 와 질문 Id 를 통한 리뷰 선택형 답변 조회
export const getReviewChoiceAnswerByReviewIdAndReviewQuestionId = async (reviewId, reviewQuestionId) => {
	const response = await ReviewAnswerChoice.findOne({
		attributes: ['review_question_choice_id'],
		include: [{ model: ReviewAnswer, as: 'review_answer', where: { review_id: reviewId, review_question_id: reviewQuestionId }, attributes: [] }],
	});

	// Return
	return response.dataValues.review_question_choice_id;
};

// 리뷰 Id 와 질문 Id 를 통한 리뷰 지역 답변 조회
export const getReviewRegionAnswerByReviewIdAndReviewQuestionId = async (reviewId, reviewQuestionId) => {
	const response = await ReviewAnswerRegion.findOne({
		attributes: ['region_id'],
		include: [{ model: ReviewAnswer, as: 'review_answer', where: { review_id: reviewId, review_question_id: reviewQuestionId }, attributes: [] }],
	});

	// Return
	return response.dataValues.region_id;
};

// 리뷰와 필터를 통한 질문 및 답변 조회
export const getQuestionsAndAnswerByReviewAndFilter = async (reviewId, filterId, reviewType) => {
	// 리뷰 질문 인덱스 조회
	const reviewQuestion = await ReviewAnswer.findAll({ attributes: ['review_question_id'], where: { review_id: reviewId } });
	// 리뷰 질문 인덱스 목록
	const reviewQuestionIds = reviewQuestion.map((ReviewAnswer) => ReviewAnswer.review_question_id);
	// 리뷰 질문 목록 조회
	const question = await ReviewQuestion.findAll({
		where: { id: { [Op.in]: reviewQuestionIds } },
		attributes: [
			'id',
			'answer_type',
			'question',
			'placeholder',
			'text_answer_type',
			'pentagon',
			'collection_question_id',
			'collection_answer_id',
			'min_point',
			'max_point',
			'is_collection',
			'is_deleted',
		],
		include: [
			{
				model: ReviewQuestionFilter,
				as: 'review_question',
				attributes: ['id', 'filter_id', 'review_type', 'sort', 'step', 'is_deleted'],
				where: { review_type: reviewType, filter_id: filterId },
				required: true,
				order: [
					['step', 'ASC'],
					['sort', 'ASC'],
				],
			},
		],
	});

	// 리뷰 답변 목록 조회
	for (let i = 0; i < question.length; i += 1) {
		switch (question[i].dataValues.answer_type) {
			case 'point':
				question[i].dataValues.answer = await getReviewPointAnswerByReviewIdAndReviewQuestionId(reviewId, question[i].dataValues.id); // eslint-disable-line no-await-in-loop
				break;
			case 'text':
				question[i].dataValues.answer = await getReviewTextAnswerByReviewIdAndReviewQuestionId(reviewId, question[i].dataValues.id); // eslint-disable-line no-await-in-loop
				break;
			case 'year':
				question[i].dataValues.answer = await getReviewYearAnswerByReviewIdAndReviewQuestionId(reviewId, question[i].dataValues.id); // eslint-disable-line no-await-in-loop
				break;
			case 'choice':
				question[i].dataValues.answer = await getReviewChoiceAnswerByReviewIdAndReviewQuestionId(reviewId, question[i].dataValues.id); // eslint-disable-line no-await-in-loop
				break;
			case 'region':
				question[i].dataValues.answer = await getReviewRegionAnswerByReviewIdAndReviewQuestionId(reviewId, question[i].dataValues.id); // eslint-disable-line no-await-in-loop
				break;
			default:
				throwError("Invalid 'answer_type'.", 400);
				break;
		}
	}

	// Return
	return question;
};
