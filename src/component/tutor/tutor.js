import { getModel, sequelize, Op } from '../../database';

import * as instituteComponent from '../institute/institute';
import * as filterComponent from '../filter/filter';
import * as followComponent from '../follow/follow';
import * as subjectComponent from '../subject/subject';
import * as cafeComponent from '../cafe/cafe';
import * as commonComponent from '../common';

const Tutor = getModel('Tutor');
const TutorAttribute = getModel('TutorAttribute');
const TutorSubject = getModel('TutorSubject');
const TutorInstitute = getModel('TutorInstitute');
const Subject = getModel('Subject');
const SubjectFilter = getModel('SubjectFilter');
const Institute = getModel('Institute');
const InstituteAttribute = getModel('InstituteAttribute');
const InstituteSubject = getModel('InstituteSubject');
const MemberFollowTutor = getModel('MemberFollowTutor');
const Filter = getModel('Filter');
const TutorMember = getModel('TutorMember');
const TutorCount = getModel('TutorCount');
const TutorCountLog = getModel('TutorCountLog');
const TutorSort = getModel('TutorSort');
const TutorRequestAuthCafe = getModel('TutorRequestAuthCafe');
const CafeTutor = getModel('CafeTutor');
const Cafes = getModel('Cafe');

/** @description 강사 인덱스 & 회원 인덱스로 강사 회원 존재 여부 확인 */
export const isExistTutorMember = async (tutorId, memberId) => ((await TutorMember.count({ where: { tutor_id: tutorId, member_id: memberId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// TutorId 존재 여부 조회
export const isExistTutorId = async (tutorId) => ((await Tutor.count({ where: { id: tutorId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 강사와 기관 연결 인덱스 존재 여부 확인
export const isExistTutorInstituteId = async (tutorInstituteId) => ((await TutorInstitute.count({ where: { id: tutorInstituteId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 강사 카페 생성 요청 인덱스 존재 여부 확인
export const isExistTutorRequestAuthCafeId = async (tutorRequestAuthCafeId) => ((await TutorRequestAuthCafe.count({ where: { id: tutorRequestAuthCafeId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// TutorId 로 강사 추가정보 수정
export const updateTutorAttributeByTutorId = async (tutorAttribute, t) => {
	const response = await TutorAttribute.update({ profile: tutorAttribute.profile }, { where: { tutor_id: tutorAttribute.tutor_id } }, { transaction: t });
	return response;
};

// 강사 정보 추가
export const addTutor = async (tutorData, isGetId = false, t) => {
	const response = await Tutor.create({ name: tutorData.name, is_deleted: tutorData.is_deleted, is_confirm: tutorData.is_confirm }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 강사 상세 정보 추가
export const addTutorAttribute = async (tutorAttributeData, isGetId = false, t) => {
	const response = await TutorAttribute.create({ tutor_id: tutorAttributeData.tutor_id, sex: tutorAttributeData.sex, default_profile: tutorAttributeData.default_profile }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 강사 과목 추가
export const addTutorSubject = async (tutorSubjectData, isGetId = false, t) => {
	const response = await TutorSubject.create({ tutor_id: tutorSubjectData.tutor_id, subject_id: tutorSubjectData.subject_id }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 강사 기관 추가
export const addTutorInstitute = async (tutorInstituteData, isGetId = false, t) => {
	const response = await TutorInstitute.create(
		{
			tutor_id: tutorInstituteData.tutor_id,
			institute_id: tutorInstituteData.institute_id,
			is_current: tutorInstituteData.is_current,
			join_at: tutorInstituteData.join_at,
			retire_at: tutorInstituteData.retire_at,
			sort_no: tutorInstituteData.sort_no,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : null;
};

// 강사 조회수 추가
export const addTutorCount = async (tutorCountData, isGetId = false, t) => {
	const response = await TutorCount.create(
		{ tutor_id: tutorCountData.tutor_id, view: tutorCountData.view, total_review_count: tutorCountData.total_review_count, follow_count: tutorCountData.follow_count },
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.tutor_id : null;
};

// 강사 정렬 순서 추가
export const addTutorSort = async (TutorSortData, isGetId = false, t) => {
	const response = await TutorSort.create(
		{
			tutor_id: TutorSortData.tutor_id,
			filter_id: TutorSortData.filter_id,
			total_review_count: TutorSortData.total_review_count,
			tutor_review_count: TutorSortData.tutor_review_count,
			tutor_change_review_count: TutorSortData.tutor_change_review_count,
			institute_review_count: TutorSortData.institute_review_count,
			institute_change_review_count: TutorSortData.institute_change_review_count,
			is_major: TutorSortData.is_major,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 강사 인덱스로 카페 인덱스 조회
 * @param {Int} tutorId
 */
export const getCafeIdByTutorId = async (tutorId) => {
	const response = await CafeTutor.findOne({ where: { tutor_id: tutorId }, attributes: ['cafe_id'] });
	return response;
};

/**
 * @description 강사 Id 로 강사 조회
 * @param {Int} tutorId
 * @param {Int} memberId
 * @param {Int} filterId
 */
export const getTutorById = async (tutorId, memberId = null, filterId = null) => {
	let filterIds = null;
	if (filterId) filterIds = await filterComponent.getSubFilterIdsByFilterId(filterId);

	// 강사 정보 조회
	const tutor = await Tutor.findOne({
		where: { id: tutorId, is_deleted: 'N' },
		attributes: ['id', 'name', 'is_confirm'],
		include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] }],
	});

	let tutorSubject = null;
	if (filterIds) {
		tutorSubject = await Subject.findAll({
			include: [
				{ model: Tutor, as: 'tutor', attributes: [], where: { id: tutorId, is_deleted: 'N' }, required: true },
				{ model: SubjectFilter, as: 'subject_filter', attributes: [], where: { filter_id: { [Op.in]: filterIds } }, required: true },
			],
		});
	} else {
		tutorSubject = await Subject.findAll({ include: [{ model: Tutor, as: 'tutor', attributes: [], where: { id: tutorId, is_deleted: 'N' }, required: true }] });
	}

	// 하위기관과 존재여부 및 팔로우 여부 조회
	if (tutor) {
		tutor.dataValues.subject = tutorSubject;
		const subjectArray = tutor.dataValues.subject || null;
		let subjectIds = null;
		if (subjectArray) subjectIds = subjectArray.map((subject) => subject.id);

		const tutorInstitute = await TutorInstitute.findAll({
			attributes: ['is_current', 'join_at', 'retire_at', 'sort_no'],
			where: { tutor_id: tutorId },
			include: [
				{
					model: Institute,
					as: 'institute',
					attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
					include: [
						{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] },
						{ model: InstituteSubject, as: 'institute_subject', attributes: [], where: { subject_id: { [Op.in]: subjectIds } }, required: true },
					],
				},
			],
			order: [
				['is_current', 'ASC'],
				['sort_no', 'ASC'],
				['id', 'ASC'],
			],
		});

		for (let i = 0; i < tutorInstitute.length; i += 1) {
			if (tutorInstitute[i].dataValues.institute) {
				const instituteId = tutorInstitute[i].dataValues.institute.dataValues.id;
				const isExist = await instituteComponent.isExistInstituteSubFamilies(instituteId); // eslint-disable-line no-await-in-loop
				const isExistHeadOffice = await instituteComponent.isExistInstituteHighFamilies(instituteId); // eslint-disable-line no-await-in-loop

				tutorInstitute[i].dataValues.institute.dataValues.has_sub_families = isExist ? 'Y' : 'N';
				tutorInstitute[i].dataValues.institute.dataValues.is_head_office = isExistHeadOffice ? 'N' : 'Y';
			}
		}
		let isFollow = null;
		if (memberId) isFollow = await followComponent.isExistTutorFollow(tutorId, memberId);
		tutor.dataValues.is_follow = isFollow;
		tutor.dataValues.tutor_institute = tutorInstitute;
		const cafeId = await getCafeIdByTutorId(tutorId);
		if (cafeId && Object.keys(cafeId).length > 0) tutor.dataValues.cafe_id = cafeId.cafe_id;
	}
	// Return
	return tutor;
};

// 강사 일치 여부 조회
export const getMatchTutor = async (tutorName, instituteIdParam) => {
	let instituteId = instituteIdParam;
	// 기관 인덱스를 통한 기관 본사 조회
	const isExist = await instituteComponent.isExistInstituteHighFamilies(instituteId);

	// 본사가 존재 하는 경우
	if (isExist) {
		const institute = await instituteComponent.getInstituteHighFamilies(instituteId);
		instituteId = institute.dataValues.id;
	}

	// 강사 이름과 기관 인덱스를 통한 강사 조회
	const tutor = await Tutor.findOne({
		where: { name: tutorName },
		attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
		include: [
			{
				model: TutorInstitute,
				as: 'tutor_institute',
				where: { institute_id: instituteId },
				attributes: ['is_current', 'join_at', 'retire_at', 'sort_no'],
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
				],
			},
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] },
		],
	});

	return tutor;
};

// 검색 조건으로 팔로우 강사 목록 조회
export const getTutorByFollowSearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const name = searchFields.name ? searchFields.name : null;
	const order = searchFields.order ? searchFields.order : null;
	const memberFollowTutor = searchFields.member_follow_tutor ? searchFields.member_follow_tutor : null;
	let response = null;

	// 검색 조건
	const values = { member_id: memberFollowTutor.member_id, offset: parseInt(offset, 10), limit: parseInt(limit, 10) };
	if (order) values.order = order.order || null;
	if (name) values.name = name.name ? `%${name.name}%` : null;

	const sql = [
		'	FROM ( ',
		'		SELECT ',
		'			`tutors`.`id`, ',
		'			`tutors`.`name`, ',
		'			`tutors`.`is_confirm`, ',
		'			`tutors`.`is_deleted`, ',
		'			`tutor_attributes`.`sex`, ',
		'			`tutor_attributes`.`profile`, ',
		'			`tutor_attributes`.`average_point`, ',
		'			`member_follow_tutors`.`created_at`, ',
		'			`member_follow_tutors`.`id` AS `member_follow_tutors_id`, ',
		'			`member_follow_tutors`.`filter_id`, ',
		'			( ',
		'				SELECT COUNT(`cafe_tutors`.`id`) ',
		'				FROM `cafe_tutors` ',
		'				WHERE `cafe_tutors`.`tutor_id` = `tutors`.`id` ',
		'			) AS `is_cafe` ',
		'		FROM `tutors` ',
		'		INNER JOIN `tutor_attributes` ON `tutor_attributes`.`tutor_id` = `tutors`.`id` ',
		'		INNER JOIN `member_follow_tutors` ON `member_follow_tutors`.`tutor_id` = `tutors`.`id` ',
		'		WHERE `member_follow_tutors`.`id` IS NOT NULL ',
		'		AND `member_follow_tutors`.`member_id` = :member_id ',
		'		AND `tutors`.`is_confirm` = "Y" ',
		'		AND `tutors`.`is_deleted` = "N" ',
		values.name ? '	AND ( `tutors`.`name` like :name ' : ' ',
		values.name ? '	OR `tutors`.`id` IN ( ' : ' ',
		values.name ? '	SELECT `tutor_institutes`.`tutor_id` ' : ' ',
		values.name ? '	FROM `tutor_institutes` ' : ' ',
		values.name ? '	INNER JOIN `institutes` ON `institutes`.`id` = `tutor_institutes`.`institute_id` ' : ' ',
		values.name ? '	WHERE `tutor_institutes`.`institute_id` ' : ' ',
		values.name ? '	AND `institutes`.`is_confirm` = "Y" ' : ' ',
		values.name ? '	AND `institutes`.`is_deleted` = "N" ' : ' ',
		values.name ? '	AND `institutes`.`name_ko` like :name	 ' : ' ',
		values.name ? '	) ' : ' ',
		values.name ? '	) ' : ' ',
		'	) AS `member_follow_tutors_list` ',
		'	ORDER BY ',
		values.order == null ? '  `member_follow_tutors_list`.`created_at` DESC, `member_follow_tutors_list`.`member_follow_tutors_id` DESC ' : ' ',
		values.order === 'first_follow' ? ' `member_follow_tutors_list`.`created_at` ASC, `member_follow_tutors_list`.`member_follow_tutors_id` DESC ' : ' ',
		values.order === 'cafe_opened' ? ' `member_follow_tutors_list`.`is_cafe` ASC, `member_follow_tutors_list`.`member_follow_tutors_id` DESC ' : ' ',
		values.order === 'cafe_non_opened' ? ' `member_follow_tutors_list`.`is_cafe` DESC, `member_follow_tutors_list`.`member_follow_tutors_id` DESC ' : ' ',
	].join(' ');

	const countSql = ['SELECT COUNT(`member_follow_tutors_list`.`id`) AS `total` '].join(' ') + sql;
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const tutorFollowSql = ['SELECT `member_follow_tutors_list`.`*` '].join(' ') + sql + ['LIMIT :offset, :limit; '].join(' ');
		const tutorFollowData = await sequelize.query(tutorFollowSql, { type: sequelize.QueryTypes.SELECT, replacements: values });

		const tutorFollows = [];
		for (let i = 0; i < tutorFollowData.length; i += 1) {
			const subjects = await subjectComponent.getTutorSubjectsByTutorId(tutorFollowData[i].id); // eslint-disable-line no-await-in-loop
			const institutes = await instituteComponent.getInstitutesByTutorId(tutorFollowData[i].id); // eslint-disable-line no-await-in-loop
			for (let j = 0; j < subjects.length; j += 1) {
				const filter = await filterComponent.getLevelOneFilterBySubjectIds([subjects[j].dataValues.id]); // eslint-disable-line no-await-in-loop
				subjects[j].dataValues.filter = Object.keys(filter).length > 0 ? filter[0].dataValues : null;
			}

			const tmpData = {
				id: tutorFollowData[i].id,
				name: tutorFollowData[i].name,
				is_deleted: tutorFollowData[i].is_deleted,
				is_confirm: tutorFollowData[i].is_confirm,
				filter_id: tutorFollowData[i].filter_id,
				attribute: {
					sex: tutorFollowData[i].sex,
					average_point: tutorFollowData[i].average_point,
					profile: tutorFollowData[i].profile,
				},
				match_cafe: tutorFollowData[i].is_cafe > 0 ? 'Y' : 'N',
				follow_at: tutorFollowData[i].created_at,
				subjects,
				institutes,
			};
			tutorFollows[i] = tmpData;
		}
		if (Object.keys(tutorFollows).length > 0) response = { total, list: tutorFollows };
	}
	// Return
	return response || null;
};

// SubjectId 로 연결된 tutorId 조회
export const getTutorIdArrayBySubjectIdArray = async (subjectIdArray) => {
	const tmpData = await Tutor.findAll({
		where: { is_deleted: 'N' },
		attributes: ['id'],
		include: [{ model: Subject, as: 'subject', where: { id: { [Op.in]: subjectIdArray }, is_deleted: 'N' }, attributes: [], through: { attributes: [] } }],
	});
	// Return
	return tmpData ? tmpData.map((tutor) => tutor.id) : null;
};

// 검색 조건으로 강사 목록 조회
export const getTutorBySearchFields = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const tutor = searchFields.tutor ? searchFields.tutor : null;
	const tutorAttribute = searchFields.tutor_attribute ? searchFields.tutor_attribute : null;
	const subject = searchFields.subject ? searchFields.subject : null;
	const filter = searchFields.filter ? searchFields.filter : null;
	let response = null;

	// 검색 조건
	const tutorAttr = {};
	if (tutor) {
		if (tutor.name) tutorAttr.name = { [Op.like]: [`%${tutor.name}%`] };
		if (tutor.is_deleted) tutorAttr.is_deleted = tutor.is_deleted;
		if (tutor.is_confirm) tutorAttr.is_confirm = { [Op.in]: [tutor.is_confirm] };
	}

	const tutorAttributeAttr = {};
	if (tutorAttribute) {
		if (tutorAttribute.sex) tutorAttributeAttr.sex = tutorAttribute.sex;
		if (tutorAttribute.message) tutorAttributeAttr.message = { [Op.like]: [`%${tutorAttribute.message}%`] };
	}

	// subject 또는 filter 검색 조건이 있는 경우 해당 조건을 통해 강사의 인덱스 조회
	if (subject || filter) {
		if (subject.id) {
			// subject 로 연결된 tutor 조회
			const tutorIdArray = await getTutorIdArrayBySubjectIdArray([subject.id]);
			if (tutorIdArray) tutorAttr.id = { [Op.in]: tutorIdArray };
		}

		if (filter.id && !subject.id) {
			// filter 하위의 subject 전체를 조회
			const subjectIds = await filterComponent.getSubjectArrayByFilterId(filter.id);

			// subject 로 연결된 tutor 조회
			if (subjectIds) {
				const tutorIdArray = await getTutorIdArrayBySubjectIdArray(subjectIds);
				if (tutorIdArray) tutorAttr.id = { [Op.in]: tutorIdArray };
			}
		}
	}

	const subjectAttr = {};
	if (subject) {
		if (subject.subject_id) subjectAttr.subject_id = subject.subject_id;
		if (subject.is_deleted) subjectAttr.is_deleted = subject.is_deleted;
	}

	const filterAttr = {};
	if (filter) {
		if (filter.id) filterAttr.id = filter.id;
		if (filter.code) filterAttr.code = filter.code;
		if (filter.is_deleted) filterAttr.is_deleted = filter.is_deleted;
	}

	const sql = {
		where: tutorAttr,
		include: [
			{ model: TutorAttribute, as: 'attribute', where: tutorAttribute, attributes: ['sex', 'profile', 'message', 'average_point'] },
			{ model: Subject, as: 'subject', attributes: ['id', 'name', 'comment', 'sort_no', 'is_deleted'], through: { attributes: [] } },
			{
				model: TutorInstitute,
				as: 'tutor_institute',
				attributes: ['is_current', 'join_at', 'retire_at', 'sort_no'],
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm', 'has_online', 'has_review'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo', 'message', 'site_url', 'average_point'] }],
					},
				],
			},
		],
		distinct: true,
	};

	// Total
	const total = await Tutor.count(sql);
	if (total && total > 0) {
		sql.attributes = ['id', 'name', 'is_confirm'];
		sql.order = [['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutors = await Tutor.findAll(sql);
		if (Object.keys(tutors).length > 0) response = { total, list: tutors };
	}
	// Return
	return response || null;
};

// 강사 소속 메이저 조회
export const getTutorMajorById = async (tutorId) => {
	let response = null;
	const tutorSortReview = await TutorSort.findOne({
		where: { tutor_id: tutorId, total_review_count: { [Op.gt]: 0 } },
		order: [
			['total_review_count', 'DESC'],
			['id', 'DESC'],
		],
	});
	if (tutorSortReview) {
		response = { filter_id: tutorSortReview.dataValues.filter_id, site_path: await commonComponent.getSitePathByFilterId(tutorSortReview.dataValues.filter_id) };
	} else {
		const tutorSort = await TutorSort.findOne({ where: { tutor_id: tutorId, is_major: 'Y' } });
		if (tutorSort) response = { filter_id: tutorSort.dataValues.filter_id, site_path: await commonComponent.getSitePathByFilterId(tutorSort.dataValues.filter_id) };
	}
	return response;
};

// 본사에 소속된 강사 목록 조회
export const getTutorByMainInstitute = async (instituteId, subjectId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 검색 조건
	const subjectAttr = { is_deleted: 'N' };
	if (subjectId) subjectAttr.id = subjectId;

	// 본사에 소속된 강사만을 조회
	let response = null;

	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
		include: [
			{ model: Subject, as: 'subject', where: subjectAttr, attributes: [], through: { attributes: [] } },
			{ model: TutorInstitute, as: 'tutor_institute', where: { institute_id: instituteId }, attributes: [] },
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] },
		],
		distinct: true,
	};

	// Total
	const total = await Tutor.count(sql);
	if (total && total > 0) {
		const values = { offset: parseInt(offset, 10), limit: parseInt(limit, 10), instituteId, subjectId };
		const query = [
			'SELECT ',
			'`Tutor`.`*`, ',
			'(`Tutor`.`tutor_review_count` + `Tutor`.`before_tutor_review_count` + `Tutor`.`after_tutor_review_count` ) AS `total_review_count`, ',
			'`attribute`.`sex` AS `attribute.sex`, ',
			'`attribute`.`profile` AS `attribute.profile`, ',
			'`attribute`.`message` AS `attribute.message`, ',
			'`attribute`.`average_point` AS `attribute.average_point` ',
			'FROM ( ',
			'	SELECT ',
			'		`Tutor`.`id`, ',
			'		`Tutor`.`name`, ',
			'		`Tutor`.`is_deleted`, ',
			'		`Tutor`.`is_confirm`, ',
			'		( ',
			'			SELECT COUNT(`tutor_reviews`.`review_id`) ',
			'			FROM `tutor_reviews` ',
			'			WHERE `tutor_reviews`.`tutor_id` = `Tutor`.`id` ',
			'		) AS `tutor_review_count`, ',
			'		( ',
			'			SELECT COUNT(`tutor_change_reviews`.`review_id`) ',
			'			FROM `tutor_change_reviews` ',
			'			WHERE `tutor_change_reviews`.`before_tutor_id` = `Tutor`.`id` ',
			'		) AS `before_tutor_review_count`, ',
			'		( ',
			'			SELECT COUNT(`tutor_change_reviews`.`review_id`) ',
			'			FROM `tutor_change_reviews` ',
			'			WHERE `tutor_change_reviews`.`after_tutor_id` = `Tutor`.`id` ',
			'		) AS `after_tutor_review_count` ',
			'	FROM `tutors` AS `Tutor` ',
			'	WHERE `Tutor`.`id` IN ( ',
			'		SELECT `tutors`.`id` ',
			'		FROM `tutors` ',
			'		INNER JOIN `tutor_institutes` ON `tutor_institutes`.`tutor_id` = `tutors`.`id` AND `tutor_institutes`.`institute_id` = :instituteId ',
			subjectId ? '		INNER JOIN `tutor_subjects` ON `tutor_subjects`.`tutor_id` = `tutors`.`id` AND `tutor_subjects`.`subject_id` = :subjectId ' : ' ',
			'		WHERE `tutors`.`is_deleted` = "N" ',
			'		AND `tutors`.`is_confirm` IN ("Y") ',
			'	) ',
			') AS `Tutor` ',
			'INNER JOIN `tutor_attributes` AS `attribute` ON `Tutor`.`id` = `attribute`.`tutor_id` ',
			'ORDER BY `total_review_count` DESC, `Tutor`.`id` ASC ',
			'LIMIT :offset, :limit; ',
		].join(' ');

		// 강사 정보 조회
		const tutorData = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: values });

		const tutor = [];
		// form modify
		for (let i = 0; i < tutorData.length; i += 1) {
			const subjectData = await subjectComponent.getTutorSubjectsByTutorId(tutorData[i].id); // eslint-disable-line no-await-in-loop
			const instituteData = await instituteComponent.getTutorInstitutesByTutorId(tutorData[i].id); // eslint-disable-line no-await-in-loop
			const tutorMajor = await getTutorMajorById(tutorData[i].id); // eslint-disable-line no-await-in-loop
			const tutorMajorData = tutorMajor || null;
			const tmpData = {
				id: tutorData[i].id,
				name: tutorData[i].name,
				is_deleted: tutorData[i].is_deleted,
				is_confirm: tutorData[i].is_confirm,
				tutor_review_count: tutorData[i].tutor_review_count,
				before_tutor_review_count: tutorData[i].before_tutor_review_count,
				after_tutor_review_count: tutorData[i].after_tutor_review_count,
				total_review_count: tutorData[i].total_review_count,
				attribute: {
					sex: tutorData[i]['attribute.sex'],
					profile: tutorData[i]['attribute.profile'],
					message: tutorData[i]['attribute.message'],
					average_point: tutorData[i]['attribute.average_point'],
				},
				institute: instituteData,
				subject: subjectData,
				major: tutorMajorData,
			};
			tutor[i] = tmpData;
		}
		if (Object.keys(tutor).length > 0) response = { total, list: tutor };
	}
	// Return
	return response || null;
};

// instituteId & filterId & tutorName 을 통한 강사 목록 조회
export const getTutorByInstituteIdAndFilterIdAndTutorName = async (instituteId, filterId, tutorName, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 필터에 소속된 과목 조회
	const filterSubjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	const instituteSubjectIds = await subjectComponent.getSubjectIdsByInstituteId(instituteId);
	const subjectIds = [];
	for (let i = 0; i < instituteSubjectIds.length; i += 1) if (filterSubjectIds.includes(parseInt(instituteSubjectIds[i], 10))) subjectIds.push(instituteSubjectIds[i]);
	let response = null;
	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] }, name: { [Op.like]: `%${tutorName}%` } },
		include: [
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'average_point'] },
			{
				model: TutorInstitute,
				as: 'tutor_institute',
				attributes: ['id', 'is_current', 'join_at', 'retire_at', 'sort_no'],
				where: { institute_id: instituteId },
				order: [
					['sotr_no', 'ASC'],
					['id', 'ASC'],
				],
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo'] }],
					},
				],
			},
			{
				model: Subject,
				as: 'subject',
				where: { id: { [Op.in]: subjectIds }, is_deleted: 'N' },
				attributes: ['id', 'name', 'comment', 'sort_no'],
				order: [
					['sort_no', 'ASC'],
					['id', 'ASC'],
				],
				through: { attributes: [] },
			},
		],
	};

	// Total
	const total = await Tutor.count(sql);
	if (total && total > 0) {
		sql.order = [
			['name', 'ASC'],
			['id', 'ASC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutors = await Tutor.findAll(sql);
		if (Object.keys(tutors).length > 0) response = { total, list: tutors };
	}
	// Return
	return response || null;
};

// subjectId & tutorName 을 통한 강사 목록 조회
export const getTutorBySubjectIdsAndTutorName = async (subjectIds, tutorName, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] }, name: { [Op.like]: `%${tutorName}%` } },
		include: [
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'average_point'] },
			{
				model: TutorInstitute,
				as: 'tutor_institute',
				attributes: ['id', 'is_current', 'join_at', 'retire_at', 'sort_no'],
				order: [
					['sotr_no', 'ASC'],
					['id', 'ASC'],
				],
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo'] }],
					},
				],
			},
			{
				model: Subject,
				as: 'subject',
				where: { id: { [Op.in]: subjectIds }, is_deleted: 'N' },
				attributes: ['id', 'name', 'comment', 'sort_no'],
				order: [
					['sort_no', 'ASC'],
					['id', 'ASC'],
				],
				through: { attributes: [] },
			},
		],
	};

	// Total
	const total = await Tutor.count(sql);
	if (total && total > 0) {
		sql.attributes = ['id', 'name', 'is_deleted', 'is_confirm'];
		sql.order = [
			['name', 'ASC'],
			['id', 'ASC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutors = await Tutor.findAll(sql);
		if (Object.keys(tutors).length > 0) response = { total, list: tutors };
	}
	// Return
	return response || null;
};

// 과목 Id 와 강사 이름을 통한 강사 목록 조회
export const getTutorBySubjectIdAndInstituteIdAndTutorName = async (subjectId, instituteId, tutorName, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 기관에 소속된 강사만을 조회
	let response = null;

	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] }, name: { [Op.like]: `%${tutorName}%` } },
		include: [
			{ model: Subject, as: 'subject', where: { ...(subjectId ? { id: subjectId } : null), is_deleted: 'N' }, attributes: [], through: { attributes: [] } },
			{ model: TutorInstitute, as: 'tutor_institute', where: { institute_id: instituteId }, attributes: [] },
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] },
		],
	};

	// Total
	const total = await Tutor.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name',
			'is_deleted',
			'is_confirm',
			[
				sequelize.literal(
					'((SELECT COUNT(`tutor_reviews`.`review_id`) FROM `tutor_reviews` WHERE `tutor_reviews`.`tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`before_tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`after_tutor_id` = `Tutor`.`id`))',
				),
				'total_review_count',
			],
		];
		sql.order = [[{ model: TutorAttribute, as: 'attribute' }, 'profile', 'ASC'], [[sequelize.literal('total_review_count'), 'DESC']], ['name', 'ASC'], ['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutor = await Tutor.findAll(sql);
		if (Object.keys(tutor).length > 0) response = { total, list: tutor };
	}

	// Return
	return response || null;
};

// 과목 Id 를 통한 강사 목록 조회
export const getTutorBySubjectIdAndInstituteId = async (subjectId, instituteId, offset = 0, limitParam = 10, order = null) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	// 기관에 소속된 강사만을 조회
	let response = null;

	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
		include: [
			{ model: Subject, as: 'subject', where: { ...(subjectId ? { id: subjectId } : null), is_deleted: 'N' }, attributes: [], through: { attributes: [] } },
			{ model: TutorInstitute, as: 'tutor_institute', where: { institute_id: instituteId }, attributes: [] },
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] },
		],
	};

	// Total
	const total = await Tutor.count(sql);
	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name',
			'is_deleted',
			'is_confirm',
			[
				sequelize.literal(
					'((SELECT COUNT(`tutor_reviews`.`review_id`) FROM `tutor_reviews` WHERE `tutor_reviews`.`tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`before_tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`after_tutor_id` = `Tutor`.`id`))',
				),
				'total_review_count',
			],
		];

		if (!order) {
			sql.order = [[{ model: TutorAttribute, as: 'attribute' }, 'profile', 'ASC'], [[sequelize.literal('total_review_count'), 'DESC']], ['name', 'ASC'], ['id', 'ASC']];
		} else if (order === 'name') {
			sql.order = [
				['name', 'ASC'],
				['id', 'ASC'],
			];
		}
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutor = await Tutor.findAll(sql);
		if (Object.keys(tutor).length > 0) response = { total, list: tutor };
	}

	// Return
	return response || null;
};

// 과목 Id 를 통한 강사 목록 조회
export const getTutorBySubjectId = async (subjectId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] } },
		include: [
			{ model: Subject, as: 'subject', where: { id: subjectId, is_deleted: 'N' }, attributes: [], through: { attributes: [] } },
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point'] },
		],
	};

	// Total
	const total = await Tutor.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name',
			'is_deleted',
			'is_confirm',
			[
				sequelize.literal(
					'((SELECT COUNT(`tutor_reviews`.`review_id`) FROM `tutor_reviews` WHERE `tutor_reviews`.`tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`before_tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`after_tutor_id` = `Tutor`.`id`))',
				),
				'total_review_count',
			],
		];
		sql.order = [[{ model: TutorAttribute, as: 'attribute' }, 'profile', 'ASC'], [[sequelize.literal('total_review_count'), 'DESC']], ['name', 'ASC'], ['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutor = await Tutor.findAll(sql);
		if (Object.keys(tutor).length > 0) response = { total, list: tutor };
	}
	// Return
	return response || null;
};

// 강사 이름을 통한 강사 목록 조회
export const getTutorByTutorName = async (tutorName, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	const sql = {
		where: { is_deleted: 'N', is_confirm: { [Op.in]: ['Y'] }, name: { [Op.like]: [`%${tutorName}%`] } },
		include: [
			{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'average_point'] },
			{
				model: TutorInstitute,
				as: 'tutor_institute',
				attributes: ['id', 'is_current', 'join_at', 'retire_at', 'sort_no'],
				order: [
					['sotr_no', 'ASC'],
					['id', 'ASC'],
				],
				include: [
					{
						model: Institute,
						as: 'institute',
						attributes: ['id', 'name_ko', 'name_en', 'campus', 'type', 'is_deleted', 'is_confirm'],
						include: [{ model: InstituteAttribute, as: 'attribute', attributes: ['logo'] }],
					},
				],
			},
			{
				model: Subject,
				as: 'subject',
				where: { is_deleted: 'N' },
				attributes: ['id', 'name', 'comment', 'sort_no'],
				order: [
					['sort_no', 'ASC'],
					['id', 'ASC'],
				],
				through: { attributes: [] },
			},
		],
	};

	// Total
	const total = await Tutor.count(sql);
	if (total && total > 0) {
		sql.attributes = [
			'id',
			'name',
			'is_deleted',
			'is_confirm',
			[
				sequelize.literal(
					'((SELECT COUNT(`tutor_reviews`.`review_id`) FROM `tutor_reviews` WHERE `tutor_reviews`.`tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`before_tutor_id` = `Tutor`.`id`) + (SELECT COUNT(`tutor_change_reviews`.`review_id`) FROM `tutor_change_reviews` WHERE `tutor_change_reviews`.`after_tutor_id` = `Tutor`.`id`))',
				),
				'total_review_count',
			],
		];
		sql.order = [[{ model: TutorAttribute, as: 'attribute' }, 'profile', 'ASC'], [[sequelize.literal('total_review_count'), 'DESC']], ['name', 'ASC'], ['id', 'ASC']];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 강사 정보 조회
		const tutor = await Tutor.findAll(sql);

		// 강사 과목에 따른 필터 추가 조회
		for (let i = 0; i < tutor.length; i += 1) {
			const tutorSubjectTempData = tutor[i].dataValues.subject;
			const tutorSubjectIds = tutorSubjectTempData.map((Subject) => Subject.id);
			const filter = await filterComponent.getLevelOneFilterBySubjectIds(tutorSubjectIds); // eslint-disable-line no-await-in-loop
			tutor[i].dataValues.filter = filter;
		}
		if (Object.keys(tutor).length > 0) response = { total, list: tutor };
	}
	// Return
	return response || null;
};

// memberId 에 연결된 강사 인덱스 반환
export const getTutorIdsByMemberId = async (memberId) => {
	let ids = [];
	const tutorData = await TutorMember.findAll({ attributes: ['tutor_id'], where: { member_id: memberId } });
	ids = tutorData.map((tutorData) => tutorData.tutor_id);
	// Return
	return ids;
};

// FilterId 와 InstituteId 에 연결된 강사 인덱스 반환
export const getTutorIdsByFilterIdAndInstituteId = async (filterId, instituteId) => {
	let tutorIds = [];
	const filterIds = await filterComponent.getSubFilterIdsByFilterId(filterId);
	const tutorData = await Tutor.findAll({
		attributes: ['id'],
		where: { is_deleted: 'N' },
		include: [
			{ model: TutorInstitute, as: 'tutor_institute', attributes: [], where: { institute_id: instituteId }, required: true },
			{
				model: Subject,
				as: 'subject',
				attributes: [],
				through: { attributes: [] },
				include: [{ model: Filter, as: 'filter', attributes: [], through: { attributes: [] }, where: { id: { [Op.in]: filterIds } }, required: true }],
				required: true,
			},
		],
		distinct: true,
	});
	tutorIds = tutorData.map((tutorData) => tutorData.id);
	// Return
	return tutorIds;
};

// MemberId에 연결된 강사 정보 반환
export const getMemberRelationTutorByMemberId = async (memberId) => {
	const tutorIds = await getTutorIdsByMemberId(memberId);
	const response = await Tutor.findAll({
		attributes: ['id', 'name', 'is_deleted', 'is_confirm'],
		where: { id: { [Op.in]: tutorIds } },
		include: [{ model: TutorAttribute, as: 'attribute', attributes: ['sex', 'profile', 'message', 'average_point', 'default_profile'] }],
	});
	return response;
};

// InstituteId 에 연결된 강사 인덱스 반환
export const getTutorIdsByInstituteId = async (instituteId) => {
	let ids = [];
	const tutorData = await TutorInstitute.findAll({ attributes: ['tutor_id'], where: { institute_id: instituteId } });
	ids = tutorData.map((tutorData) => tutorData.tutor_id);
	// Return
	return ids;
};

// subjectIds 에 연결된 강사 인덱스 반환
export const getTutorIdsBySubjectIds = async (subjectIds) => {
	let ids = [];
	const tutorData = await TutorSubject.findAll({ attributes: ['tutor_id'], where: { subject_id: { [Op.in]: subjectIds } } });
	ids = tutorData.map((tutorData) => tutorData.tutor_id);
	// Return
	return ids;
};

// 강사 리뷰 카운트 증가
export const postPlusReviewCount = async (tutorId, t) => {
	const response = await TutorCount.update({ total_review_count: sequelize.literal(`total_review_count + 1`) }, { where: { tutor_id: tutorId }, transaction: t });
	return response;
};

// 강사 팔로워 카운트 증가
export const postPlusFollowCount = async (tutorId, t) => {
	const response = await TutorCount.update({ follow_count: sequelize.literal(`follow_count + 1`) }, { where: { tutor_id: tutorId }, transaction: t });
	return response;
};

// 강사 팔로워 카운트 감소
export const postMinusFollowCount = async (tutorId, t) => {
	const tutorCount = await TutorCount.findOne({ where: { tutor_id: tutorId } });
	if (tutorCount.dataValues.follow_count > 0) await TutorCount.update({ follow_count: sequelize.literal(`follow_count - 1`) }, { where: { tutor_id: tutorId }, transaction: t });
	return null;
};

// 강사 로그 정보 조회
export const getCheckTutorLog = async (tutorId, memberId, createdIp) => {
	// 검색 조건
	const values = { tutor_id: tutorId, member_id: memberId, created_ip: createdIp };

	const sql = [
		'SELECT COUNT(`tutor_id`) AS `count` ',
		'FROM `tutor_count_logs` ',
		'WHERE `tutor_count_logs`.`tutor_id` = :tutor_id ',
		values.member_id != null ? 'AND `tutor_count_logs`.`member_id` = :member_id ' : 'AND `tutor_count_logs`.`member_id` IS NULL ',
		'AND `tutor_count_logs`.`created_ip` = :created_ip ',
		'AND TIMESTAMPDIFF(minute, date_format(`tutor_count_logs`.`created_at`, "%Y-%m-%d %H:%i"), date_format(NOW(), "%Y-%m-%d %H:%i")) < 10; ',
	].join(' ');

	// Return
	const response = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	return response[0].count;
};

// 강사 조회수 증가
export const postPlusTutorViewCount = async (tutorId, t) => {
	const response = await TutorCount.update({ view: sequelize.literal(`view + 1`) }, { where: { tutor_id: tutorId }, transaction: t });
	return response;
};

// 강사 조회수 로그 작성
export const postTutorCount = async (tutorCount, isGetId = false, t) => {
	const response = await TutorCountLog.create(
		{
			tutor_id: tutorCount.tutor_id,
			member_id: tutorCount.member_id,
			created_ip: tutorCount.created_ip,
		},
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 강사 카페 개설 요청
 * @param {Array} tutorRequestAuthCafe
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const addTutorRequestAuthCafe = async (tutorRequestAuthCafe, isGetId = false, t) => {
	const response = await TutorRequestAuthCafe.create(
		{ tutor_id: tutorRequestAuthCafe.tutor_id, comment: tutorRequestAuthCafe.comment, is_confirm: tutorRequestAuthCafe.is_confirm, request_type: tutorRequestAuthCafe.request_type },
		{ transaction: t },
	);
	// Return
	return isGetId ? response.dataValues.id : response;
};

// 카페 인덱스로 tutorId 조회
export const getTutorIdByCafeId = async (cafeId) => {
	const response = await CafeTutor.findOne({ where: { cafe_id: cafeId }, attributes: ['tutor_id'] });
	return response;
};

/**
 * @description 강사 인덱스로 강사, 강사 속성, 카페 정보 조회
 * @param {Int} tutorId
 */
export const getTutorDataById = async (tutorId) => {
	const values = { id: tutorId, is_deleted: 'N', is_confirm: 'Y' };
	let response = null;

	const attrSql = [
		'SELECT ',
		'	`tutors`.`id`, ',
		'	`tutors`.`name`, ',
		'	`tutors`.`is_deleted`, ',
		'	`tutors`.`is_confirm`, ',
		'	`tutor_attributes`.`sex`, ',
		'	`tutor_attributes`.`profile`, ',
		'	`tutor_attributes`.`default_profile`, ',
		'	`tutor_attributes`.`message` ',
	].join(' ');

	const sql = [
		'FROM `tutors` ',
		'INNER JOIN `tutor_attributes` ON `tutor_attributes`.`tutor_id` = `tutors`.`id` ',
		'WHERE `tutors`.`id` IS NOT NULL ',
		'AND `tutors`.`id` = :id ',
		'AND `tutors`.`is_deleted` = :is_deleted ',
		'AND `tutors`.`is_confirm` = :is_confirm ',
	].join(' ');

	const tutorData = await sequelize.query(attrSql + sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	if (tutorData && Object.keys(tutorData).length > 0) {
		const cafeId = await getCafeIdByTutorId(tutorData[0].id);
		const cafe = cafeId ? await cafeComponent.getCafeById(cafeId.dataValues.cafe_id) : null;

		response = {
			id: tutorData[0].id,
			name: tutorData[0].name,
			is_deleted: tutorData[0].is_deleted,
			is_confirm: tutorData[0].is_confirm,
			attribute: { sex: tutorData[0].sex, profile: tutorData[0].profile, default_profile: tutorData[0].default_profile, message: tutorData[0].message },
			cafe,
		};
	}

	return response;
};

/**
 * @description 강사 인덱스로 기관 조회
 * @param {Int} tutorId
 */
export const getInstitutesByTutorId = async (tutorId) => {
	const values = {
		tutor_id: tutorId,
		is_deleted: 'N',
		is_confirm: 'Y',
	};
	let response = null;

	const attrSql = [
		'SELECT ',
		'`institutes`.`id`, ',
		'`institutes`.`name_ko`, ',
		'`institutes`.`name_en`, ',
		'`institutes`.`type`, ',
		'`institutes`.`is_deleted`, ',
		'`institutes`.`is_confirm`, ',
		'`institutes`.`created_at`, ',
		'`institutes`.`updated_at` ',
	].join(' ');

	const sql = [
		'FROM `tutor_institutes` ',
		'INNER JOIN `institutes` ON `institutes`.`id` = `tutor_institutes`.`institute_id` ',
		'WHERE `tutor_institutes`.`id` IS NOT NULL ',
		'AND `tutor_institutes`.`tutor_id` = :tutor_id ',
		'AND `institutes`.`is_deleted` = :is_deleted ',
		'AND `institutes`.`is_confirm` = :is_confirm ',
		'ORDER BY `tutor_institutes`.`is_current` ASC, ',
		'`tutor_institutes`.`institute_id` DESC ',
	].join(' ');

	const institutes = await sequelize.query(attrSql + sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	if (institutes && Object.keys(institutes).length > 0) response = institutes;

	return response;
};

/**
 * @description 강사 팔로우 회원 인덱스 조회
 * @param {Int} tutorId
 */
export const getTutorFollowMemberIdsByTutorId = async (tutorId) => {
	let ids = [];
	const sql = [
		'SELECT DISTINCT(`member_follow_tutors`.`member_id`) ',
		'FROM `member_follow_tutors` ',
		'WHERE `member_follow_tutors`.`id` IS NOT NULL ',
		'AND `member_follow_tutors`.`tutor_id` = ' + tutorId + ' ', // eslint-disable-line prefer-template
		'AND `member_follow_tutors`.`is_confirm` = "Y"; ',
	].join(' ');
	const tutorFollowMemberIds = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
	if (tutorFollowMemberIds) ids = tutorFollowMemberIds.map((tutorFollowMemberIds) => tutorFollowMemberIds.member_id);
	return Object.keys(tutorFollowMemberIds).length > 0 ? ids : null;
};
