import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 강사 팔로우
export const postFollowTutor = validate([]);

// 강사 언팔로우
export const deleteFollowTutor = validate([
	// @TODO 당사자 본인만 요청 가능하게 조건 추가할것
]);

// 강사 회원 팔로워 목록 조회
export const getTutorMemberFollows = validate([
	check('member_id')
		.toInt()
		.isNumeric()
		.custom(validation.isExistMemberId)
		.custom(validation.isTutorMember)
		.not()
		.isEmpty(),
]);

// 기관 팔로우
export const postFollowInstitute = validate([]);

// 기관 언팔로우
export const deleteFollowInstitute = validate([
	// @TODO 당사자 본인만 요청 가능하게 조건 추가할것
]);
