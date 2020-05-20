import * as reviewQuestionComponent from '../../component/review/reviewQuestion';
import * as filterComponent from '../../component/filter/filter';

// 필터 Id 로 질문 목록 및 선택지 조회
export const getReviewQuestionsWithAnswerByFilterIdAndReviewType = async (filterId, reviewType) => {
	// 필터 정보 조회
	const filter = await filterComponent.getFilterById(filterId);
	const code = filter ? filter.dataValues.code : null;
	const response = code ? await reviewQuestionComponent.getReviewQuestionsWithAnswerByFilterIdAndReviewType(code, reviewType) : null;
	return response;
};
