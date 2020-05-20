import { getModel } from '../../database';

const Term = getModel('Term');

// 약관 조회
export const getTermBySearchFields = async (searchField = {}) => {
	const termAttr = {};
	if (searchField.id) termAttr.id = searchField.id;
	if (searchField.type) termAttr.type = searchField.type;
	const response = await Term.findOne({ where: termAttr, order: [['id', 'DESC']] });
	return response;
};

// 약관 등록
export const addTerm = async (term, isGetId = false) => {
	const response = await Term.create({ type: term.type, contents: term.contents });
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 약관 수정
export const updateTerm = async (term) => {
	const response = await Term.update({ type: term.type, contents: term.contents }, { where: { id: term.id } });
	return response;
};

// 약관 삭제
export const deleteTerm = async (termId) => {
	const response = await Term.destroy({ where: { id: termId } });
	return response;
};
