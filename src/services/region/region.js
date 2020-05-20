import * as regionComponent from '../../component/region/region';

// 하위 지역 조회
export const getSubRegions = async (id, offset = 1, limit = 10) => {
	const response = await regionComponent.getSubRegionsById(id, offset, limit);
	return response;
};

// 지역 조회
export const getRegionById = async (id) => {
	const response = await regionComponent.getRegionById(id);
	return response;
};

export const getFullRegionInfoById = async (id) => {
	const response = await regionComponent.getFullRegionInfoById(id);
	return response;
};

// RegionId 존재 여부 조회
export const isExistRegionId = async (id) => {
	const response = await regionComponent.isExistRegionId(id);
	return response;
};
