import { getModel, sequelize, Op } from '../../database';

const Site = getModel('Site');
const SiteSetting = getModel('SiteSetting');
const InspectionIpAddress = getModel('InspectionIpAddress');

/** @description 필터인덱스와 레벨로 사이트 조회 */
export const getSiteByFilterIdAndLevel = async (filterId, level) => {
	const response = await Site.findOne({ where: { filter_id: filterId, level } });
	return response;
};

/** @description 타겟과 레벨로 사이트 인덱스 조회 */
export const getSitesfilterIdsByTargetAndLevel = async (target, level) => {
	let response = null;
	const sites = await Site.findAll({ where: { target, level } });
	if (sites) response = sites.map((sites) => sites.filter_id);
	// Return
	return response;
};

/** @description filterId 로 site level 에 해당하는 사이트 여부 조회 */
export const isExistSiteFilter = async (filterId) => {
	const existNum = await Site.count({ where: { filter_id: filterId, level: 2 } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

/**
 * @description 사이트 설정 인덱스 존재 여부 확인
 * @param {Int} siteSettingId
 */
export const isExistSiteSettingId = async (siteSettingId) => {
	const existNum = await SiteSetting.count({ where: { id: siteSettingId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

/**
 * @description 사이트 아이피 검수 인덱스 존재 여부
 * @param {Int} inspectionIpAddressId
 */
export const isExistInspectionIpAddressId = async (inspectionIpAddressId) => {
	const existNum = await InspectionIpAddress.count({ where: { id: inspectionIpAddressId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

/**
 * @description 사이트 아이피 검수 아이피 존재 여부
 * @param {String} inspectionIpAddress
 */
export const isExistInspectionIpAddress = async (inspectionIpAddress) => {
	const existNum = await InspectionIpAddress.count({ where: { ip_address: inspectionIpAddress } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};
