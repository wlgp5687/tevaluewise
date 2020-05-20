import * as commonComponent from '../../component/common';
import * as followComponent from '../../component/follow/follow';
import * as tutorComponent from '../../component/tutor/tutor';
import * as instituteComponent from '../../component/institute/institute';

// 기관 팔로우 인덱스 존재 여부 확인
export const isExistInstituteFollowId = async (id) => {
	const response = await followComponent.isExistInstituteFollowId(id);
	return response;
};

// 강사 팔로우 인덱스 존재 여부 확인
export const isExistTutorFollowId = async (id) => {
	const response = await followComponent.isExistTutorFollowId(id);
	return response;
};

// 강사 팔로우
export const addFollowTutor = async (memberFollowTutor) => {
	let response = null;
	const tutorFollow = await followComponent.isExistTutorFollow(memberFollowTutor.tutor_id, memberFollowTutor.member_id);
	if (!tutorFollow) {
		await tutorComponent.postPlusFollowCount(memberFollowTutor.tutor_id);
		const nowDate = await commonComponent.nowDateTime();
		const visitCount = await followComponent.getFollowTutorVisitLogCount(memberFollowTutor.tutor_id, memberFollowTutor.member_id);
		response = await followComponent.addFollowTutor({ ...memberFollowTutor, visit_count: visitCount, last_visit_at: nowDate });
	}

	return response;
};

// 강사 언팔로우
export const deleteFollowTutor = async (memberId, tutorId) => {
	const tutorFollow = await followComponent.isExistTutorFollow(tutorId, memberId);
	if (tutorFollow) {
		await tutorComponent.postMinusFollowCount(tutorId);
		await followComponent.deleteFollowTutor(memberId, tutorId);
	}
	return null;
};

// 강사 회원 팔로워 목록 조회
export const getTutorMemberFollows = async (searchFields, memberId, offset = 0, limit = 10) => {
	const tutorMemberIds = await tutorComponent.getTutorIdsByMemberId(memberId);
	const response = await followComponent.getTutorMemberFollows(searchFields, tutorMemberIds, offset, limit);
	return response;
};

// 기관 팔로우
export const addFollowInstitute = async (memberFollowInstitute) => {
	let response = null;
	const instituteFollow = await followComponent.isExistInstituteFollow(memberFollowInstitute.institute_id, memberFollowInstitute.member_id);
	if (!instituteFollow) {
		await instituteComponent.postPlusFollowCount(memberFollowInstitute.institute_id);
		response = await followComponent.addFollowInstitute(memberFollowInstitute);
	}

	return response;
};

// 기관 언팔로우
export const deleteFollowInstitute = async (memberId, instituteId) => {
	const instituteFollow = await followComponent.isExistInstituteFollow(instituteId, memberId);
	if (instituteFollow) {
		await instituteComponent.postMinusFollowCount(instituteId);
		await followComponent.deleteFollowInstitute(memberId, instituteId);
	}

	return null;
};
