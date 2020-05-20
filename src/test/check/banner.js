import * as common from '../component/common';

// 배너 검사
export const checkBanner = (banner) => {
	if (banner.title) expect(typeof banner.title).toEqual('string');
	if (banner.banner_page) expect(typeof banner.banner_page).toEqual('string');
	if (banner.position) expect(typeof banner.position).toEqual('string');
	if (banner.device) expect(typeof banner.device).toEqual('string');
	if (banner.file_url) expect(typeof banner.file_url).toEqual('string');
	if (banner.s3_key) expect(typeof banner.s3_key).toEqual('string');
	if (banner.is_deleted) expect(common.agreementCheck(banner.is_deleted)).toEqual(true);
	if (banner.is_blank) expect(common.agreementCheck(banner.is_blank)).toEqual(true);
	if (banner.id) expect(typeof banner.id).toEqual('number');
	if (banner.target) expect(typeof banner.target).toEqual('string');
	if (banner.url) expect(typeof banner.url).toEqual('string');
	if (banner.alt_text) expect(typeof banner.alt_text).toEqual('string');
	if (banner.sort_no && banner.sort_no != 0) expect(typeof banner.sort_no).toEqual('number');

	return null;
};
