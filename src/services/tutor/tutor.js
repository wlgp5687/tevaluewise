import { sequelize } from '../../database';

import * as commonComponent from '../../component/common';
import * as tutorComponent from '../../component/tutor/tutor';
import * as instituteComponent from '../../component/institute/institute';
import * as fileComponent from '../../component/file/file';
import * as filterComponent from '../../component/filter/filter';
import * as siteComponent from '../../component/site/site';
import * as followComponent from '../../component/follow/follow';
import * as cafeComponent from '../../component/cafe/cafe';
import * as subjectComponent from '../../component/subject/subject';

// 강사 인덱스 존재 여부 확인
export const isExistTutorId = async (tutorId) => {
	const response = await tutorComponent.isExistTutorId(tutorId);
	return response;
};

/**
 * @description 강사 인덱스 & 회원 인덱스로 강사 회원 존재 여부 확인
 * @param {Int} tutorId
 * @param {Int} memberId
 */
export const isExistTutorMember = async (tutorId, memberId) => {
	const response = await tutorComponent.isExistTutorMember(tutorId, memberId);
	return response;
};

// 강사와 기관 연결 인덱스 존재 여부 확인
export const isExistTutorInstituteId = async (tutorInstituteId) => {
	const response = await tutorComponent.isExistTutorInstituteId(tutorInstituteId);
	return response;
};

// 강사 카페 생성 요청 인덱스 존재 여부 확인
export const isExistTutorRequestAuthCafeId = async (tutorRequestAuthCafeId) => {
	const response = await tutorComponent.isExistTutorRequestAuthCafeId(tutorRequestAuthCafeId);
	return response;
};

// 카페 인덱스로 강사 인덱스 조회
export const getTutorIdByCafeId = async (cafeId) => {
	const response = await tutorComponent.getTutorIdByCafeId(cafeId);
	return response;
};

// 강사 등록
export const doRegisterTutor = async (tutor, tutorAttribute, tutorSubject = {}, tutorInstitute = {}) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		// 강사 정보 추가
		const tutorData = await tutorComponent.addTutor(tutor, false, t);

		// 강사 상세 정보 추가
		const tutorAttributeData = tutorAttribute;
		tutorAttributeData.tutor_id = tutorData.id;
		tutorAttributeData.default_profile = await fileComponent.getRandomTutorDefaultProfileBySex(tutorAttributeData.sex);
		await tutorComponent.addTutorAttribute(tutorAttributeData, false, t);

		// 강사 과목 추가
		if (Object.keys(tutorSubject).length > 0) {
			const tutorSubjectData = tutorSubject;
			tutorSubjectData.tutor_id = tutorData.id;
			await tutorComponent.addTutorSubject(tutorSubjectData, false, t);
		}

		// 강사 기관 추가
		if (Object.keys(tutorInstitute).length > 0) {
			const tutorInstituteData = tutorInstitute;
			tutorInstituteData.tutor_id = tutorData.id;
			await tutorComponent.addTutorInstitute(tutorInstituteData, false, t);
		}

		// 강사 조회수 추가
		await tutorComponent.addTutorCount({ tutor_id: tutorData.id, view: 0, total_review_count: 0, follow_count: 0 }, false, t);

		// 레벨에 따른 기관 정렬 카운트 추가
		const siteFilterIds = await siteComponent.getSitesfilterIdsByTargetAndLevel('site', 2);
		for (let i = 0; i < siteFilterIds.length; i += 1)
			// eslint-disable-next-line no-await-in-loop
			await tutorComponent.addTutorSort(
				{
					tutor_id: tutorData.id,
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

		response = tutorData;
	});

	return response;
};

// 강사 조회수 증가
export const addTutorViewCount = async (tutorId, memberId = null, createdIp) => {
	// 강사 조회수 로그 조회
	const viewLog = await tutorComponent.getCheckTutorLog(tutorId, memberId, createdIp);
	if (viewLog === 0) {
		await sequelize.transaction(async (t) => {
			// 강사 조회수 증가
			await tutorComponent.postPlusTutorViewCount(tutorId, t);
			// 강사 조회수 로그 작성
			await tutorComponent.postTutorCount({ tutor_id: tutorId, member_id: memberId, created_ip: createdIp }, false, t);

			// 팔로우 회원인경우 팔로우 홈 카운트 증가
			const isExistTutorFollow = await followComponent.isExistTutorFollow(tutorId, memberId);
			if (isExistTutorFollow) {
				const nowDate = await commonComponent.nowDateTime();
				await followComponent.updateMemberFollowTutorVisitCount({ member_id: memberId, tutor_id: tutorId, last_visit_at: nowDate }, false, t);
				await followComponent.postFollowTutorVisitLog({ member_id: memberId, tutor_id: tutorId, login_ip: createdIp }, false, t);
				const isExistTutorCafe = await cafeComponent.isExistCafeTutorByTutorId(tutorId);
				if (isExistTutorCafe) {
					const cafeId = await tutorComponent.getCafeIdByTutorId(tutorId);
					await cafeComponent.updateCafeVisitCount({ id: cafeId.dataValues.cafe_id }, t);
				}
			}
		});
	}
};

// 강사 Id 로 강사 조회
export const getTutorById = async (tutorId, memberId = null, filterId = null, ipAddress) => {
	const response = await tutorComponent.getTutorById(tutorId, memberId, filterId);

	// 조회수 증가
	await addTutorViewCount(tutorId, memberId, ipAddress);

	// Return
	return response;
};

// 강사 일치 여부 조회
export const getMatchTutor = async (tutorName, instituteId) => {
	const response = await tutorComponent.getMatchTutor(tutorName, instituteId);
	return response;
};

// 검색 조건으로 강사 목록 조회
export const getTutorBySearchFields = async (searchFields, offset = 0, limit = 10) => {
	const response = await tutorComponent.getTutorBySearchFields(searchFields, offset, limit);
	return response;
};

// 내가 팔로우한 강사 목록 조회
export const getTutorByFollowSearchFields = async (searchFields, offset = 0, limit = 10) => {
	const response = await tutorComponent.getTutorByFollowSearchFields(searchFields, offset, limit);
	return response;
};

// 본사에 소속된 강사 목록 조회
export const getTutorByMainInstitute = async (instituteIdParam, subjectId, offset = 0, limit = 10) => {
	let instituteId = instituteIdParam;
	const mainInstitute = await instituteComponent.getInstituteHighFamilies(instituteId);
	instituteId = mainInstitute || instituteId;
	const response = await tutorComponent.getTutorByMainInstitute(instituteId, subjectId, offset, limit);
	return response;
};

// memberId 에 연결된 강사 인덱스 반환
export const getTutorIdsByMemberId = async (memberId) => {
	const response = await tutorComponent.getTutorIdsByMemberId(memberId);
	return response;
};

// FilterId 와 InstituteId 에 연결된 강사 인덱스 반환
export const getTutorIdsByFilterIdAndInstituteId = async (filterId, instituteId) => {
	const response = await tutorComponent.getTutorIdsByFilterIdAndInstituteId(filterId, instituteId);
	return response;
};

// MemberId에 연결된 강사 정보 반환
export const getMemberRelationTutorByMemberId = async (memberId) => {
	const response = await tutorComponent.getMemberRelationTutorByMemberId(memberId);
	return response;
};

// 과목 인덱스 & 기관 인덱스 & 강사명 & 필터 인덱스를 통한 강사 목록 조회
export const getTutorBySubjectIdAndInstituteIdAndTutorNameAndFilterId = async (subjectId, instituteId, tutorName, filterId, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	let tutor = null;
	if (subjectIds.includes(parseInt(subjectId, 10))) tutor = await tutorComponent.getTutorBySubjectIdAndInstituteIdAndTutorName(subjectId, instituteId, tutorName, offset, limit);
	// Return
	return tutor;
};

// 과목 인덱스 & 기관 인덱스 & 필터 인덱스를 통한 강사 목록 조회
export const getTutorBySubjectIdAndInstituteIdAndFilterId = async (subjectId, instituteId, filterId, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	let tutor = null;
	if (subjectIds.includes(parseInt(subjectId, 10))) tutor = await tutorComponent.getTutorBySubjectIdAndInstituteId(subjectId, instituteId, offset, limit, null);
	// Return
	return tutor;
};

// 기관 인덱스 & 강사명 & 필터 인덱스를 통한 강사 목록 조회
export const getTutorByInstituteIdAndFilterIdAndTutorName = async (instituteId, tutorName, filterId, offset = 0, limit = 10) => {
	const response = await tutorComponent.getTutorByInstituteIdAndFilterIdAndTutorName(instituteId, filterId, tutorName, offset, limit);
	return response;
};

// 과목 인덱스 & 강사명 & 필터 인덱스를 통한 강사 목록 조회
export const getTutorBySubjectIdAndTutorNameAndFilterId = async (subjectId, tutorName, filterId, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	let tutor = null;
	if (subjectIds.includes(parseInt(subjectId, 10))) tutor = await tutorComponent.getTutorBySubjectIdsAndTutorName([parseInt(subjectId, 10)], tutorName, offset, limit);
	// Return
	return tutor;
};

// 강사명 & 필터 인덱스를 통한 강사 목록 조회
export const getTutorByTutorNameAndFilterId = async (tutorName, filterId, offset = 0, limit = 10) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	const response = await tutorComponent.getTutorBySubjectIdsAndTutorName(subjectIds, tutorName, offset, limit);
	return response;
};

// 과목 인덱스와 기관 인덱스를 통한 강사 목록 조회
export const getTutorBySubjectIdAndInstituteId = async (subjectId, instituteId, offset = 0, limit = 10) => {
	const response = await tutorComponent.getTutorBySubjectIdAndInstituteId(subjectId, instituteId, offset, limit, 'name');
	return response;
};

// 과목 인덱스를 통한 강사 목록 조회
export const getTutorBySubjectId = async (subjectId, offset = 0, limit = 10) => {
	const response = await tutorComponent.getTutorBySubjectId(subjectId, offset, limit);
	return response;
};

// 강사 이름을 통한 강사 목록 조회
export const getTutorByTutorName = async (tutorName, offset = 0, limit = 10) => {
	const response = await tutorComponent.getTutorByTutorName(tutorName, offset, limit);
	return response;
};

/**
 * @description 강사 카페 개설 요청
 * @param {Array} tutorRequestAuthCafe
 */
export const postTutorRequestAuthCafe = async (tutorRequestAuthCafe) => {
	let response = null;
	await sequelize.transaction(async (t) => {
		response = await tutorComponent.addTutorRequestAuthCafe(tutorRequestAuthCafe, false, t);
	});
	// Return
	return response;
};

/**
 * @description 강사 인덱스로 카페 인덱스 조회
 * @param {Int} tutorId
 */
export const getCafeIdByTutorId = async (tutorId) => {
	const response = await tutorComponent.getCafeIdByTutorId(tutorId);
	return response;
};

/**
 * @description 강사 인덱스로 강사, 강사 속성, 카페 정보 조회
 * @param {Int} tutorId
 */
export const getTutorDataById = async (tutorId) => {
	const response = await tutorComponent.getTutorDataById(tutorId);
	return response;
};

/**
 * @description 강사 인덱스로 기관 조회
 * @param {Int} tutorId
 */
export const getInstitutesByTutorId = async (tutorId) => {
	const response = await tutorComponent.getInstitutesByTutorId(tutorId);
	return response;
};

/**
 * @description 강사 인덱스로 메이저 조회
 * @param {Int} tutorId
 * @param {Int} filterIdParam
 */
export const getMajorByTutorId = async (tutorId, filterIdParam = null) => {
	let filterId = null;
	let response = null;
	// 강사의 메이저 조회
	if (!filterIdParam) {
		const tutorMajor = await tutorComponent.getTutorMajorById(tutorId);
		if (tutorMajor) filterId = tutorMajor.filter_id;
	}
	if (filterId) {
		// 강사 정보 조회
		const tutor = await tutorComponent.getTutorDataById(tutorId);
		// 강사의 메이저 필터의 과목 조회
		const tutorSubject = await subjectComponent.getTutorSubjectsByTutorIdAndFilterId(tutorId, filterId);
		if (tutorSubject) response = { ...tutor, filter_id: filterId, subject: tutorSubject };
	}

	// Return
	return response;
};
