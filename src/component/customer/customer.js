import { getModel, sequelize, Op } from '../../database';

const CustomerServiceReport = getModel('CustomerServiceReport');
const CustomerServiceReportTutor = getModel('CustomerServiceReportTutor');
const CustomerServiceReportInstitute = getModel('CustomerServiceReportInstitute');
const CustomerServiceReportMember = getModel('CustomerServiceReportMember');

/**
 * @description 고객센터 문의 등록
 * @param {Array} report
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const postCustomerService = async (report, isGetId = false, t) => {
	const response = await CustomerServiceReport.create(
		{
			filter_id: report.filter_id,
			type: report.type,
			status: report.status,
			name: report.name,
			nickname: report.nickname,
			email: report.email,
			phone: report.phone,
			title: report.title,
			contents: report.contents,
			url: report.url,
			memo: report.memo,
		},
		{ transaction: t },
	);
	return isGetId ? response.dataValues.id : response;
};

// 고객센터 강사 연결
export const postCustomerServiceTutor = async (customerServiceReportId, tutorId, isGetId = false, t) => {
	const response = await CustomerServiceReportTutor.create({ customer_service_report_id: customerServiceReportId, tutor_id: tutorId }, { transaction: t });
	return isGetId ? response.dataValues.id : response;
};

// 고객센터 기관 연결
export const postCustomerServiceInstitute = async (customerServiceReportId, instituteId, isGetId = false, t) => {
	const response = await CustomerServiceReportInstitute.create({ customer_service_report_id: customerServiceReportId, institute_id: instituteId }, { transaction: t });
	return isGetId ? response.dataValues.id : response;
};

// 고객센터 회원 연결
export const postCustomerServiceMember = async (customerServiceReportId, memberId, isGetId = false, t) => {
	const response = await CustomerServiceReportMember.create({ customer_service_report_id: customerServiceReportId, member_id: memberId }, { transaction: t });
	return isGetId ? response.dataValues.id : response;
};

// 고객센터 문의 인덱스 존재 여부 조회
export const isExistCustomerServiceReport = async (customerServiceId) => ((await CustomerServiceReport.count({ where: { id: customerServiceId } })) > 0 ? true : false);
