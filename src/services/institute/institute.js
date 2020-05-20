import { sequelize } from '../../database';

import * as instituteComponent from '../../component/institute/institute';
import * as filterComponent from '../../component/filter/filter';
import * as fileComponent from '../../component/file/file';
import * as siteComponent from '../../component/site/site';

// 기관 인덱스 존재 여부 확인
export const isExistInstituteId = async (instituteId) => {
	const response = await instituteComponent.isExistInstituteId(instituteId);
	return response;
};

// 하위 기관 존재 여부 조회 - 분점
export const isExistInstituteSubFamilies = async (instituteId) => {
	const response = await instituteComponent.isExistInstituteSubFamilies(instituteId);
	return response;
};

// 상위 기관 존재 여부 조회 - 본점
export const isExistInstituteHighFamilies = async (instituteId) => {
	const response = await instituteComponent.isExistInstituteHighFamilies(instituteId);
	return response;
};

// 기관 Id 로 기관 조회
export const getInstituteById = async (instituteId, memberId = null, filterId = null, ipAddress) => {
	const response = await instituteComponent.getInstituteById(instituteId, memberId, filterId);
	// 조회수 증가
	await addInstituteViewCount(instituteId, memberId, ipAddress);
	// Return
	return response;
};

// 기관 조회수 증가
export const addInstituteViewCount = async (instituteId, memberId = null, ipAddress) => {
	// 기관 조회수 로그 조회
	const viewLog = await instituteComponent.getCheckInstituteLog(instituteId, memberId, ipAddress);
	if (viewLog === 0) {
		await sequelize.transaction(async (t) => {
			// 기관 조회수 증가
			await instituteComponent.postPlusInstituteViewCount(instituteId, t);
			// 기관 조뢰수 로그 작성
			await instituteComponent.postInstituteCount({ institute_id: instituteId, member_id: memberId, created_ip: ipAddress }, t);
		});
	}
};

// 검색 조건으로 기관 목록 조회
export const getInstituteBySearchFields = async (searchFields, offset = 0, limit = 10) => {
	const response = await instituteComponent.getInstitutesBySearchFields(searchFields, offset, limit);
	return response;
};

// 캠퍼스 목록 조회
export const getInstituteCampusByInstituteIdAndFilterId = async (instituteId, filterId, offset = 0, limit = 10) => {
	const response = await instituteComponent.getInstituteCampusByInstituteIdAndFilterId(instituteId, filterId, offset, limit);
	return response;
};

// 내가 팔로우한 기관 목록 조회
export const getInstituteByFollowSearchFields = async (searchFields, offset = 0, limit = 10) => {
	const response = await instituteComponent.getInstituteByFollowSearchFields(searchFields, offset, limit);
	return response;
};

// 학원 등록
export const doRegisterInstitute = async (institute, instituteSubject, instituteRegion) => {
	let response = null;
	await sequelize.transaction(async (t) => {
		// 기관 정보 추가
		const instituteData = await instituteComponent.addInstitute(institute, false, t);

		// 기관 속성 정보 추가
		await instituteComponent.addInstituteAttribute({ institute_id: instituteData.id, default_logo: await fileComponent.getRandomInstituteDefaultLogoByType(institute.type) }, false, t);

		// 기관 취급 과목 추가
		await instituteComponent.addInstituteSubject({ ...instituteSubject, institute_id: instituteData.id }, false, t);

		// 기관 지역 추가
		await instituteComponent.addInstituteRegion({ ...instituteRegion, institute_id: instituteData.id }, false, t);

		// 기관 조회수 추가
		await instituteComponent.addInstituteCount({ institute_id: instituteData.id, view: 0, total_review_count: 0, follow_count: 0 }, false, t);

		// 레벨에 따른 기관 정렬 카운트 추가
		const siteFilterIds = await siteComponent.getSitesfilterIdsByTargetAndLevel('site', 2);
		for (let i = 0; i < siteFilterIds.length; i += 1)
			// eslint-disable-next-line
			await instituteComponent.addInstituteSort(
				{
					institute_id: instituteData.id,
					filter_id: siteFilterIds[i],
					total_review_count: 0,
					tutor_review_count: 0,
					tutor_change_review_count: 0,
					institute_review_count: 0,
					institute_change_review_count: 0,
					is_major: 'N',
				},
				false,
				t,
			);

		response = instituteData;
	});

	return response;
};

// filterId & subjectId & instituteName 을 통한 기관 목록 조회
export const getInstituteByFilterIdAndSubjectIdAndName = async (filterId, subjectId, instituteName, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	let institute = null;
	if (subjectIds.includes(parseInt(subjectId, 10))) institute = await instituteComponent.getInstituteBySubjectIdAndName([parseInt(subjectId, 10)], instituteName, offset, limit);
	// Return
	return institute;
};

// filterId & subjectId 를 통한 기관 목록 조회
export const getInstituteByFilterIdAndSubjectId = async (filterId, subjectId, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	let institute = null;
	if (subjectIds.includes(parseInt(subjectId, 10))) institute = await instituteComponent.getInstituteBySubjectIdAndName([parseInt(subjectId, 10)], null, offset, limit);
	// Return
	return institute;
};

// filterId & instituteName 을 통한 기관 목록 조회
export const getInstituteByFilterIdAndName = async (filterId, instituteName, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	const institute = await instituteComponent.getInstituteBySubjectIdAndName(subjectIds, instituteName, offset, limit);
	// Return
	return institute;
};

// 분야 Id 를 통한 기관 목록 조회
export const getInstituteByFilterId = async (filterId, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	const institute = await instituteComponent.getInstituteBySubjectIdAndName(subjectIds, null, offset, limit);
	// Return
	return institute;
};

// 강사 Id 를 통한 기관 목록 조회
export const getInstituteByTutorId = async (tutorId, offset = 0, limit = 10) => {
	const institute = await instituteComponent.getInstituteByTutorId(tutorId, offset, limit);
	// Return
	return institute;
};

// MemberId에 연결된 기관 정보 반환
export const getMemberRelationInstituteByMemberId = async (memberId) => {
	const response = await instituteComponent.getMemberRelationInstituteByMemberId(memberId);
	return response;
};

// 인근에 위치한 기관 조회
export const getPeripheryInstituteByInstituteId = async (instituteId, offset = 0, limit = 10, ipAddress) => {
	let response = null;
	const institute = await getInstituteById(instituteId, null, null, ipAddress);

	if (institute && ['kindergarten', 'daycare'].includes(institute.type) && institute.region) {
		const region = institute.region[0].dataValues;
		response = await instituteComponent.getPeripheryInstituteByInstituteIdAndTypeAndRegionId(instituteId, institute.type, region.id, offset, limit);
	}

	return response;
};

// 카페 인덱스로 instituteId 조회
export const getInstituteIdByCafeId = async (cafeId) => {
	const response = instituteComponent.getInstituteIdByCafeId(cafeId);
	return response;
};
