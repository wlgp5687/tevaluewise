import * as common from '../component/common';

// 회원 상세 검사
export const checkMember = (member) => {
	if (member.id) expect(typeof member.id).toEqual('number');
	if (member.user_id) expect(typeof member.user_id).toEqual('string');
	if (member.nickname) expect(typeof member.nickname).toEqual('string');
	if (member.join_site) expect(common.joinSiteCheck(member.join_site)).toEqual(true);
	if (member.join_type) expect(common.joinTypeCheck(member.join_type)).toEqual(true);
	if (member.recommend_id) expect(typeof member.recommend_id).toEqual('string');
	if (member.login_count) expect(typeof member.login_count).toEqual('number');

	return null;
};

// 회원 속성 정보 검사
export const checkMemberAttribute = (memberAttribute) => {
	if (memberAttribute.member_id) expect(typeof memberAttribute.member_id).toEqual('number');
	if (memberAttribute.name) expect(typeof memberAttribute.name).toEqual('string');
	if (memberAttribute.sex) expect(common.sexCheck(memberAttribute.sex)).toEqual(true);
	if (memberAttribute.birthday) expect(typeof memberAttribute.birthday).toEqual('string');
	if (memberAttribute.email) expect(typeof memberAttribute.email).toEqual('string');
	if (memberAttribute.phone) expect(typeof memberAttribute.phone).toEqual('string');
	if (memberAttribute.thumbnail) expect(typeof memberAttribute.phone).toEqual('string');
	if (memberAttribute.default_thumbnail) expect(typeof memberAttribute.default_thumbnail).toEqual('string');
	if (memberAttribute.memo) expect(typeof memberAttribute.memo).toEqual('string');

	return null;
};

// 회원 접속 정보 검사
export const checkMemberAccess = (memberAccess) => {
	if (memberAccess.member_id) expect(memberAccess.member_id).toEqual('number');
	if (memberAccess.is_out) expect(common.agreementCheck(memberAccess.is_out)).toEqual(true);
	if (memberAccess.is_ban) expect(common.agreementCheck(memberAccess.is_ban)).toEqual(true);
	if (memberAccess.is_dormant) expect(common.agreementCheck(memberAccess.is_dormant)).toEqual(true);
	if (memberAccess.out_at) expect(typeof memberAccess.out_at).toEqual('string');
	if (memberAccess.ban_at) expect(typeof memberAccess.ban_at).toEqual('string');
	if (memberAccess.dormant_at) expect(typeof memberAccess.dormant_at).toEqual('string');
	if (memberAccess.last_login_at) expect(typeof memberAccess.last_login_at).toEqual('string');

	return null;
};

// 회원 마케팅 동의 정보 검사
export const checkMemberTerm = (memberTerm) => {
	if (memberTerm.terms_agreement) expect(common.agreementCheck(memberTerm.terms_agreement)).toEqual(true);
	if (memberTerm.terms_agreement_datetime) expect(typeof memberTerm.terms_agreement_datetime).toEqual('string');
	if (memberTerm.marketing_agreement) expect(common.agreementCheck(memberTerm.marketing_agreement)).toEqual(true);
	if (memberTerm.marketing_agreement_datetitme) expect(typeof memberTerm.terms_agreement_datetime).toEqual('string');
	if (memberTerm.guidance_agreement) expect(common.agreementCheck(memberTerm.guidance_agreement)).toEqual(true);
	if (memberTerm.guidance_agreement_datetime) expect(typeof memberTerm.guidance_agreement_datetime).toEqual('string');
	if (memberTerm.receive_marketing_agreement) expect(common.agreementCheck(memberTerm.receive_marketing_agreement)).toEqual(true);
	if (memberTerm.receive_marketing_agreement_datetime) expect(typeof memberTerm.receive_marketing_agreement_datetime).toEqual('string');

	return null;
};

// 회원 주소 정보 검사
export const checkMemberAddress = (memberAddress) => {
	if (memberAddress.id) expect(typeof memberAddress.id).toEqual('number');
	if (memberAddress.member_id) expect(typeof memberAddress.member_id).toEqual('number');
	if (memberAddress.label) expect(typeof memberAddress.label).toEqual('string');
	if (memberAddress.is_default) expect(common.agreementCheck(memberAddress.is_default)).toEqual(true);
	if (memberAddress.name) expect(typeof memberAddress.name).toEqual('string');
	if (memberAddress.phone) expect(typeof memberAddress.phone).toEqual('string');
	if (memberAddress.zipcode) expect(typeof memberAddress.zipcode).toEqual('string');
	if (memberAddress.address_base) expect(typeof memberAddress.address_base).toEqual('string');
	if (memberAddress.address_detail) expect(typeof memberAddress.address_detail).toEqual('string');

	return null;
};

// 회원 외부 채널 연동 정보 검사
export const checkMemberExternals = (memberExternal) => {
	if (memberExternal.member_id) expect(typeof memberExternal.member_id).toEqual('number');
	if (memberExternal.channel) expect(common.joinSiteCheck(memberExternal.channel)).toEqual(true);
	if (memberExternal.token) expect(typeof memberExternal.token).toEqual('string');

	return null;
};

// 회원 리뷰 열람 권한 정보 검사
export const checkMemberReviewAuth = (memberReviewAuth) => {
	if (memberReviewAuth.id) expect(typeof memberReviewAuth.id).toEqual('number');
	if (memberReviewAuth.member_id) expect(typeof memberReviewAuth.member_id).toEqual('number');
	if (memberReviewAuth.expire_date) expect(typeof memberReviewAuth.expire_date).toEqual('string');
	if (memberReviewAuth.is_deleted) expect(common.agreementCheck(memberReviewAuth.is_deleted)).toEqual(true);
	if (memberReviewAuth.comment) expect(typeof memberReviewAuth.comment).toEqual('string');

	return null;
};

// 회원 기관, 강사 요청 정보 검사
export const checkMemberRequestAuth = (memberRequest) => {
	if (memberRequest.id) expect(typeof memberRequest.id).toEqual('number');
	if (memberRequest.member_id) expect(typeof memberRequest.member_id).toEqual('number');
	if (memberRequest.comment) expect(typeof memberRequest.comment).toEqual('string');
	if (memberRequest.is_confirm) expect(common.confirmCheck(memberRequest.is_confirm)).toEqual(true);

	return null;
};

// 회원 로그인 로그 정보 검사
export const checkMemberLoginLog = (memberLoginLog) => {
	if (memberLoginLog.member_id) expect(typeof memberLoginLog.member_id).toEqual('number');
	if (memberLoginLog.join_site) expect(common.joinSiteCheck(memberLoginLog.join_site)).toEqual(true);
	if (memberLoginLog.login_ip) expect(typeof memberLoginLog.login_ip).toEqual('string');

	return null;
};

// 회원 제제 로그 정보 검사
export const checkMemberBanLog = (memberBanLog) => {
	if (memberBanLog.id) expect(typeof memberBanLog.id).toEqual('number');
	if (memberBanLog.member_id) expect(typeof memberBanLog.member_id).toEqual('number');
	if (memberBanLog.status) expect(common.banStatusCheck(memberBanLog.status)).toEqual(true);
	if (memberBanLog.comment) expect(typeof memberBanLog.comment).toEqual('string');

	return null;
};

// 회원 기관 팔로우 정보 검사
export const checkMemberFollowInstitute = (memberFollowInstitute) => {
	if (memberFollowInstitute.id) expect(typeof memberFollowInstitute.id).toEqual('number');
	if (memberFollowInstitute.member_id) expect(typeof memberFollowInstitute.member_id).toEqual('number');
	if (memberFollowInstitute.institute_id) expect(typeof memberFollowInstitute.institute_id).toEqual('number');
	if (memberFollowInstitute.filter_id) expect(typeof memberFollowInstitute.filter_id).toEqual('number');
	if (memberFollowInstitute.is_confirm) expect(common.agreementCheck(memberFollowInstitute.is_confirm)).toEqual(true);

	return null;
};

// 회원 강사 팔로우 정보 검사
export const checkMemberFollowTutor = (memberFollowTutor) => {
	if (memberFollowTutor.id) expect(typeof memberFollowTutor.id).toEqual('number');
	if (memberFollowTutor.member_id) expect(typeof memberFollowTutor.member_id).toEqual('number');
	if (memberFollowTutor.tutor_id) expect(typeof memberFollowTutor.tutor_id).toEqual('number');
	if (memberFollowTutor.filter_id) expect(typeof memberFollowTutor.filter_id).toEqual('number');
	if (memberFollowTutor.is_confirm) expect(common.agreementCheck(memberFollowTutor.is_confirm)).toEqual(true);
	if (memberFollowTutor.cafe_ofen) expect(common.agreementCheck(memberFollowTutor.cafe_ofen)).toEqual(true);

	return null;
};

// 강사 회원 홈 정보
export const checkTutorMemberHome = (tutorMemberHome) => {
	if (tutorMemberHome.subject_id) expect(typeof tutorMemberHome.subject_id).toEqual('number');
	if (tutorMemberHome.subject_name) expect(typeof tutorMemberHome.subject_name).toEqual('string');
	if (tutorMemberHome.filter_code) expect(typeof tutorMemberHome.filter_code).toEqual('string');
	if (tutorMemberHome.filter_name) expect(typeof tutorMemberHome.filter_name).toEqual('string');

	return null;
};
