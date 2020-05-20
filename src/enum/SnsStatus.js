import { Enum } from './enumify';

export default class SnsStatus extends Enum {}

SnsStatus.initEnum({
	RESERVATION: {
		get value() {
			return 'reservation';
		},
		get alias() {
			return '예약';
		}
	},
	SUCCESS: {
		get value() {
			return 'success';
		},
		get alias() {
			return '성공';
		}
	},
	FAIL: {
		get value() {
			return 'fail';
		},
		get alias() {
			return '실패';
		}
	}
});
