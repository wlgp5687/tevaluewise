import { Enum } from './enumify';

export default class BullStatus extends Enum {}

BullStatus.initEnum({
	PAUSE: {
		get value() {
			return 'pause';
		},
		get alias() {
			return '대기';
		}
	},
	END: {
		get value() {
			return 'end';
		},
		get alias() {
			return '종료';
		}
	}
});
