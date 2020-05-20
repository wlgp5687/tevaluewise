import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as customerService from '../../services/customer/customer';
import * as memberService from '../../services/member/member';
import * as customerValidator from '../../validators/customer';

const router = express.Router();

// 고객 센터 문의 등록
router.post(
	'/',
	...customerValidator.postCustomerServiceValidator,
	wrapAsyncRouter(async (req, res) => {
		let response = null;
		// 로그인한 회원의 인덱스
		let memberId = null;
		const decodedTokenData = req.decodedToken.data ? req.decodedToken.data : null;
		if (decodedTokenData) memberId = decodedTokenData.member ? decodedTokenData.member.id : null;

		let memberAttr = null;
		if (memberId) memberAttr = await memberService.getMemberInfoById(memberId);

		// 요청변수 정리
		const customerServiceReport = {
			filter_id: req.body.filter_id ? req.body.filter_id : null,
			type: req.body.type,
			status: 'REQUEST',
			name: memberAttr ? memberAttr.attribute.name : req.body.name,
			nickname: memberAttr ? memberAttr.nickname : req.body.nickname,
			email: memberAttr ? memberAttr.attribute.email : req.body.email,
			phone: memberAttr ? memberAttr.attribute.phone : req.body.phone,
			title: req.body.title,
			contents: req.body.contents,
			url: req.body.url ? req.body.url : '',
			memo: '',
		};

		const reportAttr = {};
		if (req.body.tutor_id) reportAttr.tutor = req.body.tutor_id;
		if (req.body.institute_id) reportAttr.institute = req.body.institute_id;
		if (memberId) reportAttr.member = memberId;
		customerServiceReport.page = reportAttr;

		response = await customerService.doRegisterCustomerService(customerServiceReport);

		return res.json({ customer_service_report: response });
	}),
);
export default router;
