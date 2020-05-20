import { Enum } from './enumify';

export default class CustomerServiceReportStatus extends Enum {}

CustomerServiceReportStatus.initEnum({
	REQUEST: {
		get value() {
			return 'REQUEST';
		},
		get alias() {
			return '대기';
		},
	},
	PROGRESS: {
		get value() {
			return 'PROGRESS';
		},
		get alias() {
			return '진행중';
		},
	},
	COMPLETE: {
		get value() {
			return 'COMPLETE';
		},
		get alias() {
			return '완료';
		},
	},
});
