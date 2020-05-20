import * as emailService from '../email/email';
import * as customerComponent from '../../component/customer/customer';
import { throwError } from '..';

/**
 * @description 고객센터 문의
 * @param {Array} report
 */
export const doRegisterCustomerService = async (report) => {
	const customerServiceReport = await customerComponent.postCustomerService(report);
	if (report.page.member) await customerComponent.postCustomerServiceMember(customerServiceReport.id, report.page.member);
	if (report.type === 'information') {
		if (report.page.tutor) await customerComponent.postCustomerServiceTutor(customerServiceReport.id, report.page.tutor);
		else if (report.page.institute) await customerComponent.postCustomerServiceInstitute(customerServiceReport.id, report.page.institute);
		else throwError("Invalid 'tutor_id' or 'institute_id' or 'member_id'.", 400);
	}
	if (report.type === 'cafe') await customerComponent.postCustomerServiceTutor(customerServiceReport.id, report.page.tutor);

	// 메일 발송 처리
	let title = '[고객센터]';
	if (report.type === 'information') title = '[정보수정요청]';
	if (report.type === 'cafe') title = '[카페문의]';
	title = `${title}${report.nickname}(${report.name})께서 문의하신 사항입니다.`;
	const body = '';
	const mailRequestRecipient = [{ member_id: null, recipient_address: 'support@starteacher.co.kr', recipient_name: '별별선생', recipient_type: 'R', ncloud_mail_id: null, send_status: 'P' }];
	const parameters = {
		CUSTOMER_MAIL_TITLE: title,
		CUSTOMER_NAME: report.name,
		CUSTOMER_NICKNAME: report.nickname,
		CUSTOMER_EMAIL: report.email,
		CUSTOMER_PHONE: report.phone,
		CUSTOMER_URL: report.url,
		CUSTOMER_TITLE: report.title,
		CUSTOMER_CONTENT: report.contents,
	};

	const mailRequestMember = [];
	if (report.page.member) mailRequestMember.push({ member_id: report.page.member });
	const mailRequestTutor = [];
	if (report.page.tutor) mailRequestTutor.push({ tutor_id: report.page.tutor });

	return customerServiceReport;
};

// 고객센터 문의 인덱스 존재여부 확인
export const isExistCustomerServiceReport = async (customerServiceId) => {
	const response = await customerComponent.isExistCustomerServiceReport(customerServiceId);
	return response;
};
