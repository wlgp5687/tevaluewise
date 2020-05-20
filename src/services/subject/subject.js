import * as subjectComponent from '../../component/subject/subject';
import * as filterComponent from '../../component/filter/filter';

// SubjectId 존재 여부 조회
export const isExistSubjectId = async (subjectId) => {
	const response = await subjectComponent.isExistSubjectId(subjectId);
	return response;
};

// subjectId 가 일치하는 subject 반환
export const getSubjectById = async (subjectId) => {
	const response = await subjectComponent.getSubjectById(subjectId);
	return response;
};

// 기관 인덱스 & 필터 인덱스를 통한 과목 목록 조회
export const getSubjectByInstituteIdAndFilterId = async (instituteId, filterId, offset = 0, limit = 10) => {
	let subjects = null;
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	if (subjectIds) subjects = await subjectComponent.getSubjectByInstituteIdAndSubjectIds(instituteId, subjectIds, offset, limit);
	// Return
	return subjects;
};

// 기관 인덱스를 통한 과목 목록 조회 (단일)
export const getSubjectByInstituteId = async (instituteId, offset = 0, limit = 10) => {
	const response = await subjectComponent.getSubjectByInstituteId(instituteId, offset, limit);
	return response;
};

// 필터 인덱스를 통한 과목 목록 조회 (단일)
export const getSubjectByFilterId = async (filterId, keyword = null, offset = 0, limit = 10) => {
	const response = await subjectComponent.getSubjectByFilterId(filterId, keyword, offset, limit);
	return response;
};
