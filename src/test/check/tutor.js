import * as common from '../component/common';

// 강사 상세 조회 check
export const checkTutor = (tutor) => {
	if (tutor.name) expect(typeof tutor.name).toEqual('string');
	if (tutor.is_deleted) expect(common.agreementCheck(tutor.is_deleted)).toEqual(true);
	if (tutor.is_confirm) expect(common.confirmCheck(tutor.is_confirm)).toEqual(true);
	if (tutor.id) expect(typeof tutor.id).toEqual('number');
	if (tutor.major) expect(typeof tutor.major).toEqual('number');

	return null;
};

// 강사 attribute check
export const checkTutorAttribute = (tutorAttribute) => {
	if (tutorAttribute.sex) expect(common.sexCheck(tutorAttribute.sex)).toEqual(true);
	if (tutorAttribute.default_profile) expect(typeof tutorAttribute.default_profile).toEqual('string');
	if (tutorAttribute.average_point && tutorAttribute.average_point !== 0) expect(typeof tutorAttribute.average_point).toEqual('number');
	if (tutorAttribute.tags) expect(typeof tutorAttribute.tags).toEqual('object');
	if (tutorAttribute.profile) expect(typeof tutorAttribute.profile).toEqual('string');
	if (tutorAttribute.message) expect(typeof tutorAttribute.message).toEqual('string');
	if (tutorAttribute.memo) expect(typeof tutorAttribute.memo).toEqual('string');

	return null;
};

// 목록 조회 강사 check
export const checkTutorList = (tutor) => {
	if (tutor.id) expect(typeof tutor.id).toEqual('number');
	if (tutor.name) expect(typeof tutor.name).toEqual('string');
	if (tutor.is_deleted) expect(common.agreementCheck(tutor.is_deleted)).toEqual(true);
	if (tutor.is_confirm) expect(common.confirmCheck(tutor.is_confirm)).toEqual(true);
	if (tutor.match) expect(common.agreementCheck(tutor.match)).toEqual(true);
	if (tutor.total_review_count && tutor.total_review_count !== 0) expect(typeof tutor.total_review_count).toEqual('number');
	if (tutor.tutor_review_count && tutor.tutor_review_count !== 0) expect(typeof tutor.tutor_review_count).toEqual('number');
	if (tutor.tutor_change_review_count && tutor.tutor_change_review_count !== 0) expect(typeof tutor.tutor_change_review_count).toEqual('number');
	if (tutor.tutor_follow_count && tutor.tutor_follow_count !== 0) expect(typeof tutor.tutor_follow_count).toEqual('number');
	if (tutor.major) expect(common.isExistLvFilter(tutor.major)).toEqual(true);
	if (tutor.major_name) expect(typeof tutor.major_name).toEqual('string');

	return null;
};

// 과목 chcek
export const checkSubject = (subject) => {
	if (subject.id) expect(typeof subject.id).toEqual('number');
	if (subject.name) expect(typeof subject.name).toEqual('string');
	if (subject.comment) expect(typeof subject.comment).toEqual('string');
	if (subject.is_deleted) expect(common.agreementCheck(subject.is_deleted)).toEqual(true);
	if (subject.sort_no) expect(typeof subject.sort_no).toEqual('number');

	return null;
};

// tutor_sort check
export const checkTutorSort = (tutorSort) => {
	if (tutorSort.filter_id) expect(typeof tutorSort.filter_id).toEqual('number');

	return null;
};

// review & follow count check
export const checkReviewFollowCount = (count) => {
	if (count.total_review_count && count.total_review_count !== 0) expect(typeof count.total_review_count).toEqual('number');
	if (count.follow_count && count.follow_count !== 0) expect(typeof count.follow_count).toEqual('number');

	return null;
};

// 강사 배너 list check
export const checkTutorBannerList = (tutorBanner) => {
	if (tutorBanner.id) expect(typeof tutorBanner.id).toEqual('number');
	if (tutorBanner.tutor_id) expect(typeof tutorBanner.tutor_id).toEqual('number');
	if (tutorBanner.banner_id) expect(typeof tutorBanner.banner_id).toEqual('number');

	return null;
};
