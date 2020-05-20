import * as common from '../component/common';

// 기관 정보 검사
export const checkInstitute = (institute) => {
	if (institute.id) expect(typeof institute.id).toEqual('number');
	if (institute.name_ko) expect(typeof institute.name_ko).toEqual('string');
	if (institute.name_en) expect(typeof institute.name_en).toEqual('string');
	if (institute.campus) expect(typeof institute.campus).toEqual('string');
	if (institute.type) expect(typeof institute.type).toEqual('string'); // 기관 타입 common으로 빼기
	if (institute.is_deleted) expect(common.agreementCheck(institute.is_deleted)).toEqual(true);
	if (institute.is_confirm) expect(common.confirmCheck(institute.is_confirm)).toEqual(true);
	if (institute.has_online) expect(common.hasCheck(institute.has_online)).toEqual(true);
	if (institute.has_review) expect(common.hasCheck(institute.has_review)).toEqual(true);

	return null;
};

// 기관 속성 정보 검사
export const checkInstituteAttribute = (instituteAttribute) => {
	if (instituteAttribute.institute_id) expect(typeof instituteAttribute.institute_id).toEqual('number');
	if (instituteAttribute.logo) expect(typeof instituteAttribute.logo).toEqual('string');
	if (instituteAttribute.message) expect(typeof instituteAttribute.message).toEqual('string');
	if (instituteAttribute.site_url) expect(typeof instituteAttribute.site_url).toEqual('string');
	if (instituteAttribute.tags) expect(typeof instituteAttribute.tags).toEqual('string');
	if (instituteAttribute.address) expect(typeof instituteAttribute.address).toEqual('string');
	if (instituteAttribute.post) expect(typeof instituteAttribute.post).toEqual('string');
	if (instituteAttribute.phone) expect(typeof instituteAttribute.phone).toEqual('string');
	if (instituteAttribute.geo_latitude) expect(typeof instituteAttribute.geo_latitude).toEqual('number');
	if (instituteAttribute.geo_longitude) expect(typeof instituteAttribute.geo_longitude).toEqual('number');
	if (instituteAttribute.default_log) expect(typeof instituteAttribute.default_log).toEqual('string');
	if (instituteAttribute.average_point) expect(typeof instituteAttribute.average_point).toEqual('number');
	if (instituteAttribute.memo) expect(typeof instituteAttribute.memo).toEqual('string');

	return null;
};

// 강사 기관 정보 검사
export const checkTutorInstitute = (tutorInstitute) => {
	if (tutorInstitute.id) expect(typeof tutorInstitute.id).toEqual('number');
	if (tutorInstitute.tutor_id) expect(typeof tutorInstitute.tutor_id).toEqual('number');
	if (tutorInstitute.institute_id) expect(typeof tutorInstitute.institute_id).toEqual('number');
	if (tutorInstitute.is_current) expect(common.agreementCheck(tutorInstitute.is_current)).toEqual(true);
	if (tutorInstitute.join_at) expect(typeof tutorInstitute.join_at).toEqual('string');
	if (tutorInstitute.retire_at) expect(typeof tutorInstitute.retire_at).toEqual('string');
	if (tutorInstitute.sort_no) expect(typeof tutorInstitute.sort_no).toEqual('number');

	return null;
};

// 어린이집&유치원 기관 검사
export const checkInstituteChildren = (instituteChildren) => {
	if (instituteChildren.institute_id) expect(typeof instituteChildren.institute_id).toEqual('number');
	if (instituteChildren.establish_type) expect(common.establishTypeCheck(instituteChildren.establish_type)).toEqual(true);
	if (instituteChildren.status) expect(common.instituteStatusCheck(instituteChildren.status)).toEqual(true);
	if (instituteChildren.gross_area) expect(typeof instituteChildren.gross_area).toEqual('number');
	if (instituteChildren.has_playground) expect(common.unknownCheck(instituteChildren.has_playground)).toEqual(true);
	if (instituteChildren.has_school_bus) expect(common.unknownCheck(instituteChildren.has_school_bus)).toEqual(true);
	if (instituteChildren.teacher_count) expect(typeof instituteChildren.teacher_count).toEqual('number');
	if (instituteChildren.max_pupil_count) expect(typeof instituteChildren.max_pupil_count).toEqual('number');
	if (instituteChildren.current_pupil_count) expect(typeof instituteChildren.current_pupil_count).toEqual('number');
	if (instituteChildren.cctv_count) expect(typeof instituteChildren.cctv_count).toEqual('number');
	if (instituteChildren.teacher_count_0_to_1) expect(typeof instituteChildren.teacher_count_0_to_1).toEqual('number');
	if (instituteChildren.teacher_count_1_to_2) expect(typeof instituteChildren.teacher_count_1_to_2).toEqual('number');
	if (instituteChildren.teacher_count_2_to_4) expect(typeof instituteChildren.teacher_count_2_to_4).toEqual('number');
	if (instituteChildren.teacher_count_4_to_6) expect(typeof instituteChildren.teacher_count_4_to_6).toEqual('number');
	if (instituteChildren.teacher_count_6_more) expect(typeof instituteChildren.teacher_count_6_more).toEqual('number');
	if (instituteChildren.api_id) expect(typeof instituteChildren.api_id).toEqual('string');

	return null;
};

// 기관 댓글 정보 검사
export const checkInstituteCommentContent = (instituteCommentContent) => {
	if (instituteCommentContent.institute_comment_id) expect(typeof instituteCommentContent.institute_comment_id).toEqual('number');
	if (instituteCommentContent.title) expect(typeof instituteCommentContent.title).toEqual('string');
	if (instituteCommentContent.content) expect(typeof instituteCommentContent.content).toEqual('string');

	return null;
};

// 기관 댓글 검사
export const checkInstituteComment = (instituteComment) => {
	if (instituteComment.id) expect(instituteComment.id).toEqual('number');
	if (instituteComment.institute_id) expect(typeof instituteComment.institute_id).toEqual('number');
	if (instituteComment.institute_member_id) expect(typeof instituteComment.institute_member_id).toEqual('number');
	if (instituteComment.nickname) expect(typeof instituteComment.nickname).toEqual('number');
	if (instituteComment.family) expect(typeof instituteComment.family).toEqual('number');
	if (instituteComment.sort) expect(typeof instituteComment.sort).toEqual('number');
	if (instituteComment.parent_id) expect(typeof instituteComment.parent_id).toEqual('number');
	if (instituteComment.depth) expect(typeof instituteComment.depth).toEqual('number');
	if (instituteComment.is_deleted) expect(common.agreementCheck(instituteComment.is_deleted)).toEqual(true);
	if (instituteComment.created_ip) expect(typeof instituteComment.created_ip).toEqual('string');

	return null;
};

// 기관 조회수 로그 검사
export const checkInstituteCountLog = (instituteCountLog) => {
	if (instituteCountLog.institute_id) expect(typeof instituteCountLog.institute_id).toEqual('number');
	if (instituteCountLog.member_id) expect(typeof instituteCountLog.member_id).toEqual('number');

	return null;
};

// 기관 조회수  검사
export const checkInstituteCount = (instituteCount) => {
	if (instituteCount.institute_id) expect(typeof instituteCount.institute_id).toEqual('number');
	if (instituteCount.view) expect(typeof instituteCount.view).toEqual('number');
	if (instituteCount.total_review_count) expect(typeof instituteCount.total_review_count).toEqual('number');
	if (instituteCount.follow_count) expect(typeof instituteCount.follow_count).toEqual('number');

	return null;
};

// 기관 지사 검사
export const checkInstituteFamily = (instituteFamily) => {
	if (instituteFamily.id) expect(typeof instituteFamily.id).toEqual('number');
	if (instituteFamily.institute_id) expect(typeof instituteFamily.institute_id).toEqual('number');
	if (instituteFamily.parent_id) expect(typeof instituteFamily.parent_id).toEqual('number');

	return null;
};

// 기관 회원 검사
export const checkInstituteMember = (instituteMember) => {
	if (instituteMember.id) expect(typeof instituteMember.id).toEqual('number');
	if (instituteMember.institute_id) expect(typeof instituteMember.institute_id).toEqual('number');
	if (instituteMember.member_id) expect(typeof instituteMember.member_id).toEqual('number');
	if (instituteMember.is_master) expect(common.agreementCheck(instituteMember.is_master)).toEqual(true);
	return null;
};

// 기관 지역 검사
export const checkInstituteRegion = (instituteRegion) => {
	if (instituteRegion.institute_id) expect(typeof instituteRegion.institute_id).toEqual('number');
	if (instituteRegion.region_id) expect(typeof instituteRegion.region_id).toEqual('number');

	return null;
};

// 기관 검색 검사
export const checkInstituteSearchSource = (instituteSearchSource) => {
	if (instituteSearchSource.id) expect(typeof instituteSearchSource.id).toEqual('number');
	if (instituteSearchSource.institute_id) expect(typeof instituteSearchSource.institute_id).toEqual('number');
	if (instituteSearchSource.tag_text) expect(typeof instituteSearchSource.tag_text).toEqual('string');

	return null;
};

// 기관 분류 검사
export const checkInstituteSort = (instituteSort) => {
	if (instituteSort.id) expect(typeof instituteSort.id).toEqual('number');
	if (instituteSort.institute_id) expect(typeof instituteSort.institute_id).toEqual('number');
	if (instituteSort.filter_id) expect(typeof instituteSort.filter_id).toEqual('number');
	if (instituteSort.total_reviewcount) expect(typeof instituteSort.total_reviewcount).toEqual('number');
	if (instituteSort.tutor_review_count) expect(typeof instituteSort.tutor_review_count).toEqual('number');
	if (instituteSort.tutor_change_review_count) expect(typeof instituteSort.tutor_change_review_count).toEqual('number');
	if (instituteSort.institute_review_count) expect(typeof instituteSort.institute_review_count).toEqual('number');
	if (instituteSort.institute_change_review_count) expect(typeof instituteSort.institute_change_review_count).toEqual('number');
	if (instituteSort.sort_average) expect(typeof instituteSort.sort_average).toEqual('number');
	if (instituteSort.is_major) expect(common.agreementCheck(instituteSort.is_major)).toEqual(true);

	return null;
};

// 기관 과목 검사
export const checkInstituteSubject = (instituteSubject) => {
	if (instituteSubject.id) expect(typeof instituteSubject.id).toEqual('number');
	if (instituteSubject.institute_id) expect(typeof instituteSubject.institute_id).toEqual('number');
	if (instituteSubject.subject_id) expect(typeof instituteSubject.subject_id).toEqual('number');

	return null;
};

// 기관 강사 조회 랭킹 검사
export const checkInstituteTutorCountRank = (InstituteTutorCountRank) => {
	if (InstituteTutorCountRank.id) expect(typeof InstituteTutorCountRank.id).toEqual('number');
	if (InstituteTutorCountRank.institute_id) expect(typeof InstituteTutorCountRank.institute_id).toEqual('number');
	if (InstituteTutorCountRank.lv1_filter_id) expect(typeof InstituteTutorCountRank.lv1_filter_id).toEqual('number');
	if (InstituteTutorCountRank.subject_id) expect(typeof InstituteTutorCountRank.subject_id).toEqual('number');
	if (InstituteTutorCountRank.tutor_count_lv1) expect(typeof InstituteTutorCountRank.tutor_count_lv1).toEqual('number');
	if (InstituteTutorCountRank.tutor_count_lv1_subject) expect(typeof InstituteTutorCountRank.tutor_count_lv1_subject).toEqual('number');
	if (InstituteTutorCountRank.tutor_count_lv1_rank) expect(typeof InstituteTutorCountRank.tutor_count_lv1_rank).toEqual('number');
	if (InstituteTutorCountRank.tutor_count_lv1_subject_rank) expect(typeof InstituteTutorCountRank.tutor_count_lv1_subject_rank).toEqual('number');
	if (InstituteTutorCountRank.review_count) expect(typeof InstituteTutorCountRank.review_count).toEqual('number');
	if (InstituteTutorCountRank.review_count_rank) expect(typeof InstituteTutorCountRank.review_count_rank).toEqual('number');
	if (InstituteTutorCountRank.filter_institute_count) expect(typeof InstituteTutorCountRank.filter_institute_count).toEqual('number');
	if (InstituteTutorCountRank.filter_subject_institute_count) expect(typeof InstituteTutorCountRank.filter_subject_institute_count).toEqual('number');

	return null;
};

// 기관 배너 검사
export const checkInstituteBanner = (InstituteBanner) => {
	if (InstituteBanner.id) expect(typeof InstituteBanner.id).toEqual('number');
	if (InstituteBanner.institute_id) expect(typeof InstituteBanner.institute_id).toEqual('number');
	if (InstituteBanner.banner_id) expect(typeof InstituteBanner.banner_id).toEqual('number');

	return null;
};
