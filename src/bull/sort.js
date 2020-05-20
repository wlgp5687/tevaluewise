import * as bull from './index';
import { sequelize } from '../database';

import * as log from './logs';
import { throwError } from '../services';

// 정렬순서 전체 업데잍 여부
const sortReset = false;
const countLimit = 100;
const checkDate = 7;

// 목표일자 반환
export const getStartDate = async () => {
	const nowDate = new Date();
	const beforeDate = nowDate.getDate();
	nowDate.setDate(beforeDate - checkDate);
	return `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()} 0:0:0`;
};

// return Offset
export const getOffset = async (page, limit) => {
	const offset = (parseInt(page, 10) - parseInt(1, 10)) * limit;
	return offset < 0 ? 0 : offset;
};

// site 에 해당하는 filter 조회
export const getSiteFilterIds = async () => {
	let ids = [];
	const sql = ['SELECT DISTINCT( `sites`.`filter_id` ) FROM `sites` WHERE `id` IS NOT NULL AND `level` = 2 AND `target` = "site" '].join(' ');
	const siteIds = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
	if (siteIds) ids = siteIds.map((siteIds) => siteIds.filter_id);
	// Return
	return Object.keys(ids).length > 0 ? ids : null;
};

/**
 * @description 강사 정렬 순서 테이블 초기화
 * @param {*} job
 */
const initiateTutorSort = async () => {
	const truncateTutorSortAverageTableSql = ['truncate table `tutor_sort`; '].join(' ');
	await sequelize.query(truncateTutorSortAverageTableSql);

	const tutorCountSql = ['SELECT ', '	COUNT(`tutors`.`id`) AS `total` ', 'FROM `tutors`; '].join(' ');
	const totalTutorCount = await sequelize.query(tutorCountSql, { type: sequelize.QueryTypes.SELECT });

	const total = totalTutorCount ? totalTutorCount[0].total : 0;
	// const total = 10;
	const limit = countLimit;
	const maxPage = Math.ceil(total / limit) + 1;
	for (let i = 0; i < maxPage; i += 1) bull.tutorSortQueue({ tutor_id: null, page: i + 1, limit });
};

/**
 * @description 기관 정렬 순서 테이블 초기화
 * @param {*} job
 */
const initiateInstituteSort = async () => {
	const truncateInstituteSortAverageTableSql = ['truncate table `institute_sort`; '].join(' ');
	await sequelize.query(truncateInstituteSortAverageTableSql);

	const instituteCountSql = ['SELECT ', '	COUNT(`institutes`.`id`) AS `total` ', 'FROM `institutes`; '].join(' ');
	const totalInstituteCount = await sequelize.query(instituteCountSql, { type: sequelize.QueryTypes.SELECT });

	const total = totalInstituteCount ? totalInstituteCount[0].total : 0;
	// const total = 10;
	const limit = countLimit;
	const maxPage = Math.ceil(total / limit) + 1;
	for (let i = 0; i < maxPage; i += 1) bull.instituteSortQueue({ institute_id: null, page: i + 1, limit });
};

/**
 * @description 전달 받은 page 및 limit 에 해당하는 강사의 리뷰 계산을 요청
 * @param {*} page
 * @param {*} limit
 */
export const loopTutorSortQueue = async (page, limit) => {
	const offset = await getOffset(page, limit);
	// eslint-disable-next-line
	const tutorSql = ['SELECT ', '	`tutors`.`id` ', 'FROM `tutors` ', 'ORDER BY `tutors`.`id` ASC ', 'LIMIT ' + offset + ', ' + limit + ';'].join(' ');
	const tutors = await sequelize.query(tutorSql, { type: sequelize.QueryTypes.SELECT });
	for (let i = 0; i < tutors.length; i += 1) bull.tutorSortQueue({ tutorId: tutors[i].id, page: null, limit: null });
};

/**
 * @description 전달 받은 page 및 limir 에 해당하는 기관의 리뷰 계산을 요청
 * @param {*} page
 * @param {*} limit
 */
export const loopInstituteSortQueue = async (page, limit) => {
	const offset = await getOffset(page, limit);
	const instituteSql = ['SELECT ', '	`institutes`.`id` ', 'FROM `institutes` ', 'ORDER BY `institutes`.`id` ASC ', 'LIMIT ' + offset + ', ' + limit + ';'].join(' '); // eslint-disable-line
	const institutes = await sequelize.query(instituteSql, { type: sequelize.QueryTypes.SELECT });
	for (let i = 0; i < institutes.length; i += 1) bull.instituteSortQueue({ instituteId: institutes[i].id, page: null, limit: null });
};

/**
 * @description 특정 기간 이후의 리뷰에서 강사 인덱스를 반환
 * @param {*} date
 */
const getTutorIdsByReviews = async (date) => {
	let ids = [];
	const sql = [
		'SELECT DISTINCT( `tutors`.`tutor_id` ) ',
		'FROM ( ',
		'	SELECT `tutor_reviews`.`tutor_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `tutor_reviews` ON `tutor_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `tutor_change_reviews`.`before_tutor_id` AS `tutor_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `tutor_change_reviews` ON `tutor_change_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `tutor_change_reviews`.`after_tutor_id` AS `tutor_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `tutor_change_reviews` ON `tutor_change_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		') AS `tutors` ',
		'ORDER BY `tutor_id` ASC; ',
	].join(' ');
	const tutorIds = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
	if (tutorIds) ids = tutorIds.map((tutorIds) => tutorIds.tutor_id);
	// Return
	return Object.keys(ids).length > 0 ? ids : null;
};

/**
 * @description 특정 기간 이후의 리뷰에서 기관 인덱스를 반환
 * @param {*} date
 */
const getInstituteIdsByReviews = async (date) => {
	let ids = [];
	const sql = [
		'SELECT DISTINCT( `institutes`.`institute_id` ) ',
		'FROM ( ',
		'	SELECT `tutor_reviews`.`institute_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `tutor_reviews` ON `tutor_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `tutor_change_reviews`.`before_institute_id` AS `institute_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `tutor_change_reviews` ON `tutor_change_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `tutor_change_reviews`.`after_institute_id` AS `institute_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `tutor_change_reviews` ON `tutor_change_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `institute_reviews`.`institute_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `institute_reviews` ON `institute_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `institute_change_reviews`.`before_institute_id` AS `institute_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `institute_change_reviews` ON `institute_change_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		'	UNION ',
		'	SELECT `institute_change_reviews`.`after_institute_id` AS `institute_id` ',
		'	FROM `reviews` ',
		'	INNER JOIN `institute_change_reviews` ON `institute_change_reviews`.`review_id` = `reviews`.`id` ',
		'	WHERE `reviews`.`created_at` >= "' + date + '" ', // eslint-disable-line
		'	OR `reviews`.`updated_at` >= "' + date + '" ', // eslint-disable-line
		') AS `institutes` ',
		'ORDER BY `institute_id` ASC; ',
	].join(' ');
	const instituteIds = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
	if (instituteIds) ids = instituteIds.map((instituteIds) => instituteIds.institute_id);
	// Return
	return Object.keys(ids).length > 0 ? ids : null;
};

// 전달받은 리뷰타입 & 강사 인덱스 & 필터 인덱스 에 따른 리뷰수 계산
export const calculateTutorSort = async (reviewType, tutorIds, filterId) => {
	if (tutorIds) {
		for (let i = 0; i < tutorIds.length; i += 1) {
			const insertTutorSortSql = [
				'INSERT INTO `tutor_sort` ',
				' ( `tutor_id`, `filter_id`, `total_review_count`, `tutor_review_count`, `tutor_change_review_count`, `institute_review_count`, `institute_change_review_count`, `sort_average`, `is_major` ) ',
				' VALUES ',
				' ( ' + tutorIds[i] + ', ' + filterId + ', ' + '0, 0, 0, 0, 0, 0, "N" ' + ' ) ', // eslint-disable-line
				' ON DUPLICATE KEY UPDATE `tutor_id` = ' + tutorIds[i] + ';', // eslint-disable-line
			].join(' ');
			await sequelize.query(insertTutorSortSql, { type: sequelize.QueryTypes.INSERT }); // eslint-disable-line no-await-in-loop
		}
	}

	let sql = null;
	switch (reviewType) {
		case 'tutor':
			sql = [
				'UPDATE `tutor_sort` SET `tutor_review_count` = ( ',
				'	( ',
				'		SELECT COUNT(`tutor_reviews`.`review_id`) ',
				'		FROM `tutor_reviews` ',
				'		WHERE `tutor_reviews`.`tutor_id` = `tutor_sort`.`tutor_id` ',
				'		AND `tutor_reviews`.`filter_id` IN ( ',
				'			SELECT `filters`.`id` ',
				'			FROM `filters` ',
				'			WHERE `filters`.`code` LIKE ( ',
				'				SELECT concat(`sub_filters`.`code`, "%") ',
				'				FROM `filters` AS `sub_filters` ',
				'				WHERE `sub_filters`.`id` = `tutor_sort`.`filter_id` ',
				'			) ',
				'		) ',
				'	) ',
				') ',
				'WHERE `tutor_sort`.`id` > 0 ',
				tutorIds ? 'AND `tutor_id` IN ( ' + tutorIds + ' )' : ' ', // eslint-disable-line
				'AND `tutor_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		case 'tutor_change':
			sql = [
				'UPDATE `tutor_sort` SET `tutor_change_review_count` = ( ',
				'	( ',
				'		SELECT COUNT(DISTINCT(`tutor_change_reviews`.`review_id`)) ',
				'		FROM `tutor_change_reviews` ',
				'		WHERE ',
				'		( ',
				'			`tutor_change_reviews`.`before_tutor_id` = `tutor_sort`.`tutor_id` ',
				'			AND ',
				'			`tutor_change_reviews`.`before_filter_id` IN ( ',
				'				SELECT `filters`.`id` ',
				'				FROM `filters` ',
				'				WHERE `filters`.`code` LIKE ( ',
				'					SELECT CONCAT(`sub_filters`.`code`, "%") ',
				'					FROM `filters` AS `sub_filters` ',
				'					WHERE `sub_filters`.`id` = `tutor_sort`.`filter_id` ',
				'				) ',
				'			) ',
				'		) ',
				'		OR ',
				'		( ',
				'			`tutor_change_reviews`.`after_tutor_id` = `tutor_sort`.`tutor_id` ',
				'			AND ',
				'			`tutor_change_reviews`.`after_filter_id` IN ( ',
				'				SELECT `filters`.`id` ',
				'				FROM `filters` ',
				'				WHERE `filters`.`code` LIKE ( ',
				'					SELECT CONCAT(`sub_filters`.`code`, "%") ',
				'					FROM `filters` AS `sub_filters` ',
				'					WHERE `sub_filters`.`id` = `tutor_sort`.`filter_id` ',
				'				) ',
				'			) ',
				'		) ',
				'	) ',
				') ',
				'WHERE `tutor_sort`.`id` > 0 ',
				tutorIds ? 'AND `tutor_sort`.`tutor_id` IN ( ' + tutorIds + ' ) ' : ' ', // eslint-disable-line
				'AND `tutor_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		case 'institute':
			sql = [
				'UPDATE `tutor_sort` SET `institute_review_count` = 0 ',
				'WHERE `tutor_sort`.`id` > 0 ',
				tutorIds ? 'AND `tutor_id` IN ( ' + tutorIds + ' )' : ' ', // eslint-disable-line
				'AND `tutor_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		case 'institute_change':
			sql = [
				'UPDATE `tutor_sort` SET `institute_change_review_count` = 0 ',
				'WHERE `tutor_sort`.`id` > 0 ',
				tutorIds ? 'AND `tutor_sort`.`tutor_id` IN ( ' + tutorIds + ' ) ' : ' ', // eslint-disable-line
				'AND `tutor_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		default:
			throwError("Invalid 'review_type'. ", 400);
			break;
	}
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
	return null;
};

// 전달받은 리뷰타입 & 기관 인덱스 & 필터 인덱스 에 따른 리뷰수 계산
export const calculateInstituteSort = async (reviewType, instituteIds, filterId) => {
	if (instituteIds) {
		for (let i = 0; i < instituteIds.length; i += 1) {
			const insertInstituteSortSql = [
				'INSERT INTO `institute_sort` ',
				' ( `institute_id`, `filter_id`, `total_review_count`, `tutor_review_count`, `tutor_change_review_count`, `institute_review_count`, `institute_change_review_count`, `sort_average`, `is_major` ) ',
				' VALUES ',
				' ( ' + instituteIds[i] + ', ' + filterId + ', ' + '0, 0, 0, 0, 0, 0, "N" ' + ' ) ', // eslint-disable-line
				' ON DUPLICATE KEY UPDATE `institute_id` = ' + instituteIds[i] + ';', // eslint-disable-line
			].join(' ');
			await sequelize.query(insertInstituteSortSql, { type: sequelize.QueryTypes.INSERT }); // eslint-disable-line no-await-in-loop
		}
	}

	let sql = null;
	switch (reviewType) {
		case 'tutor':
			sql = [
				'UPDATE `institute_sort` SET `tutor_review_count` = ( ',
				'	( ',
				'		SELECT COUNT(`tutor_reviews`.`review_id`) ',
				'		FROM `tutor_reviews` ',
				'		WHERE `tutor_reviews`.`institute_id` = `institute_sort`.`institute_id` ',
				'		AND `tutor_reviews`.`filter_id` IN ( ',
				'			SELECT `filters`.`id` ',
				'			FROM `filters` ',
				'			WHERE `filters`.`code` LIKE ( ',
				'				SELECT concat(`sub_filters`.`code`, "%") ',
				'				FROM `filters` AS `sub_filters` ',
				'				WHERE `sub_filters`.`id` = `institute_sort`.`filter_id` ',
				'			) ',
				'		) ',
				'	) ',
				') ',
				'WHERE `institute_sort`.`id` > 0 ',
				instituteIds ? 'AND `institute_id` IN ( ' + instituteIds + ' )' : ' ', // eslint-disable-line
				'AND `institute_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		case 'tutor_change':
			sql = [
				'UPDATE `institute_sort` SET `tutor_change_review_count` = ( ',
				'	( ',
				'		SELECT COUNT(DISTINCT(`tutor_change_reviews`.`review_id`)) ',
				'		FROM `tutor_change_reviews` ',
				'		WHERE ',
				'		( ',
				'			`tutor_change_reviews`.`before_institute_id` = `institute_sort`.`institute_id` ',
				'			AND ',
				'			`tutor_change_reviews`.`before_filter_id` IN ( ',
				'				SELECT `filters`.`id` ',
				'				FROM `filters` ',
				'				WHERE `filters`.`code` LIKE ( ',
				'					SELECT CONCAT(`sub_filters`.`code`, "%") ',
				'					FROM `filters` AS `sub_filters` ',
				'					WHERE `sub_filters`.`id` = `institute_sort`.`filter_id` ',
				'				) ',
				'			) ',
				'		) ',
				'		OR ',
				'		( ',
				'			`tutor_change_reviews`.`after_institute_id` = `institute_sort`.`institute_id` ',
				'			AND ',
				'			`tutor_change_reviews`.`after_filter_id` IN ( ',
				'				SELECT `filters`.`id` ',
				'				FROM `filters` ',
				'				WHERE `filters`.`code` LIKE ( ',
				'					SELECT CONCAT(`sub_filters`.`code`, "%") ',
				'					FROM `filters` AS `sub_filters` ',
				'					WHERE `sub_filters`.`id` = `institute_sort`.`filter_id` ',
				'				) ',
				'			) ',
				'		) ',
				'	) ',
				') ',
				'WHERE `institute_sort`.`id` > 0 ',
				instituteIds ? 'AND `institute_sort`.`institute_id` IN ( ' + instituteIds + ' ) ' : ' ', // eslint-disable-line
				'AND `institute_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		case 'institute':
			sql = [
				'UPDATE `institute_sort` SET `institute_review_count` = ( ',
				'	( ',
				'		SELECT COUNT(`institute_reviews`.`review_id`) ',
				'		FROM `institute_reviews` ',
				'		WHERE `institute_reviews`.`institute_id` = `institute_sort`.`institute_id` ',
				'		AND `institute_reviews`.`filter_id` IN ( ',
				'			SELECT `filters`.`id` ',
				'			FROM `filters` ',
				'			WHERE `filters`.`code` LIKE ( ',
				'				SELECT concat(`sub_filters`.`code`, "%") ',
				'				FROM `filters` AS `sub_filters` ',
				'				WHERE `sub_filters`.`id` = `institute_sort`.`filter_id` ',
				'			) ',
				'		) ',
				'	) ',
				') ',
				'WHERE `institute_sort`.`id` > 0 ',
				instituteIds ? 'AND `institute_id` IN ( ' + instituteIds + ' )' : ' ', // eslint-disable-line
				'AND `institute_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		case 'institute_change':
			sql = [
				'UPDATE `institute_sort` SET `institute_change_review_count` = ( ',
				'	( ',
				'		SELECT COUNT(DISTINCT(`institute_change_reviews`.`review_id`)) ',
				'		FROM `institute_change_reviews` ',
				'		WHERE ',
				'		( ',
				'			`institute_change_reviews`.`before_institute_id` = `institute_sort`.`institute_id` ',
				'			AND ',
				'			`institute_change_reviews`.`before_filter_id` IN ( ',
				'				SELECT `filters`.`id` ',
				'				FROM `filters` ',
				'				WHERE `filters`.`code` LIKE ( ',
				'					SELECT CONCAT(`sub_filters`.`code`, "%") ',
				'					FROM `filters` AS `sub_filters` ',
				'					WHERE `sub_filters`.`id` = `institute_sort`.`filter_id` ',
				'				) ',
				'			) ',
				'		) ',
				'		OR ',
				'		( ',
				'			`institute_change_reviews`.`after_institute_id` = `institute_sort`.`institute_id` ',
				'			AND ',
				'			`institute_change_reviews`.`after_filter_id` IN ( ',
				'				SELECT `filters`.`id` ',
				'				FROM `filters` ',
				'				WHERE `filters`.`code` LIKE ( ',
				'					SELECT CONCAT(`sub_filters`.`code`, "%") ',
				'					FROM `filters` AS `sub_filters` ',
				'					WHERE `sub_filters`.`id` = `institute_sort`.`filter_id` ',
				'				) ',
				'			) ',
				'		) ',
				'	) ',
				') ',
				'WHERE `institute_sort`.`id` > 0 ',
				instituteIds ? 'AND `institute_sort`.`institute_id` IN ( ' + instituteIds + ' ) ' : ' ', // eslint-disable-line
				'AND `institute_sort`.`filter_id` = ' + filterId + '; ', // eslint-disable-line
			].join(' ');
			break;
		default:
			throwError("Invalid 'review_type'. ", 400);
			break;
	}
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
	return null;
};

// 강사 총 리뷰수 업데이트 처리
export const updateTutorSort = async () => {
	const sql = ['UPDATE `tutor_sort` SET `tutor_sort`.`total_review_count` = ( `tutor_sort`.`tutor_review_count` + `tutor_sort`.`tutor_change_review_count` ) WHERE `id` > 0; '].join(' ');
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
};

// 기관 총 리뷰수 업데이트 처리
export const updateInstituteSort = async () => {
	const sql = [
		'UPDATE `institute_sort` ',
		'SET `total_review_count` = ( ',
		'	`institute_sort`.`tutor_review_count` ',
		'	+ ',
		'	`institute_sort`.`tutor_change_review_count` ',
		'	+ ',
		'	`institute_sort`.`institute_review_count` ',
		'	+ ',
		'	`institute_sort`.`institute_change_review_count` ',
		') WHERE `institute_sort`.`id` > 0; ',
	].join(' ');
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
};
