import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as instituteService from '../../services/institute/institute';
import * as instituteValidator from '../../validators/institute';
import * as commonComponent from '../../component/common';

const router = express.Router();

// 기관 등록
router.post(
	'/',
	...instituteValidator.postRegisterInstitute,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		// 요청변수 정리
		// institute
		const institute = {
			name_ko: req.body.name_ko,
			name_en: req.body.name_en ? req.body.name_en : '',
			campus: req.body.campus ? req.body.campus : '',
			type: req.body.type,
			is_deleted: 'N',
			is_confirm: 'REQUEST',
			has_online: null,
			has_review: null,
		};
		// instituteSubject
		const instituteSubject = { subject_id: req.body.subject_id };
		// instituteRegion
		const instituteRegion = { region_id: req.body.region_id };

		// 학원
		if (institute.type === 'institute') {
			response = await instituteService.doRegisterInstitute(institute, instituteSubject, instituteRegion);
			// 대학교
		} else if (institute.type === 'university') {
			// 유치원
		} else if (institute.type === 'kindergarten') {
			// 어린이집
		} else if (institute.type === 'daycare') {
			// 기타
		}

		return res.json({ institute: response });
	}),
);

// 검색 조건으로 기관 목록 가져오기
router.get(
	'/',
	...instituteValidator.getInstitutes,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const searchFields = {};

		// 요청변수 정리
		// institute
		const instituteSearchField = { is_deleted: 'N', is_confirm: ['Y'] };
		if (req.query.name_ko) instituteSearchField.name_ko = req.query.name_ko;
		if (req.query.name_en) instituteSearchField.name_en = req.query.name_en;
		if (req.query.campus) instituteSearchField.campus = req.query.campus;
		if (req.query.type) {
			const tempData = req.query.type;
			instituteSearchField.type = tempData.split('|');
		}
		if (req.query.has_online) instituteSearchField.has_online = req.query.has_online;
		if (req.query.has_review) instituteSearchField.has_review = req.query.has_review;
		if (Object.keys(instituteSearchField).length > 0) searchFields.institute = instituteSearchField;

		// institute_attribute
		const instituteAttributeSearchField = {};
		if (req.query.message) instituteAttributeSearchField.message = req.query.message;
		if (req.query.site_url) instituteAttributeSearchField.site_url = req.query.site_url;
		if (req.query.address) instituteAttributeSearchField.address = req.query.address;
		if (req.query.phone) instituteAttributeSearchField.phone = req.query.phone;
		if (Object.keys(instituteAttributeSearchField).length > 0) searchFields.institute_attribute = instituteAttributeSearchField;

		// subject
		const subjectSearchField = { is_deleted: 'N' };
		if (req.query.subject_id) subjectSearchField.id = req.query.subject_id;
		if (Object.keys(subjectSearchField).length > 0) searchFields.subject = subjectSearchField;

		// filter
		const filterSearchField = { is_deleted: 'N' };
		if (req.query.filter_id) filterSearchField.id = req.query.filter_id;
		if (Object.keys(filterSearchField).length > 0) searchFields.filter = filterSearchField;

		// 과목 & 기관 & 필터 테이블을 통한 기관 목록 조회
		const institutes = await instituteService.getInstituteBySearchFields(searchFields, offset, limit);

		// Return
		return res.json(!institutes ? null : { ...institutes, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 내가 팔로우한 기관 목록 조회
router.get(
	'/follow',
	...instituteValidator.getFollowInstitute,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);

		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		const searchFields = { member_follow_institute: { member_id: memberId } };

		// 요청 변수 정리
		const instituteSearchField = {};
		if (req.query.name_ko) instituteSearchField.name_ko = req.query.name_ko;
		if (req.query.name_en) instituteSearchField.name_en = req.query.name_en;
		if (Object.keys(instituteSearchField).length > 0) searchFields.institute = instituteSearchField;

		// 기관 팔로우 & 기관 테이블을 통한 기관 목록 조회
		const institutes = await instituteService.getInstituteByFollowSearchFields(searchFields, offset, limit);

		// Return
		return res.json(!institutes ? null : { ...institutes, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 검색 조건에 따른 기관 목록 조회(light version)
router.get(
	'/list',
	...instituteValidator.getInstituteList,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const filterId = req.query.filter_id;
		const tutorId = req.query.tutor_id;
		const instituteName = req.query.institute_name;
		const subjectId = req.query.subject_id;
		let response = null;

		// filterId & subjectId & instituteName 을 통한 기관 목록 조회
		if (filterId && !tutorId && instituteName && subjectId) {
			response = await instituteService.getInstituteByFilterIdAndSubjectIdAndName(filterId, subjectId, instituteName, offset, limit);
		}

		// filterId & subjectId 를 통한 기관 목록 조회
		if (filterId && !tutorId && !instituteName && subjectId) {
			response = await instituteService.getInstituteByFilterIdAndSubjectId(filterId, subjectId, offset, limit);
		}

		// filterId & instituteName 을 통한 기관 목록 조회
		if (filterId && !tutorId && instituteName && !subjectId) {
			response = await instituteService.getInstituteByFilterIdAndName(filterId, instituteName, offset, limit);
		}

		// filterId 를 통한 기관 목록 조회 (단일)
		if (filterId && !tutorId && !instituteName && !subjectId) {
			response = await instituteService.getInstituteByFilterId(filterId, offset, limit);
		}

		// tutorId 를 통한 기관 목록 조회 (단일)
		if (!filterId && tutorId && !instituteName && !subjectId) {
			response = await instituteService.getInstituteByTutorId(tutorId, offset, limit);
		}

		// Return
		return res.json(!response ? null : { ...response, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 하위 기관 존재 여부 조회 - 분점
router.get(
	'/sub-families/:institute_id/existence',
	...instituteValidator.getExistenceInstituteSubFamilies,
	wrapAsyncRouter(async (req, res) => {
		const families = await instituteService.isExistInstituteSubFamilies(req.params.institute_id);
		return res.json({ existence: families });
	}),
);

// 상위 기관 존재 여부 조회 - 본점
router.get(
	'/high-families/:institute_id/existence',
	...instituteValidator.getExistenceInstituteHighFamilies,
	wrapAsyncRouter(async (req, res) => {
		const families = await instituteService.isExistInstituteHighFamilies(req.params.institute_id);
		return res.json({ existence: families });
	}),
);

// 인근 유치원 조회
router.get(
	'/:institute_id/periphery-kindergarten',
	...instituteValidator.getPeripheryKindergarten,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const { ipAddress } = req;

		const institutes = await instituteService.getPeripheryInstituteByInstituteId(req.params.institute_id, offset, limit, ipAddress);

		// Return
		return res.json(!institutes ? null : { ...institutes, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 캠퍼스 목록 조회
router.get(
	'/:institute_id/campus',
	...instituteValidator.getInstituteCampus,
	wrapAsyncRouter(async (req, res) => {
		const page = req.query.page ? req.query.page : 1;
		const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
		const offset = await commonComponent.getOffset(page, limit);
		const filterId = req.query.filter_id;

		const campus = await instituteService.getInstituteCampusByInstituteIdAndFilterId(req.params.institute_id, filterId, offset, limit);

		// Return
		return res.json(!campus ? null : { ...campus, limit: parseInt(limit, 10), page: parseInt(page, 10) });
	}),
);

// 기관 Id 로 기관 조회
router.get(
	'/:institute_id',
	...instituteValidator.getInstituteById,
	wrapAsyncRouter(async (req, res) => {
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;
		const filterId = req.query.filter_id;
		const { ipAddress } = req;

		// 기관 조회
		const institute = await instituteService.getInstituteById(req.params.institute_id, memberId, filterId, ipAddress);

		req.apicacheGroup = `institute-${req.params.institute_id}`; // clearCache on update
		// Return
		return res.json({ institute });
	}),
);

export default router;
