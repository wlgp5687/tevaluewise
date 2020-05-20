import { Enum } from './enumify';

export default class CustomerServiceReportType extends Enum {}

CustomerServiceReportType.initEnum({
	SERVICE: {
		get value() {
			return 'service';
		},
		get alias() {
			return '고객센터';
		},
	},
	INFORMATION: {
		get value() {
			return 'information';
		},
		get alias() {
			return '정보수정';
		},
	},
	CAFE: {
		get value() {
			return 'cafe';
		},
		get alias() {
			return '카페문의';
		},
	},
});
