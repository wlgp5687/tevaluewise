import { sequelize } from '../../database';
import { throwError } from '..';

import * as bannerComponent from '../../component/banner/banner';

// 배너 아이템 조회
export const getBannerItems = async (filterId, pageCode, positionCode) => {
	const response = await bannerComponent.getBannerItems(filterId, pageCode, positionCode);
	return response;
};

// 배너 코드 List 조회
export const getBannerCodeList = async (offset = 0, limit = 10) => {
	const response = await bannerComponent.getBannerCodeList(offset, limit);
	return response;
};

// 배너 등록
export const setBannerItems = async (filterId, pageCode, positionCode, addBannerItems) => {
	let response = null;
	await sequelize.transaction(async (t) => {
		await bannerComponent.deleteBannerItems(filterId, pageCode, positionCode, t);
		await bannerComponent.addBannerItems(addBannerItems, false, t);
		response = await bannerComponent.getBannerItems(filterId, pageCode, positionCode);
	});

	return response;
};

// 배너 인덱스 존재 여부 확인
export const isExistBannerId = async (bannerId) => {
	const response = await bannerComponent.isExistBannerId(bannerId);
	return response;
};

// 배너와 강사 연결 인덱스 존재 여부 확인
export const isExistBannerTutorId = async (bannerTutorId) => {
	const response = await bannerComponent.isExistBannerTutorId(bannerTutorId);
	return response;
};

// 배너와 기관 연결 인덱스 존재 여부 확인
export const isExistBannerInstituteId = async (bannerInstituteId) => {
	const response = await bannerComponent.isExistBannerInstituteId(bannerInstituteId);
	return response;
};

// 배너와 필터 연결 인덱스 존재 여부 확인
export const isExistBannerFilterId = async (bannerFilterId) => {
	const response = await bannerComponent.isExistBannerFilterId(bannerFilterId);
	return response;
};

// 배너 URL 변경
export const convertBannerUrl = (url, filterId) => {
	let response = null;
	let sitePath = null;

	switch (filterId) {
		case 2:
		case '2':
			sitePath = 'testenglish';
			break;
		case 7:
		case '7':
			sitePath = 'abroad';
			break;
		case 16:
		case '16':
			sitePath = 'speaking';
			break;
		case 20:
		case '20':
			sitePath = 'english';
			break;
		case 313:
		case '313':
			sitePath = 'gong3';
			break;
		case 317:
		case '317':
			sitePath = 'gong1';
			break;
		case 353:
		case '353':
			sitePath = 'gong2';
			break;
		case 449:
		case '449':
			sitePath = 'police';
			break;
		case 462:
		case '462':
			sitePath = 'fire';
			break;
		case 475:
		case '475':
			sitePath = 'gosi';
			break;
		case 617:
		case '617':
			sitePath = 'professor';
			break;
		case 4403:
		case '4403':
			sitePath = 'kindergarten';
			break;
		case 289:
		case '289':
			sitePath = 'teacher1';
			break;
		case 294:
		case '294':
			sitePath = 'teacher2';
			break;
		case 153:
		case '153':
			sitePath = 'cpa';
			break;
		case 163:
		case '163':
			sitePath = 'estate';
			break;
		case 170:
		case '170':
			sitePath = 'tax';
			break;
		case 184:
		case '184':
			sitePath = 'labor';
			break;
		case 195:
		case '195':
			sitePath = 'legal';
			break;
		case 210:
		case '210':
			sitePath = 'appraise';
			break;
		case 218:
		case '218':
			sitePath = 'patent';
			break;
		case 244:
		case '244':
			sitePath = 'insurance';
			break;
		case 254:
		case '254':
			sitePath = 'underwrite';
			break;
		case 266:
		case '266':
			sitePath = 'customs';
			break;
		case 274:
		case '274':
			sitePath = 'certificate';
			break;
		case 4402:
		case '4402':
			sitePath = 'law';
			break;
		case 132:
		case '132':
			sitePath = 'grad';
			break;
		case 137:
		case '137':
			sitePath = 'exchange';
			break;
		case 80:
		case '80':
			sitePath = 'chinese';
			break;
		case 85:
		case '85':
			sitePath = 'japanese';
			break;
		case 92:
		case '92':
			sitePath = 'language';
			break;
		case 145:
		case '145':
			sitePath = 'job';
			break;
		case 25:
		case '25':
			sitePath = 'high';
			break;
		case 53:
		case '53':
			sitePath = 'middle';
			break;
		case 66:
		case '66':
			sitePath = 'elementary';
			break;
		default:
			throwError("Invalid Site 'filter_id'.", 400);
			break;
	}
	response = url.replace('!@#', sitePath);
	return response;
};

// 배너 조회
export const getBanners = async (bannerData) => {
	let pcBanners = null;
	let mobileBanners = null;

	const bannerPage = bannerData.banner_page;
	const { position } = bannerData;
	const { target } = bannerData;
	const filterId = bannerData.filter_id ? bannerData.filter_id : null;
	const tutorId = bannerData.tutor_id ? bannerData.tutor_id : null;
	const instituteId = bannerData.institute_id ? bannerData.institute_id : null;

	if (tutorId || instituteId) {
		if (tutorId && instituteId) throwError('Invalid value. tutor_id and institute_id is not coexistence.', 400);
		if (tutorId) {
			pcBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'pc', tutor_id: tutorId });
			mobileBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'mobile', tutor_id: tutorId });
		} else {
			pcBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'pc', institute_id: instituteId });
			mobileBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'mobile', tutor_id: tutorId });
		}
	}

	if (pcBanners == null) pcBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'pc', filter_id: filterId });
	if (mobileBanners == null) mobileBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'mobile', filter_id: filterId });

	if (pcBanners == null && target) pcBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'pc' });
	if (mobileBanners == null && target) mobileBanners = await bannerComponent.getBanners({ banner_page: bannerPage, position, target, device: 'mobile' });

	if (pcBanners != null)
		if (Object.keys(pcBanners).length > 0) for (let i = 0; i < pcBanners.length; i += 1) if (pcBanners[i].url) pcBanners[i].url = await convertBannerUrl(pcBanners[i].url, filterId);
	if (mobileBanners != null)
		if (Object.keys(mobileBanners).length > 0)
			for (let i = 0; i < mobileBanners.length; i += 1) if (mobileBanners[i].url) mobileBanners[i].url = await convertBannerUrl(mobileBanners[i].url, filterId);

	return { pc: pcBanners, mobile: mobileBanners };
};
