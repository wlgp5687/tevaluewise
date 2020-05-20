import * as siteComponent from '../../component/site/site';

/**
 * @description 필터 인덱스와 레벨로 사이트 조회
 * @param {Int} filterId
 * @param {Int} level
 */
export const getSiteByFilterIdAndLevel = async (filterId, level) => {
	const response = await siteComponent.getSiteByFilterIdAndLevel(filterId, level);
	return response;
};

/**
 * @description site Level에 해당하는  필터 인덱스에 해당하는 사이트
 * @param {Int} filterId
 */
export const isExistSiteFilter = async (filterId) => {
	const response = await siteComponent.isExistSiteFilter(filterId);
	return response;
};

/**
 * @description 사이트 설정 인덱스 존재 여부 확인
 * @param {Int} siteSettingId
 */
export const isExistSiteSettingId = async (siteSettingId) => {
	const response = await siteComponent.isExistSiteSettingId(siteSettingId);
	return response;
};

/**
 * @description 사이트 아이피 검수 인덱스 존재 여부
 * @param {Int} inspectionIpAddressId
 */
export const isExistInspectionIpAddressId = async (inspectionIpAddressId) => {
	const response = await siteComponent.isExistInspectionIpAddressId(inspectionIpAddressId);
	return response;
};

/**
 * @description 사이트 아이피 검수 아이피 존재 여부
 * @param {String} inspectionIpAddress
 */
export const isExistInspectionIpAddress = async (inspectionIpAddress) => {
	const response = await siteComponent.isExistInspectionIpAddress(inspectionIpAddress);
	return response;
};
