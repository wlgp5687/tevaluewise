import * as termComponent from '../../component/term/term';

// 약관 조회
export const getTermBySearchFields = async (searchField) => {
	const response = await termComponent.getTermBySearchFields(searchField);
	return response;
};

// 약관 등록
export const registerTerm = async (term) => {
	const response = await termComponent.addTerm(term);
	return response;
};

// 약관 수정
export const updateTerm = async (term) => {
	const response = await termComponent.updateTerm(term);
	return response;
};

// 약관 삭제
export const deleteTerm = async (termId) => {
	const response = await termComponent.deleteTerm(termId);
	return response;
};
