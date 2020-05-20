import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

export const validateLogin = validate([check('user_id', '아이디를 입력하세요').exists({ checkFalsy: true }), check('password', '비밀번호를 입력하세요').exists({ checkFalsy: true })]);

export const validateSignup = validate([
	check('user_id').exists({ checkFalsy: true }),
	check('password').exists({ checkFalsy: true }),
	check('nickname').exists({ checkFalsy: true }),
	check('email').isEmail(),
]);

// 닉네임 존재 여부 조회
export const getExistenceNickname = validate([
	check('nickname')
		.isLength({ min: 1, max: 50 })
		.not()
		.isEmpty()
		.custom(validation.isValidNickname),
]);

// 아이디 존재 여부 조회
export const getExistenceUserId = validate([
	check('user_id')
		.isEmail()
		.not()
		.isEmpty(),
]);

// 아이디 상태 확인
export const getUserIdStatus = validate([
	check('user_id')
		.isEmail()
		.not()
		.isEmpty(),
]);

// 회원 아이디 칮기
export const getFindUserId = validate([]);

// 회원 정보 조회
export const getMember = validate([
	check('member_id')
		.isNumeric()
		.not()
		.isEmpty(),

	oneOf([check('member_id').custom(validation.isValidLoginMemberToken), check('x-access-token').custom(validation.isValidLoginAdminMemberToken)]),
]);

// 회원 목록 조회
export const getMembers = validate([]);

// Site 회원 로그인
export const postLogin = validate([]);

// Site 회원 가입
export const postRegisterMember = validate([
	// members
	check('user_id')
		.isEmail()
		.not()
		.isEmpty(),
	check('password')
		.not()
		.isEmpty(),
	check('nickname')
		.not()
		.isEmpty()
		.custom(validation.isExistNickname),
	check('join_type')
		.not()
		.isEmpty()
		.custom(validation.isValidJoinType),

	// member_attributes
	check('name')
		.not()
		.isEmpty(),
	check('sex')
		.not()
		.isEmpty()
		.custom(validation.isValidSex),
	check('birthday')
		.not()
		.isEmpty(),
	check('email')
		.isEmail()
		.not()
		.isEmpty(),
	check('phone')
		.not()
		.isEmpty(),

	// member_terms
	check('terms_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('marketing_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('guidance_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('receive_marketing_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
]);

// 비밀번호 재설정 처리
export const patchResetPassword = validate([]);

// 비밀번호 변경
export const patchChangePassword = validate([]);

// 회원 로그아웃
export const postLogout = validate([]);

// 회원 탈퇴
export const postWithdrawalMember = validate([
	check('member_id')
		.isNumeric()
		.not()
		.isEmpty()
		.custom(validation.isExistMemberId),
]);

// SNS 회원 가입
export const postRegisterSnsMember = validate([
	// members
	check('nickname')
		.not()
		.isEmpty()
		.custom(validation.isExistNickname),
	check('join_type')
		.not()
		.isEmpty()
		.custom(validation.isValidJoinType),

	// member_attributes
	check('name')
		.not()
		.isEmpty(),
	check('sex')
		.not()
		.isEmpty()
		.custom(validation.isValidSex),
	check('birthday')
		.not()
		.isEmpty(),
	check('email')
		.isEmail()
		.not()
		.isEmpty(),
	check('phone')
		.not()
		.isEmpty(),

	// member_terms
	check('terms_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('marketing_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('guidance_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
	check('receive_marketing_agreement')
		.not()
		.isEmpty()
		.custom(validation.isValidAgreement),
]);

// SNS 회원 정보 확득
export const postSnsLogin = validate([]);

// 회원 정보 수정
export const patchMemberInfo = validate([
	check('member_id')
		.isNumeric()
		.not()
		.isEmpty()
		.custom(validation.isExistMemberId),
]);

// 마케팅 수신 동의
export const patchMemberMarketingAgreement = validate([]);

// 마케팅 활용 동의
export const patchMemberMarketingServiceAgreement = validate([]);
