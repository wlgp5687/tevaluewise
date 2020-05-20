import * as common from '../component/common';
import { postPostFileLog } from '../../component/board/board';

export const checkGetFilter = (filter) => {
	expect(typeof filter.id).toEqual('number');
	expect(typeof filter.code).toEqual('string');
	expect(typeof filter.name).toEqual('string');

	return null;
};

export const checkFilter = (filter) => {
	if (filter.id) expect(typeof filter.id).toEqual('number');
	if (filter.code) expect(typeof filter.code).toEqual('string');
	if (filter.name) expect(typeof filter.name).toEqual('string');
	if (filter.sort_no) expect(typeof filter.sort_no).toEqual('number');
	if (filter.is_deleted) expect(common.agreementCheck(filter.is_deleted)).toEqual(true);

	return null;
};

// post filter 검사
export const checkPostFilter = (postFilter) => {
	if (postFilter.id) expect(typeof postFilter.id).toEqual('number');
	if (postFilter.post_id) expect(typeof postFilter.post_id).toEqual('number');
	if (postFilter.board_config_id) expect(typeof postFilter.board_config_id).toEqual('number');
	if (postFilter.lv05_id) expect(typeof postFilter.lv05_id).toEqual('number');
	if (postFilter.lv1_id) expect(typeof postFilter.lv1_id).toEqual('number');
	if (postFilter.institute_id) expect(typeof postFilter.institute_id).toEqual('number');
	if (postFilter.answer_stauts) expect(common.answerStatusCheck(postFilter.answer_stauts)).toEqual(true);
	if (postFilter.faq_category) expect(common.faqCategoryCheck(postFilter.faq_category)).toEqual(true);
	if (postFilter.info_category) expect(common.infoCategoryCheck(postFilter.info_category)).toEqual(true);
	if (postFilter.lecture_type) expect(common.lectureTypeCheck(postFilter.lecture_type)).toEqual(true);
	if (postFilter.sex) expect(common.sexCheck(postFilter.sex)).toEqual(true);
	if (postFilter.transfer_filter_id) expect(typeof postFilter.transfer_filter_id).toEqual('number');
	if (postFilter.appointment_subtype) expect(common.appointmentSubTypeCheck(postFilter.appointment_subtype)).toEqual(true);
	if (postFilter.appointment_local_region) expect(common.appointmentLocalRegion(postFilter.appointment_local_region)).toEqual(true);
	if (postFilter.subject_filter_id) expect(typeof postFilter.subject_filter_id).toEqual('number');
	if (postFilter.gong_local_region) expect(common.gongLocalRegion(postFilter.gong_local_region)).toEqual(true);
	if (postFilter.gong_speciality_part_filter_id) expect(typeof postFilter.gong_speciality_part_filter_id).toEqual('number');
	if (postFilter.gong_grade_filter_id) expect(typeof postFilter.gong_grade_filter_id).toEqual('number');
	if (postFilter.gong_serial_filter_id) expect(typeof postFilter.gong_serial_filter_id).toEqual('number');
	if (postFilter.sub_filter_id) expect(typeof postFilter.sub_filter_id).toEqual('number');
	if (postFilter.certificate_filter_id) expect(typeof postFilter.certificate_filter_id).toEqual('number');

	return null;
};
