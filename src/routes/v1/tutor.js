import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as tutorService from '../../services/tutor/tutor';
import * as tutorValidator from '../../validators/tutor';
import * as commonComponent from '../../component/common';

const router = express.Router();

// 강사 등록
router.post(
	'/',
	...tutorValidator.postRegisterTutor,
	wrapAsyncRouter(async (req, res) => {
		// 요청변수 정리
		// tutor
		const tutor = { name: req.body.name, is_deleted: 'N', is_confirm: 'REQUEST' };
		// tutorAttribute
		const tutorAttribute = { sex: req.body.sex };
		// tutorSubject
		const tutorSubject = {};
		if (req.body.subject_id) tutorSubject.subject_id = req.body.subject_id;
		// tutorInstitute
		const tutorInstitute = {};
		if (req.body.institute_id) tutorInstitute.institute_id = req.body.institute_id;

		// 강사 등록
		const response = await tutorService.doRegisterTutor(tutor, tutorAttribute, tutorSubject, tutorInstitute);

		// Return
		return res.json(!response ? null : { tutor: response });
	}),
);

// 검색 조건으로 강사 목록 가져오기
router.get(
	'/',
	...tutorValidator.getTutors,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = {};

		// 요청 변수 정리
		// tutor
		const tutorSearchField = { is_deleted: 'N', is_confirm: ['Y'] };
		if (req.query.name) tutorSearchField.name = req.query.name;
		if (Object.keys(tutorSearchField).length > 0) searchFields.tutor = tutorSearchField;

		// tutor_attributes
		const tutorAttributeSearchField = {};
		if (req.query.sex) tutorAttributeSearchField.sex = req.query.sex;
		if (req.query.message) tutorAttributeSearchField.message = req.query.message;
		if (Object.keys(tutorAttributeSearchField).length > 0) searchFields.tutor_attribute = tutorAttributeSearchField;

		// subject
		const subjectSearchField = { is_deleted: 'N' };
		if (req.query.subject_id) subjectSearchField.id = req.query.subject_id;
		if (Object.keys(subjectSearchField).length > 0) searchFields.subject = subjectSearchField;

		// filter
		const filterSearchField = { is_deleted: 'N' };
		if (req.query.filter_id) filterSearchField.id = req.query.filter_id;
		if (Object.keys(filterSearchField).length > 0) searchFields.filter = filterSearchField;

		// 과목 & 강사 & 필터 테이블을 통한 강사 목록 조회
		const tutors = await tutorService.getTutorBySearchFields(searchFields, offset, limit);

		// Return
		return res.json(!tutors ? null : { ...tutors, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 내가 팔로우한 강사 목록 조회
router.get(
	'/follow',
	...tutorValidator.getFollowTutor,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		// 요청 변수 정리
		const searchFields = { member_follow_tutor: { member_id: memberId } };

		// 강사&기관명 검색
		const nameSearchField = {};
		if (req.query.name) nameSearchField.name = req.query.name;
		if (Object.keys(nameSearchField).length > 0) searchFields.name = nameSearchField;

		// 정렬 순서
		const orderBySearchField = {};
		if (req.query.order) orderBySearchField.order = req.query.order;
		if (Object.keys(orderBySearchField).length > 0) searchFields.order = orderBySearchField;

		// 강사 팔로우 & 강사 테이블을 통한 강사 목록 조회
		const tutors = await tutorService.getTutorByFollowSearchFields(searchFields, offset, limit);

		// Return
		return res.json(!tutors ? null : { ...tutors, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 강사 일치 여부 조회
router.get(
	'/is-match',
	...tutorValidator.getMatchTutor,
	wrapAsyncRouter(async (req, res) => {
		// 비교
		const tutor = await tutorService.getMatchTutor(req.query.tutor_name, req.query.institute_id);
		// Return
		return res.json({ is_match: tutor });
	}),
);

// 본사에 소속된 강사 목록 조회
router.get(
	'/:institute_id/main-institute',
	...tutorValidator.getTutorByMainInstitute,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const subjectId = req.query.subject_id;
		const instituteId = req.params.institute_id;
		let response = null;
		let totalPoint = 0;
		let totalCount = 0;

		// 본사에 소속된 강사 목록 조회
		response = await tutorService.getTutorByMainInstitute(instituteId, subjectId, offset, limit);

		if (response)
			for (let i = 0; i < response.list.length; i += 1) {
				totalCount = parseInt(totalCount, 10) + parseInt(1, 10);
				totalPoint = parseInt(totalPoint, 10) + parseInt(response.list[i].attribute.average_point, 10);
			}

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10), total_point: parseInt(totalPoint, 10), total_count: parseInt(totalCount, 10) });
	}),
);

// 검색 조건에 따른 강사 목록 조회(light version)
router.get(
	'/list',
	...tutorValidator.getTutorList,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const filterId = req.query.filter_id;
		const subjectId = req.query.subject_id;
		const instituteId = req.query.institute_id;
		const tutorName = req.query.tutor_name;
		let response = null;

		/**
		 * DESC : 과목 인덱스 & 기관 인덱스 & 강사명 & 필터 인덱스를 통한 강사 목록 조회
		 * INPUT : subejctId, instituteId, tutorName, filterId
		 * SEARCH : null
		 */
		if (subjectId && instituteId && tutorName && filterId)
			response = await tutorService.getTutorBySubjectIdAndInstituteIdAndTutorNameAndFilterId(subjectId, instituteId, tutorName, filterId, offset, limit);

		/**
		 * DESC : 과목 인덱스 & 기관 인덱스 & 필터 인덱스를 통한 강사 목록 조회
		 * INPUT : subjectId, instituteId, filterId
		 * SEARCH : null
		 */
		if (subjectId && instituteId && !tutorName && filterId) response = await tutorService.getTutorBySubjectIdAndInstituteIdAndFilterId(subjectId, instituteId, filterId, offset, limit);

		/**
		 * DESC : 기관 인덱스 & 강사명 & 필터 인덱스를 통한 강사 목록 조회
		 * INPUT : instituteId, tutorName, filterId
		 * SEARCH : null
		 */
		if (!subjectId && instituteId && tutorName && filterId) response = await tutorService.getTutorByInstituteIdAndFilterIdAndTutorName(instituteId, tutorName, filterId, offset, limit);

		/**
		 * DESC : 과목 인덱스 & 강사명 & 필터 인덱스를 통한 강사 목록 조회
		 * INPUT : subjectId, tutorName, filterId
		 * SEARCH : null
		 */
		if (subjectId && !instituteId && tutorName && filterId) response = await tutorService.getTutorBySubjectIdAndTutorNameAndFilterId(subjectId, tutorName, filterId, offset, limit);

		/**
		 * DESC : 강사명 & 필터 인덱스를 통한 강사 목록 조회
		 * INPUT : tutorName, filterId
		 * SEARCH : null
		 */
		if (!subjectId && !instituteId && tutorName && filterId) response = await tutorService.getTutorByTutorNameAndFilterId(tutorName, filterId, offset, limit);

		/**
		 * DESC : 과목 인덱스와 기관 인덱스를 통한 강사 목록 조회
		 * INPUT : subjectId, instituteId
		 * SEARCH : null
		 */
		if (subjectId && instituteId && !tutorName && !filterId) response = await tutorService.getTutorBySubjectIdAndInstituteId(subjectId, instituteId, offset, limit);

		/**
		 * DESC : 과목 인덱스를 통한 강사 목록 조회
		 * INPUT : subjectId
		 * SEARCH : null
		 */
		if (subjectId && !instituteId && !tutorName && !filterId) response = await tutorService.getTutorBySubjectId(subjectId, offset, limit);

		/**
		 * DESC : 강사 이름을 통한 강사 목록 조회
		 * INPUT : tutorName
		 * SEARCH : null
		 */
		if (!subjectId && !instituteId && tutorName && !filterId) response = await tutorService.getTutorByTutorName(tutorName, offset, limit);

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

/** @description 강사 인덱스로 강사 조회 */
router.get(
	'/:tutor_id',
	...tutorValidator.getTutorById,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const filterId = req.query.filter_id;
		const { ipAddress } = req;

		// 강사 조회
		const tutor = await tutorService.getTutorById(req.params.tutor_id, memberId, filterId, ipAddress);

		req.apicacheGroup = `tutor-${req.params.tutor_id}`; // clearCache on update
		// Return
		return res.json(!tutor ? null : { tutor });
	}),
);

/** @description 강사 카페 개설 요청 */
router.post(
	'/:tutor_id/cafe/request/invitation',
	...tutorValidator.postNormalinessTutorRequestAuthCafe,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		const tutorRequestAuthCafe = { tutor_id: req.params.tutor_id, comment: '사용자 요청', is_confirm: 'REQUEST', request_type: 'invitation' };
		response = await tutorService.postTutorRequestAuthCafe(tutorRequestAuthCafe);
		// Return
		return res.json(!response ? null : { tutor_request_auth_cafe: response });
	}),
);

/** @description 강사 인덱스로 메이저 조회 */
router.get(
	'/:tutor_id/major',
	...tutorValidator.getMajorByTutorId,
	wrapAsyncRouter(async (req, res) => {
		const tutorMajor = await tutorService.getMajorByTutorId(req.params.tutor_id);
		return res.json(!tutorMajor ? null : { tutor_major: tutorMajor });
	}),
);

export default router;
