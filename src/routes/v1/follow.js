import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as followService from '../../services/follow/follow';
import * as followValidator from '../../validators/follow';
import * as commonComponent from '../../component/common';

const router = express.Router();

// 강사 팔로우
router.post(
	'/tutor',
	...followValidator.postFollowTutor,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		const memberId = req.decodedToken.data.member.id;
		const filterId = req.body.filter_id;
		const tutorId = req.body.tutor_id;

		// 요청변수 정리
		const memberFollowTutor = { member_id: memberId, tutor_id: tutorId, filter_id: filterId, is_confirm: 'Y' };

		// 강사 팔로우
		response = await followService.addFollowTutor(memberFollowTutor);

		// Return
		return res.json(response ? { follow: response } : null);
	}),
);

// 강사 언팔로우
router.delete(
	'/tutor/:tutor_id/elimination',
	...followValidator.deleteFollowTutor,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		const memberId = req.decodedToken.data.member.id;

		await followService.deleteFollowTutor(memberId, req.params.tutor_id);

		// Return
		return res.json(null);
	}),
);

// 강사 회원의 팔로워 목록 조회
router.get(
	'/tutormember/:member_id/follower',
	...followValidator.getTutorMemberFollows,
	wrapAsyncRouter(async (req, res) => {
		const page = parseInt(req.query.page, 10) || parseInt(1, 10);
		const limit = parseInt(req.query.limit, 10) || parseInt(process.env.PAGE_LIMIT, 10);
		const offset = await commonComponent.getOffset(page, limit);

		const searchFields = {};

		// 회원 닉네임 검색
		const memberSearchField = {};
		if (req.query.nickname) memberSearchField.nickname = req.query.nickname;
		if (Object.keys(memberSearchField).length > 0) searchFields.member = memberSearchField;

		// 팔로우 일자 검색
		const dateSearchField = {};
		const datetime = await commonComponent.nowDateTime();
		let endDate = null;
		if (req.query.end_date) endDate = await commonComponent.getDatePlusDate(req.query.end_date, 1);
		dateSearchField.start_date = req.query.start_date ? req.query.start_date : '2019-03-01 00:00:00';
		dateSearchField.end_date = endDate || datetime;
		if (Object.keys(dateSearchField).length > 0) searchFields.date = dateSearchField;

		// 정렬 순서
		const orderBySearchField = {};
		if (req.query.order) orderBySearchField.order = req.query.order;
		if (Object.keys(orderBySearchField).length > 0) searchFields.order = orderBySearchField;

		// 강사 팔로워 목록 조회
		const tutorMemberFollows = await followService.getTutorMemberFollows(searchFields, req.params.member_id, offset, limit);

		// Return
		return res.json(!tutorMemberFollows ? null : { ...tutorMemberFollows, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 기관 팔로우
router.post(
	'/institute',
	...followValidator.postFollowTutor,
	wrapAsyncRouter(async (req, res) => {
		let response = null;

		// 로그인한 회원의 인덱스
		const memberId = req.decodedToken.data.member.id;
		const filterId = req.body.filter_id;
		const instituteId = req.body.institute_id;

		// 요청변수 정리
		const memberFollowInstitute = { member_id: memberId, institute_id: instituteId, filter_id: filterId, is_confirm: 'Y' };

		// 기관 팔로우
		response = await followService.addFollowInstitute(memberFollowInstitute);

		// Return
		return res.json(response ? { follow: response } : null);
	}),
);

// 기관 언팔로우
router.delete(
	'/institute/:institute_id/elimination',
	...followValidator.deleteFollowInstitute,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		const memberId = req.decodedToken.data.member.id;

		await followService.deleteFollowInstitute(memberId, req.params.institute_id);

		// Return
		return res.json(null);
	}),
);

export default router;
