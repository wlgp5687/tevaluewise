import { getModel, sequelize, Op } from '../../database';
import { throwError } from '../../services';

import * as filterComponent from '../filter/filter';
import * as followComponent from '../follow/follow';
import * as subjectComponent from '../subject/subject';
import * as regionComponent from '../region/region';
import * as commonComponent from '../common';

const Institute = getModel('Institute');
const InstituteAttribute = getModel('InstituteAttribute');
const InstituteChildren = getModel('InstituteChildren');
const InstituteCount = getModel('InstituteCount');
const InstituteCountLog = getModel('InstituteCountLog');
const InstituteFamily = getModel('InstituteFamily');
const InstituteMember = getModel('InstituteMember');
const InstituteRegion = getModel('InstituteRegion');
const InstituteSubject = getModel('InstituteSubject');
const InstituteSort = getModel('InstituteSort');
const TutorInstitute = getModel('TutorInstitute');
const MemberFollowInstitute = getModel('MemberFollowInstitute');
const Region = getModel('Region');
const Subject = getModel('Subject');
const SubjectFilter = getModel('SubjectFilter');
const CafeInstitute = getModel('CafeInstitute');

// 기관 인덱스 존재 여부 확인
export const isExistInstituteId = async (instituteId) => {
	const existNum = await Institute.count({ where: { id: instituteId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

// 하위 기관 존재 여부 조회 - 분점
export const isExistInstituteSubFamilies = async (instituteId) => {
	const existNum = await InstituteFamily.count({ where: { parent_id: instituteId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

// 상위 기관 존재 여부 조회 - 본점
export const isExistInstituteHighFamilies = async (instituteId) => {
	const existNum = await InstituteFamily.count({ where: { institute_id: instituteId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

//  상위 기관 조회 - 본점
export const getInstituteHighFamilies = async (instituteId) => {
	const response = await Institute.findOne({ include: [{ model: InstituteFamily, as: 'sub_family', where: { institute_id: instituteId } }] });
	return response;
};

// 상위 기관 인덱스 조회
export const getInstituteHighFamilyId = async (instituteId) => {
	const response = await InstituteFamily.findOne({ where: { institute_id: instituteId } });
	return response;
};

// 전체 지사 Id 조회
export const getInstituteSubFamiliesId = async () => {
	const tmpData = await InstituteFamily.findAll({ attributes: ['institute_id'] });
	// Return
	return tmpData ? tmpData.map((institute) => institute.institute_id) : null;
};

// 기관 Id 로 기관 부가정보 (유치원, 어린이집) 조회
export const getInstituteChildrenByInstituteId = async (instituteId) => {
	const response = await InstituteChildren.findOne({
		where: { institute_id: instituteId },
		attributes: [
			'establish_type',
			'status',
			'gross_area',
			'has_playground',
			'teacher_count',
			'max_pupil_count',
			'current_pupil_count',
			'open_date',
			'has_school_bus',
			'cctv_count',
			'teacher_count_0_to_1',
			'teacher_count_1_to_2',
			'teacher_count_2_to_4',
			'teacher_count_4_to_6',
			'teacher_count_6_more',
			'api_id',
		],
	});
	return response;
};

// 기관 Id 로 기관 조회
export const getInstituteById = async (instituteId, memberId = null, filterId = null) => {
	let filterIds = null;
	if (filterId) filterIds = await filterComponent.getSubFilterIdsByFilterId(filterId);
	let subjectFilterAttr = null;
	if (filterIds) subjectFilterAttr = { filter_id: { [Op.in]: filterIds } };

	let response = {};

	// 기관 정보 조회
	const institute = await Institute.findOne({
		where: { id: instituteId, is_deleted: 'N' },
		attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_confirm', 'has_online', 'has_review'],
		include: [
			{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'address', 'post', 'phone', 'geo_latitude', 'geo_longitude', 'average_point'] },
			{ model: Region, as: 'region', attributes: ['id', 'parent_id', 'code', 'type', 'name', 'is_deleted'], through: { attributes: [] } },
			{
				model: Subject,
				as: 'subject',
				where: { is_deleted: 'N' },
				attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'],
				through: { attributes: [] },
				include: [{ model: SubjectFilter, as: 'subject_filter', attributes: [], where: subjectFilterAttr }],
			},
		],
	});

	// 추가 정보 조회
	if (institute) {
		response = institute.dataValues;

		// 유치원 && 어린이집 정보 조회
		if (['kindergarten', 'daycare'].includes(String(response.type))) {
			const children = await getInstituteChildrenByInstituteId(response.id);
			if (!children) throwError('DB Information Error', 500);
			response.children = children.dataValues;
		} else {
			response.children = null;
		}

		// 상위 지역 정보
		const regionData = institute.dataValues.region ? institute.dataValues.region : null;
		if (regionData) {
			for (let i = 0; i < regionData.length; i += 1) {
				if (regionData[i].dataValues.parent_id) {
					// eslint-disable-next-line no-await-in-loop
					const tmpData = await regionComponent.getRegionById(regionData[i].dataValues.parent_id);
					if (tmpData.dataValues.parent_id) {
						// eslint-disable-next-line no-await-in-loop
						const parentTmpData = await regionComponent.getRegionById(tmpData.dataValues.parent_id);
						if (parentTmpData) tmpData.dataValues.parent_region = parentTmpData.dataValues;
					}
					if (tmpData) regionData[i].dataValues.parent_region = tmpData;
				}
			}
		}

		// 상위 기관 여부
		const hasHighFamilies = await isExistInstituteHighFamilies(institute.id);
		// 하위 기관 여부
		const hasSubFamilies = await isExistInstituteSubFamilies(institute.id);
		response.has_high_families = hasHighFamilies === true ? 'Y' : 'N';
		response.has_sub_families = hasSubFamilies === true ? 'Y' : 'N';
		// 상위 기관 인덱스
		const parentInstitute = await getInstituteHighFamilyId(institute.id);
		response.parent_institute_id = parentInstitute ? parentInstitute.dataValues.parent_id : null;

		// 팔로우 여부 조회
		let isFollow = null;
		if (memberId) isFollow = await followComponent.isExistInstituteFollow(instituteId, memberId);
		institute.dataValues.is_follow = isFollow;
	}
	// Return
	return Object.keys(response).length > 0 ? response : null;
};

// SubjectId 로 연결된 institute 조회
export const getInstituteIdArrayBySubjectIdArray = async (subjectIdArray) => {
	const tmpData = await Institute.findAll({
		where: { is_deleted: 'N' },
		attributes: ['id'],
		include: [{ model: Subject, as: 'subject', where: { id: { [Op.in]: subjectIdArray }, is_deleted: 'N' }, attributes: [], through: { attributes: [] } }],
	});
	// Return
	return tmpData ? tmpData.map((insitute) => insitute.id) : null;
};

// 검색 조건으로 Follow 기관 목록 조회
export const getInstituteByFollowSearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const institute = searchFields.institute ? searchFields.institute : null;
	const memberFollowInstitute = searchFields.member_follow_institute ? searchFields.member_follow_institute : null;
	let response = null;

	// 검색 조건
	const instituteAttr = {};
	if (institute) {
		if (institute.name_ko) instituteAttr.name_ko = { [Op.like]: [`%${institute.name_ko}%`] };
		if (institute.name_en) instituteAttr.name_en = { [Op.like]: [`%${institute.name_en}%`] };
	}

	const memberFollowInstituteAttr = {};
	if (memberFollowInstitute) {
		if (memberFollowInstitute.member_id) memberFollowInstituteAttr.member_id = memberFollowInstitute.member_id;
	}

	const sql = {
		where: instituteAttr,
		include: [
			{ model: MemberFollowInstitute, as: 'member_follow_institute', where: memberFollowInstituteAttr, attributes: [`filter_id`, 'is_confirm'] },
			{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] },
		],
		distinct: true,
	};

	// Total
	const total = await Institute.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'];
		sql.order = [['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 기관 정보 조회
		const institutes = await Institute.findAll(sql);

		for (let i = 0; i < institutes.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const followFilterInfo = await filterComponent.getFilterById(institutes[i].dataValues.member_follow_institute.dataValues.filter_id);
			institutes[i].dataValues.member_follow_institute.dataValues.filter = followFilterInfo;
		}

		if (Object.keys(institutes).length > 0) response = { total, list: institutes };
	}
	// Return
	return response;
};

// 검색 조건으로 기관 목록 조회
export const getInstitutesBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const institute = searchFields.institute ? searchFields.institute : null;
	const instituteAttribute = searchFields.institute_attribute ? searchFields.institute_attribute : null;
	const subject = searchFields.subject ? searchFields.subject : null;
	const filter = searchFields.filter ? searchFields.filter : null;
	let response = null;

	// 검색 조건
	const instituteAttr = {};
	if (institute) {
		if (institute.name_ko) instituteAttr.name_ko = { [Op.like]: [`%${institute.name_ko}%`] };
		if (institute.name_en) instituteAttr.name_en = { [Op.like]: [`%${institute.name_en}%`] };
		if (institute.campus) instituteAttr.campus = { [Op.like]: [`%${institute.campus}%`] };
		if (institute.type) instituteAttr.type = { [Op.in]: institute.type };
		if (institute.has_online) instituteAttr.has_online = institute.has_online;
		if (institute.has_review) instituteAttr.has_review = institute.has_review;
		if (institute.is_deleted) instituteAttr.is_deleted = institute.is_deleted;
		if (institute.is_confirm) instituteAttr.is_confirm = { [Op.in]: [institute.is_confirm] };
	}

	const instituteAttributeAttr = {};
	if (instituteAttribute) {
		if (instituteAttribute.message) instituteAttributeAttr.message = { [Op.like]: [`%${instituteAttribute.message}%`] };
		if (instituteAttribute.site_url) instituteAttributeAttr.site_url = { [Op.like]: [`%${instituteAttribute.site_url}%`] };
		if (instituteAttribute.address) instituteAttributeAttr.address = { [Op.like]: [`%${instituteAttribute.address}%`] };
		if (instituteAttribute.phone) instituteAttributeAttr.phone = { [Op.like]: [`%${instituteAttribute.phone}%`] };
	}

	// subject 또는 filter 검색 조건이 있는 경우 해당 조건을 통해 기관의 인덱스 조회
	if (subject || filter) {
		if (subject.id) {
			// subject 로 연결된 institute 조회
			const instituteIdArray = await getInstituteIdArrayBySubjectIdArray([subject.id]);
			if (instituteIdArray) instituteAttr.id = { [Op.in]: instituteIdArray };
		}

		if (filter.id && !subject.id) {
			// filter 하위의 subject 전체를 조회
			const subjectIds = await filterComponent.getSubjectArrayByFilterId(filter.id);
			// subject 로 연결된 institute 조회
			if (subjectIds) {
				const instituteIdArray = await getInstituteIdArrayBySubjectIdArray(subjectIds);
				if (instituteIdArray) instituteAttr.id = { [Op.in]: instituteIdArray };
			}
		}
	}

	const sql = {
		where: instituteAttr,
		include: [
			{
				model: InstituteAttribute,
				as: 'attribute',
				where: instituteAttributeAttr,
				attributes: ['logo', 'message', 'site_url', 'address', 'post', 'phone', 'geo_latitude', 'geo_longitude', 'average_point'],
			},
			{
				model: InstituteChildren,
				as: 'children',
				attributes: [
					'establish_type',
					'status',
					'gross_area',
					'has_playground',
					'teacher_count',
					'max_pupil_count',
					'current_pupil_count',
					'open_date',
					'has_school_bus',
					'cctv_count',
					'teacher_count_0_to_1',
					'teacher_count_1_to_2',
					'teacher_count_2_to_4',
					'teacher_count_4_to_6',
					'teacher_count_6_more',
					'api_id',
				],
			},
		],
		distinct: true,
		subQuery: false,
	};

	// Total
	const total = await Institute.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'];
		sql.order = [['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 기관 정보 조회
		const institutes = await Institute.findAll(sql);
		if (Object.keys(institutes).length > 0) response = { total, list: institutes };
	}

	// Return
	return response;
};

// 기관 Id 로 캠퍼스 목록 조회
export const getInstituteCampusByInstituteIdAndFilterId = async (instituteId, filterId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);

	let response = null;

	const sql = {
		where: { type: 'institute', is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
		include: [
			{ model: InstituteFamily, as: 'sub_family', where: { parent_id: instituteId }, attributes: [] },
			{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] },
			{ model: InstituteSubject, as: 'institute_subject', where: { subject_id: { [Op.in]: subjectIds } }, attributes: [] },
		],
	};

	// Total
	const total = await Institute.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'];
		sql.order = [['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 캠퍼스 정보
		const campus = await Institute.findAll(sql);
		if (Object.keys(campus).length > 0) response = { total, list: campus };
	}

	// Return
	return response;
};

// subjectId 로 기관 정보 조회
export const getInstituteBySubjectIdAndName = async (subjectId, name = null, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	const instituteIdArray = await InstituteSubject.findAll({ attributes: ['institute_id'], where: { subject_id: { [Op.in]: subjectId } } });
	const instituteIds = instituteIdArray.map((instituteIdArray) => instituteIdArray.institute_id);
	const campueInstituteIds = await getInstituteSubFamiliesId();

	const instituteAttr = {};
	if (instituteIds) instituteAttr.id = { [Op.and]: [{ [Op.in]: instituteIds }, { [Op.notIn]: campueInstituteIds }] };
	if (name) instituteAttr.name_ko = { [Op.like]: `%${name}%` };

	const sql = {
		where: { ...instituteAttr, is_deleted: 'N', is_confirm: 'Y' },
		include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
	};

	// Total
	const total = await Institute.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name_ko',
			'name_en',
			'campus',
			[
				sequelize.literal(
					'((SELECT COUNT(`institute_reviews`.`review_id`) FROM `institute_reviews` WHERE `institute_reviews`.`institute_id` = `Institute`.`id`) + (SELECT COUNT(`institute_change_reviews`.`review_id`) FROM `institute_change_reviews` WHERE `institute_change_reviews`.`before_institute_id` = `Institute`.`id`) + (SELECT COUNT(`institute_change_reviews`.`review_id`) FROM `institute_change_reviews` WHERE `institute_change_reviews`.`after_institute_id` = `Institute`.`id`))',
				),
				'total_review_count',
			],
		];
		sql.order = [
			[{ model: InstituteAttribute, as: 'attribute' }, 'logo', 'DESC'],
			[[sequelize.literal('total_review_count'), 'DESC']],
			['name_ko', 'ASC'],
			['name_en', 'ASC'],
			['campus', 'ASC'],
			['id', 'ASC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 기관 정보 조회
		const institute = await Institute.findAll(sql);
		if (Object.keys(institute).length > 0) response = { total, list: institute };
	}

	// Return
	return response;
};

// 강사 인덱스로 연결된 기관 조회
export const getInstitutesByTutorId = async (tutorId) => {
	const response = await Institute.findAll({
		attributes: ['id', 'name_ko', 'campus', 'type', 'is_deleted'],
		where: { is_deleted: 'N' },
		include: [{ model: TutorInstitute, as: 'tutor_institute', where: { tutor_id: tutorId }, attributes: [] }],
	});
	return response;
};

// TutorId 로 기관 정보 조회
export const getInstituteByTutorId = async (tutorId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	const sql = {
		where: { is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] },
			{ model: TutorInstitute, as: 'tutor_institute', where: { tutor_id: tutorId }, attributes: [] },
		],
	};

	// Total
	const total = await Institute.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name_ko',
			'name_en',
			'campus',
			[
				sequelize.literal(
					'((SELECT COUNT(`institute_reviews`.`review_id`) FROM `institute_reviews` WHERE `institute_reviews`.`institute_id` = `Institute`.`id`) + (SELECT COUNT(`institute_change_reviews`.`review_id`) FROM `institute_change_reviews` WHERE `institute_change_reviews`.`before_institute_id` = `Institute`.`id`) + (SELECT COUNT(`institute_change_reviews`.`review_id`) FROM `institute_change_reviews` WHERE `institute_change_reviews`.`after_institute_id` = `Institute`.`id`))',
				),
				'total_review_count',
			],
		];
		sql.order = [
			[{ model: InstituteAttribute, as: 'attribute' }, 'logo', 'ASC'],
			[[sequelize.literal('total_review_count'), 'DESC']],
			['name_ko', 'ASC'],
			['name_en', 'ASC'],
			['campus', 'ASC'],
			['id', 'ASC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 기관 정보 조회
		const institute = await Institute.findAll(sql);
		if (Object.keys(institute).length > 0) response = { total, list: institute };
	}

	// Return
	return response;
};

// 기관 추가
export const addInstitute = async (instituteData, isGetId = false, t) => {
	const response = await Institute.create(
		{
			name_ko: instituteData.name_ko,
			name_en: instituteData.name_en,
			campus: instituteData.campus,
			type: instituteData.type,
			is_deleted: instituteData.is_deleted,
			is_confirm: instituteData.is_confirm,
			has_online: instituteData.has_online,
			has_review: instituteData.has_review,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 기관 속성 정보 추가
export const addInstituteAttribute = async (instituteAttribute, isGetId = false, t) => {
	const response = await InstituteAttribute.create({ institute_id: instituteAttribute.institute_id, default_logo: instituteAttribute.default_logo }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.institute_id : response;
};

// 기관 취급 과목 추가
export const addInstituteSubject = async (instituteSubjectData, isGetId = false, t) => {
	const response = await InstituteSubject.create({ institute_id: instituteSubjectData.institute_id, subject_id: instituteSubjectData.subject_id }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 기관 지역 추가
export const addInstituteRegion = async (instituteRegionData, isGetId = false, t) => {
	const response = await InstituteRegion.create({ institute_id: instituteRegionData.institute_id, region_id: instituteRegionData.region_id }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 기관 조회수 추가
export const addInstituteCount = async (instituteCountData, isGetId = false, t) => {
	const response = await InstituteCount.create(
		{ institute_id: instituteCountData.institute_id, view: instituteCountData.view, total_review_count: instituteCountData.total_review_count, follow_count: instituteCountData.follow_count },
		{ transaction: t },
	);
	// return
	return isGetId ? response.dataValues.institute_id : response;
};

// 기관 정렬 순서 추가
export const addInstituteSort = async (instituteSortData, isGetId = false, t) => {
	const response = await InstituteSort.create(
		{
			institute_id: instituteSortData.institute_id,
			filter_id: instituteSortData.filter_id,
			total_review_count: instituteSortData.total_review_count,
			tutor_review_count: instituteSortData.tutor_review_count,
			tutor_change_review_count: instituteSortData.tutor_change_review_count,
			institute_review_count: instituteSortData.institute_review_count,
			institute_change_review_count: instituteSortData.institute_change_review_count,
			is_major: instituteSortData.is_major,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

// InstituteId 로 기관 추가정보 수정
export const updateInstituteAttributeByInstituteId = async (instituteAttribute, t) => {
	const response = await InstituteAttribute.update({ logo: instituteAttribute.logo }, { where: { institute_id: instituteAttribute.institute_id }, transaction: t });
	return response;
};

// 강사 인덱스로 연결된 기관 정보 조회
export const getTutorInstitutesByTutorId = async (tutorId) => {
	const response = await Institute.findAll({
		attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
		where: { is_deleted: 'N' },
		include: [{ model: TutorInstitute, as: 'tutor_institute', where: { tutor_id: tutorId }, attributes: [], require: true }],
	});
	return response;
};

// memberId 에 연결된 기관 인덱스 반환
export const getInstituteIdsByMemberId = async (memberId) => {
	let ids = [];
	const instituteData = await InstituteMember.findAll({ attributes: ['institute_id'], where: { member_id: memberId } });
	ids = instituteData.map((instituteData) => instituteData.institute_id);
	// Return
	return ids;
};

// MemberId에 연결된 기관 정보 반환
export const getMemberRelationInstituteByMemberId = async (memberId) => {
	const headInstituteIds = [];
	const tmpInstituteIds = await getInstituteIdsByMemberId(memberId);
	// 본사 인덱스를 반환
	for (let i = 0; i < tmpInstituteIds.length; i += 1) {
		const institute = await getInstituteHighFamilies(tmpInstituteIds[i]); // eslint-disable-line no-await-in-loop
		headInstituteIds.push(institute ? institute.dataValues.sub_family.dataValues.parent_id : tmpInstituteIds[i]);
	}
	const response = await Institute.findAll({
		attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
		where: { id: { [Op.in]: headInstituteIds } },
		include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
	});
	return response;
};

// RegionIds 로 연결된 기관 Ids 조회
export const getInstituteIdsByRegionIds = async (regionIds = []) => {
	let ids = [];
	const instituteData = await Institute.findAll({
		attributes: ['id'],
		whwere: { is_deleted: 'N' },
		include: [{ model: Region, as: 'region', attributes: [], where: { id: { [Op.in]: regionIds } }, through: { attributes: [] } }],
	});
	ids = instituteData.map((instituteData) => instituteData.id);

	// Return
	return ids;
};

// 캠퍼스 기관 아이디 조회
export const getSubInstituteIds = async () => {
	let ids = [];
	const subInstituteDate = await InstituteFamily.findAll({ attributes: ['institute_id'] });
	ids = subInstituteDate.map((subInstituteDate) => subInstituteDate.institute_id);
	// Return
	return ids;
};

// 과목 인덱스로 기관 인덱스 조회
export const getInstituteIdsBySubjectIds = async (subjectIds) => {
	let ids = [];
	const instituteData = await InstituteSubject.findAll({ attributes: ['institute_id'], where: { subject_id: { [Op.in]: subjectIds } } });
	ids = instituteData.map((InstituteSubject) => InstituteSubject.institute_id);
	// Return
	return ids;
};

// 기관 타입 & 필터 인덱스를 통한 기관 조회
export const getInstituteByTypeAndFilterId = async (type, filterId, keyword, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 캠퍼스 기관 조회
	const subInstituteIds = await getSubInstituteIds();
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);

	let response = null;
	const instituteAttr = { type, is_deleted: 'N', is_confirm: 'Y', id: { [Op.notIn]: await getInstituteSubFamiliesId() } };
	if (keyword) instituteAttr.name_ko = { [Op.like]: `%${keyword}%` };
	let subjectInstitute = await getInstituteIdsBySubjectIds(subjectIds);
	if (subjectInstitute) subjectInstitute = [...new Set(subjectInstitute)];
	if (type === 'university') {
		if (subjectInstitute) instituteAttr.id = { [Op.in]: subjectInstitute };
	} else if (subInstituteIds && subjectInstitute) {
		instituteAttr.id = { [Op.and]: [{ [Op.notIn]: subInstituteIds }, { [Op.in]: subjectInstitute }] };
	} else {
		if (subInstituteIds) instituteAttr.id = { [Op.notIn]: subInstituteIds };
		if (subjectInstitute) instituteAttr.id = { [Op.in]: subjectInstitute };
	}

	const sql = { where: instituteAttr, include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'default_logo'] }] };

	// Total
	const total = await Institute.count(sql);
	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name_ko',
			'campus',
			'type',
			[
				sequelize.literal(
					'(( SELECT COUNT(`institute_reviews`.`review_id`) FROM `institute_reviews` WHERE `institute_reviews`.`institute_id` = `Institute`.`id` ) + ( SELECT COUNT(DISTINCT(`institute_change_reviews`.`review_id`)) FROM `institute_change_reviews` WHERE ( `institute_change_reviews`.`before_institute_id` = `Institute`.`id` OR `institute_change_reviews`.`after_institute_id` = `Institute`.`id`)))',
				),
				'total_review_count',
			],
			[
				sequelize.literal(
					// eslint-disable-next-line prefer-template
					'(SELECT `institute_sort`.`sort_average` FROM `institute_sort` WHERE `institute_sort`.`institute_id` = `Institute`.`id` AND `institute_sort`.`filter_id` = ' + filterId + ')',
				),
				'sort_average',
			],
		];

		sql.order =
			type === 'university'
				? [
						['name_ko', 'ASC'],
						['id', 'ASC'],
				  ]
				: [
						[[sequelize.literal('sort_average'), 'DESC']],
						[{ model: InstituteAttribute, as: 'attribute' }, 'logo', 'DESC'],
						[[sequelize.literal('total_review_count'), 'DESC']],
						['name_ko', 'ASC'],
						['campus', 'ASC'],
						['id', 'ASC'],
				  ];

		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 기관 정보 조회
		const institute = await Institute.findAll(sql);
		for (let i = 0, x = institute.length; i < x; i += 1)
			// eslint-disable-next-line no-await-in-loop
			institute[i].dataValues.subject = type !== 'university' ? await subjectComponent.getInstituteSubjectsByInstituteIdAndFilterId(institute[i].dataValues.id, filterId) : null;

		if (Object.keys(institute).length > 0) response = { total, list: institute };
	}

	// Return
	return response;
};

// 기관 속성 정보 조회
export const getInstituteAttributesById = async (instituteId) => {
	const response = await InstituteAttribute.findOne({
		attributes: ['logo', 'default_logo', 'message', 'site_url', 'tags', 'address', 'post', 'phone', 'geo_latitude', 'geo_longitude', 'average_point'],
		where: { institute_id: instituteId },
	});
	return response;
};

// 인근에 위치한 기관 조회
export const getPeripheryInstituteByInstituteIdAndTypeAndRegionId = async (instituteId, type, regionId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	const sql = {
		where: { id: { [Op.ne]: instituteId }, type, is_deleted: 'N', is_confirm: 'Y' },
		include: [
			{ model: Region, as: 'region', where: { id: regionId }, attributes: [], through: { attributes: [] }, require: true },
			{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'default_logo', 'message', 'average_point'], require: true },
			{ model: InstituteChildren, as: 'children', attributes: ['establish_type', 'status'], require: true },
		],
		subQuery: false,
	};

	// Total
	const total = await Institute.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name_ko',
			'name_en',
			'campus',
			'type',
			[
				sequelize.literal(
					'((SELECT COUNT(`institute_reviews`.`review_id`) FROM `institute_reviews` WHERE `institute_reviews`.`institute_id` = `Institute`.`id`) + (SELECT COUNT(`institute_change_reviews`.`review_id`) FROM `institute_change_reviews` WHERE `institute_change_reviews`.`before_institute_id` = `Institute`.`id`) + (SELECT COUNT(`institute_change_reviews`.`review_id`) FROM `institute_change_reviews` WHERE `institute_change_reviews`.`after_institute_id` = `Institute`.`id`))',
				),
				'total_review_count',
			],
		];
		sql.order = [[[sequelize.literal('total_review_count'), 'DESC']], ['name_ko', 'ASC'], ['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 기관 정보 조회
		const institutes = await Institute.findAll(sql);

		for (let i = 0; i < institutes.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const instituteRegionInfo = await regionComponent.getRegionInfoByInstituteId(institutes[i].dataValues.id);
			let instituteRegion = null;
			// eslint-disable-next-line no-await-in-loop
			if (instituteRegionInfo) instituteRegion = await regionComponent.getFullRegionInfoById(instituteRegionInfo.dataValues.region_id);

			institutes[i].dataValues.region = instituteRegion;
		}
		if (Object.keys(institutes).length > 0) response = { total, list: institutes };
	}

	// Return
	return response;
};

// 기관 리뷰 카운트 증가
export const postPlusReviewCount = async (instituteId, t) => {
	const response = await InstituteCount.update({ total_review_count: sequelize.literal(`total_review_count + 1`) }, { where: { institute_id: instituteId }, transaction: t });
	return response;
};

// 기관 팔로워 카운트 증가
export const postPlusFollowCount = async (instituteId, t) => {
	const response = await InstituteCount.update({ follow_count: sequelize.literal(`follow_count + 1`) }, { where: { institute_id: instituteId }, transaction: t });
	return response;
};

// 기관 팔로워 카운트 감소
export const postMinusFollowCount = async (instituteId, t) => {
	const instituteCount = await InstituteCount.findOne({ where: { institute_id: instituteId } });
	if (instituteCount.dataValues.follow_count > 0) await InstituteCount.update({ follow_count: sequelize.literal(`follow_count - 1`) }, { where: { institute_id: instituteId }, transaction: t });
	return null;
};

// 기관 로그 정보 조회
export const getCheckInstituteLog = async (instituteId, memberId, createdIp) => {
	// 검색 조건
	const values = { institute_id: instituteId, member_id: memberId, created_ip: createdIp };

	const sql = [
		'SELECT COUNT(`institute_id`) AS `count` ',
		'FROM `institute_count_logs` ',
		'WHERE `institute_count_logs`.`institute_id` = :institute_id ',
		values.member_id != null ? 'AND `institute_count_logs`.`member_id` = :member_id ' : 'AND `institute_count_logs`.`member_id` IS NULL ',
		'AND `institute_count_logs`.`created_ip` = :created_ip ',
		'AND TIMESTAMPDIFF(minute, date_format(`institute_count_logs`.`created_at`, "%Y-%m-%d %H:%i"), date_format(NOW(), "%Y-%m-%d %H:%i")) < 10; ',
	].join(' ');

	// Return
	const response = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	return response[0].count;
};

// 기관 조회수 증가
export const postPlusInstituteViewCount = async (instituteId, t) => {
	const response = await InstituteCount.update({ view: sequelize.literal(`view + 1`) }, { where: { institute_id: instituteId }, transaction: t });
	return response;
};

// 기관 조회수 로그 작성
export const postInstituteCount = async (instituteCount, isGetId = false, t) => {
	const response = await InstituteCountLog.create(
		{
			institute_id: instituteCount.institute_id,
			member_id: instituteCount.member_id,
			created_ip: instituteCount.created_ip,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 기관 소속 메이저 조회
export const getInstituteMajorById = async (instituteId) => {
	let response = null;
	const instituteSortReview = await InstituteSort.findOne({
		where: { institute_id: instituteId, total_review_count: { [Op.gt]: 0 } },
		order: [
			['total_review_count', 'DESC'],
			['id', 'DESC'],
		],
	});
	if (instituteSortReview) {
		response = { filter_id: instituteSortReview.dataValues.filter_id, site_path: await commonComponent.getSitePathByFilterId(instituteSortReview.dataValues.filter_id) };
	} else {
		const instituteSort = await InstituteSort.findOne({ where: { institute_id: instituteId, is_major: 'Y' } });
		if (instituteSort) response = { filter_id: instituteSort.dataValues.filter_id, site_path: await commonComponent.getSitePathByFilterId(instituteSort.dataValues.filter_id) };
	}
	return response;
};

// 카페 인덱스로 instituteId 조회
export const getInstituteIdByCafeId = async (cafeId) => {
	const response = CafeInstitute.findOne({ where: { cafe_id: cafeId, attributes: ['institute_id'] } });
	return response;
};
