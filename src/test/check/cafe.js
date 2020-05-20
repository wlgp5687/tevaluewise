import * as common from '../component/common';

// 카페 체크
export const checkCafe = (cafe) => {
	if (cafe.id) expect(typeof cafe.id).toEqual('number');
	if (cafe.type) expect(common.cafeTypeCheck(cafe.type)).toEqual(true);
	if (cafe.is_deleted) expect(common.agreementCheck(cafe.is_deleted)).toEqual(true);

	return null;
};

// 카페 영상 체크
export const checkCafeVideo = (cafeVideo) => {
	if (cafeVideo.id) expect(typeof cafeVideo.id).toEqual('number');
	if (cafeVideo.cafe_id) expect(typeof cafeVideo.cafe_id).toEqual('number');
	if (cafeVideo.title) expect(typeof cafeVideo.title).toEqual('string');
	if (cafeVideo.video_url) expect(typeof cafeVideo.video_url).toEqual('string');
	if (cafeVideo.is_default) expect(common.agreementCheck(cafeVideo.is_default)).toEqual(true);
	if (cafeVideo.is_deleted) expect(common.agreementCheck(cafeVideo.is_deleted)).toEqual(true);
	if (cafeVideo.sort_no) expect(typeof cafeVideo.sort_no).toEqual('number');

	return null;
};
