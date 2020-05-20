import { getModel, sequelize, Op } from '../../database';

import * as filterComponent from '../filter/filter';

const Subject = getModel('Subject');
const Institute = getModel('Institute');
const Tutor = getModel('Tutor');
const Filter = getModel('Filter');
const InstituteSubject = getModel('InstituteSubject');
const SubjectFilter = getModel('SubjectFilter');

// subjectId 와 일치하는 subject 를 반환
export const getSubjectById = async (subjectId) => {
	const subject = await Subject.findOne({ where: { id: subjectId, is_deleted: 'N' }, attributes: ['id', 'name', 'sort_no'] });
	return subject;
};

// 기관 Id 를 통한 과목 목록 조회
export const getSubjectByInstituteId = async (instituteId, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const sql = {
		where: { is_deleted: 'N' },
		include: [{ model: Institute, as: 'institute', where: { id: instituteId, is_confirm: { [Op.in]: ['Y'] } }, attributes: [], through: { attributes: [] } }],
	};

	// Total
	const total = await Subject.count(sql);
	if (total && total > 0) {
		sql.attributes = ['id', 'name', 'comment', 'sort_no', 'is_deleted'];
		sql.order = [
			['sort_no', 'ASC'],
			['id', 'ASC'],
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 과목 정보 조회
		const subject = await Subject.findAll(sql);
		response = { total, list: subject };
	}

	// Return
	return response || null;
};

// 강사 인덱스로 연결된 과목 조회
export const getTutorSubjectsByTutorId = async (tutorId) => {
	const response = await Subject.findAll({
		attributes: ['id', 'name', 'comment', 'sort_no'],
		where: { is_deleted: 'N' },
		include: [{ model: Tutor, as: 'tutor', where: { id: tutorId }, attributes: [], through: { attributes: [] }, require: true }],
	});
	return response;
};

// 강사 인덱스 및 필터 인덱스로 연결된 과목 조회
export const getTutorSubjectsByTutorIdAndFilterId = async (tutorId, filterId) => {
	// 검색 조건
	const values = { tutor_id: tutorId, filter_id: filterId };
	const sql = [
		'SELECT `subjects`.`id`, `subjects`.`name`, `subjects`.`comment`, `subjects`.`sort_no` ',
		'FROM `subjects` ',
		'INNER JOIN `tutor_subjects` ON `tutor_subjects`.`subject_id` = `subjects`.`id` AND `tutor_subjects`.`tutor_id` = :tutor_id ',
		'INNER JOIN `subject_filters` ON `subject_filters`.`subject_id` = `subjects`.`id`  ',
		'AND `subject_filters`.`filter_id` IN ( ',
		'	SELECT `id` ',
		'	FROM `filters` ',
		'	WHERE `code` like ( ',
		'		SELECT CONCAT(`code`, "____") ',
		'		FROM `filters` ',
		'		WHERE `id` = :filter_id ',
		'	) ',
		') ',
		'WHERE `subjects`.`id` IS NOT NULL ',
		'AND `subjects`.`is_deleted` = "N" ',
		'ORDER BY `sort_no` ASC, `id` ASC; ',
	].join(' ');

	const subjectData = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	return Object.keys(subjectData).length > 0 ? subjectData : null;
};

// 기관 인덱스 및 필터 인덱스로 연결된 과목 조회
export const getInstituteSubjectsByInstituteIdAndFilterId = async (instituteId, filterId) => {
	const subjectIds = await filterComponent.getSubjectArrayByFilterId(filterId);
	const response = await Subject.findAll({
		attributes: ['id', 'name', 'comment', 'sort_no'],
		where: { id: { [Op.in]: subjectIds }, is_deleted: 'N' },
		include: [{ model: Institute, as: 'institute', where: { id: instituteId }, attributes: [], through: { attributes: [] }, require: true }],
		order: [
			['sort_no', 'ASC'],
			['id', 'ASC'],
		],
	});
	return response;
};

// 기관 인덱스로 연결된 과목 인덱스 조회
export const getSubjectIdsByInstituteId = async (instituteId) => {
	let response = null;
	// institute와 연결된 id 전체를 조회
	const tmpSubjectData = await InstituteSubject.findAll({ where: { institute_id: instituteId }, attributes: ['subject_id'] });
	if (tmpSubjectData) response = tmpSubjectData.map((tmpSubjectData) => tmpSubjectData.subject_id);

	// Return
	return response || null;
};

// 필터 Id 를 통한 과목 목록 조회
export const getSubjectByFilterId = async (filterId, keyword = null, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	// 검색 조건
	const values = { filter_id: filterId, offset: parseInt(offset, 10), limit: parseInt(limit, 10) };

	// prettier-ignore
	const sql = [
		'FROM `subjects` ',
		'INNER JOIN `subject_filters` ON `subject_filters`.`subject_id` = `subjects`.`id` ',
		'WHERE `subjects`.`id` IS NOT NULL ',
		'AND `subjects`.`is_deleted` = "N" ',
		'AND `subject_filters`.`filter_id` IN ( ',
		'	SELECT `id` ',
		'	FROM `filters` ',
		'	WHERE `code` like ( ',
		'		select CONCAT(`code`, "%") ',
		'		FROM `filters` ',
		'		WHERE `id` = :filter_id ',
		'	) ',
		') ',
		'ORDER BY `subject_filters`.`sort_average` DESC, `subjects`.`sort_no` ASC, `subjects`.`name` ASC, `subjects`.`id` ASC '
	].join(' ');

	const countSql = ['SELECT ', '	COUNT(DISTINCT(`subjects`.`id`)) AS `total` '].join(' ') + sql;

	// Total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const subjectSql =
			// eslint-disable-next-line prefer-template
			[
				'SELECT ',
				'	DISTINCT(`subjects`.`id`), ',
				'	`subjects`.`name`, ',
				'	`subjects`.`comment`, ',
				'	`subjects`.`sort_no`, ',
				'	`subjects`.`is_deleted`, ',
				' `subject_filters`.`sort_average` ',
			].join(' ') +
			sql +
			'LIMIT :offset, :limit; ';

		// 게시물 정보 조회
		const subejctData = await sequelize.query(subjectSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
		if (Object.keys(subejctData).length > 0) response = { total, list: subejctData };
	}

	// Return
	return response || null;
};

// 기관 인덱스와 과목 인덱스들을 통한 과목 목록 조회
export const getSubjectByInstituteIdAndSubjectIds = async (instituteId, subjectIds, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;
	const equalSubjects = [];

	// 기관에 연결된 과목 목록 조회
	const instituteRelationSubjectIds = await getSubjectIdsByInstituteId(instituteId);

	// 기관에 연결된 과목과 전달받은 과목의 공통 인덱스를 조회
	for (let i = 0; i < instituteRelationSubjectIds.length; i += 1) if (subjectIds.includes(parseInt(instituteRelationSubjectIds[i], 10))) equalSubjects.push(instituteRelationSubjectIds[i]);

	if (Object.keys(equalSubjects).length > 0) {
		const sql = { where: { id: { [Op.in]: equalSubjects }, is_deleted: 'N' } };

		// Total
		const total = await Subject.count(sql);

		if (total && total > 0) {
			sql.attributes = ['id', 'name', 'comment', 'sort_no', 'is_deleted'];
			sql.order = [
				['sort_no', 'ASC'],
				['name', 'ASC'],
				['id', 'ASC'],
			];
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);

			// 과목 정보 조회
			const subject = await Subject.findAll(sql);
			if (Object.keys(subject).length > 0) response = { total, list: subject };
		}
	}

	// Return
	return response || null;
};

// SubjectId 존재 여부 조회
export const isExistSubjectId = async (subjectId) => {
	const existNum = await Subject.count({ where: { id: subjectId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};
