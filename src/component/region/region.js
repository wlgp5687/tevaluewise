import { Sequelize } from 'sequelize';
import { getModel } from '../../database';
import * as commonComponent from '../common';

const Op = Sequelize.Op;
const Region = getModel('Region');
const Institute = getModel('Institute');
const InstituteRegion = getModel('InstituteRegion');

// Id 가 일치하는 지역 정보 획득
export const getRegionById = async (id) => {
	const response = await Region.findOne({ where: { id, is_deleted: 'N' } });
	return response;
};

// Id 로 regions 테이블의 하위 정보 조회
export const getSubRegionsById = async (id, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	let response = null;

	// 최상위 지역 조회
	if (!id) {
		const sql = { where: { code: { [Op.like]: ['____'] }, is_deleted: 'N' } };
		const total = await Region.count(sql);
		if (total && total > 0) {
			sql.attributes = ['id', 'parent_id', 'code', 'type', 'name'];
			sql.order = [['id', 'ASC']];
			sql.offset = parseInt(offset, 10);
			sql.limit = parseInt(limit, 10);

			const regions = await Region.findAll(sql);
			response = { total, list: regions };
		}

		// 하위 지역 조회
	} else {
		const targetRegion = await getRegionById(id);
		// 일치하는 지역이 있는 경우
		if (targetRegion) {
			const regionCode = targetRegion.dataValues.code;
			const sql = { where: { code: { [Op.like]: [`${regionCode}____`] }, is_deleted: 'N' } };
			const total = await Region.count(sql);

			if (total && total > 0) {
				sql.attributes = ['id', 'parent_id', 'code', 'type', 'name'];
				sql.order = [['id', 'ASC']];
				sql.offset = parseInt(offset, 10);
				sql.limit = parseInt(limit, 10);

				const regions = await Region.findAll(sql);
				response = { total, list: regions };
			}
		}
	}

	// Return
	return response;
};

// Id 로 하위 지역 Ids 조회
export const getSubRegionIdsByRegionId = async (regionId) => {
	let ids = [];
	const tmpRegionData = await getRegionById(regionId);
	const regionData = await Region.findAll({ attributes: ['id'], where: { code: { [Op.like]: `${tmpRegionData.dataValues.code}%` } } });
	ids = regionData.map((regionData) => regionData.id);

	// Return
	return ids;
};

// 기관 인덱스에 연결된 지역 정보 반환
export const getRegionInfoByInstituteId = async (instituteId) => {
	const response = await InstituteRegion.findOne({ attributes: ['region_id'], where: { institute_id: instituteId } });
	return response;
};

// Code 가 일치하는 지역 정보 획득
export const getRegionByCode = async (code) => {
	const response = await Region.findOne({ where: { code, is_deleted: 'N' } });
	return response;
};

/**
 * @description 전체 지역 정보 조회
 * @param {Int} regionId
 */
export const getFullRegionInfoById = async (regionId) => {
	let response = null;
	const inputRegion = await getRegionById(regionId);

	if (inputRegion) {
		const regionDepth = await commonComponent.getLengthByCritertiaNumber(inputRegion.dataValues.code, 4);
		let regionInfo = null;
		let regionFullName = '';
		for (let i = 0; i < regionDepth; i += 1) {
			const regionCode = inputRegion.dataValues.code.substr(0, (regionDepth - i) * 4);
			const tmpRegion = await getRegionByCode(regionCode); // eslint-disable-line no-await-in-loop
			regionFullName = `${tmpRegion.dataValues.name} ${regionFullName}`;
			if (regionInfo) tmpRegion.dataValues.sub_region = regionInfo;
			regionInfo = tmpRegion.dataValues;
		}
		response = { full_name: regionFullName, target_region_id: regionId, region_info: regionInfo };
	}

	// Return
	return response;
};

// 지역 인덱스 존재 여부 조회
export const isExistRegionId = async (regionId) => {
	const existNum = await Region.count({ where: { id: regionId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};
