import { getModel, sequelize } from '../../database';
import { Sequelize } from 'sequelize';

const Op = Sequelize.Op;
const Banner = getModel('Banner');
const TutorBanner = getModel('TutorBanner');
const InstituteBanner = getModel('InstituteBanner');
const FilterBanner = getModel('FilterBanner');

export const getBannerItems = async (filterId, pageCode, positionCode) => {
	let response = null;

	const bannerList = await Banner.findAll({
		attributes: ['banner_name', 'filter_id', 'page_code', 'position_code', 'image_path', 's3_key', 'sort_no'],
		where: { is_deleted: 'N', filter_id: filterId, page_code: pageCode, position_code: positionCode },
	});
	response = { filter_id: filterId, page_code: pageCode, position_code: positionCode, banner_items: bannerList };
	// Return
	return response || null;
};

export const getBannerCodeList = async (offset = 0, limitParam = 5) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	let response = null;

	const sql = {
		where: { is_deleted: 'N' },
		group: ['filter_id', 'page_code', 'position_code'],
		order: [
			['filter_id', 'ASC'],
			['page_code', 'ASC'],
			['position_code', 'ASC'],
		],
	};

	const total = await Banner.count(sql);
	if (total && total > 0) {
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
	}

	const bannerCodeList = await Banner.findAll(sql);

	response = { total, banner_code_list: bannerCodeList };

	return response || null;
};

export const deleteBannerItems = async (filterId, pageCode, positionCode, t) => {
	const response = await Banner.update({ is_deleted: 'Y' }, { where: { filter_id: filterId, page_code: pageCode, position_code: positionCode } }, { transaction: t });
	return response;
};

export const addBannerItems = async (addBannerItems, isGetId = false, t) => {
	const response = await Banner.bulkCreate(addBannerItems, { transaction: t });

	return isGetId ? response.dataValues.id : response;
};

// 위는 삭제
// BannerId 존재 여부 조회
export const isExistBannerId = async (bannerId) => ((await Banner.count({ where: { id: bannerId } })) > 0 ? true : false);

// 배너와 강사 연결 인덱스 존재 여부 확인
export const isExistBannerTutorId = async (bannerTutorId) => ((await TutorBanner.count({ where: { id: bannerTutorId } })) > 0 ? true : false);

// 배너와 기관 연결 인덱스 존재 여부 확인
export const isExistBannerInstituteId = async (bannerInstituteId) => ((await InstituteBanner.count({ where: { id: bannerInstituteId } })) > 0 ? true : false);

// 배너와 필터 연결 인덱스 존재 여부 확인
export const isExistBannerFilterId = async (bannerFilterId) => ((await FilterBanner.count({ where: { id: bannerFilterId } })) > 0 ? true : false);

// 배너 조회
export const getBanners = async (searchFields) => {
	let response = null;

	// 검색 조건
	const values = {
		banner_page: searchFields.banner_page ? searchFields.banner_page : null,
		position: searchFields.position ? searchFields.position : null,
		target: searchFields.target ? searchFields.target : null,
		device: searchFields.device ? searchFields.device : null,
		tutor_id: searchFields.tutor_id ? searchFields.tutor_id : null,
		institute_id: searchFields.institute_id ? searchFields.institute_id : null,
		filter_id: searchFields.filter_id ? searchFields.filter_id : null,
	};

	// prettier-ignore
	const sql = [
		'FROM `banners` ',
		values.filter_id ? 'INNER JOIN `filter_banners` ON `filter_banners`.`banner_id` = `banners`.`id` ' : ' ',
		values.tutor_id ? 'INNER JOIN `tutor_banners` ON `tutor_banners`.`banner_id` = `banners`.`id` ' : ' ',
		values.institute_id ? 'INNER JOIN `institute_banners` ON `institute_banners`.`banner_id` = `banners`.`id` ' : ' ',
		'WHERE `banners`.`id` IS NOT NULL ',
		values.banner_page ? 'AND `banners`.`banner_page` = :banner_page ' : ' ',
		values.position ? 'AND `banners`.`position` = :position ' : ' ',
		values.target ? 'AND `banners`.`target` = :target ' : ' ',
		values.device ? 'AND `banners`.`device` = :device ' : ' ',
		'AND `is_deleted` = "N" ',
		values.filter_id ? 'AND `filter_banners`.`filter_id` = :filter_id ' : ' ',
		values.tutor_id ? 'AND `tutor_banners`.`tutor_id` = :tutor_id ' : ' ',
		values.institute_id ? 'AND `institute_banners`.`institute_id` = :institute_id ' : ' ',
		!values.filter_id && !values.tutor_id && !values.institute_id ?
		'AND `banners`.`id` NOT IN ( SELECT `except_banner`.`banner_id` FROM ( SELECT `banner_id` FROM `filter_banners` UNION SELECT `banner_id` FROM `tutor_banners` UNION SELECT `banner_id` FROM `institute_banners` ) AS `except_banner` ) ' : ' ',
		'ORDER BY `banners`.`sort_no` ASC, `banners`.`id` ASC; ',
	].join(' ');

	const countSql = ['SELECT ', '	COUNT(`banners`.`id`) AS `total` '].join(' ') + sql;

	// Total
	let total = await sequelize.query(countSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
	total = Object.keys(total).length > 0 ? total[0].total : null;

	if (total && total > 0) {
		const bannerSql = ['SELECT `banners`.`*` '].join(' ') + sql;
		// 배너 정보 조회
		const bannerData = await sequelize.query(bannerSql, { type: sequelize.QueryTypes.SELECT, replacements: values });
		if (Object.keys(bannerData).length > 0) response = bannerData;
	}
	return response;
};
