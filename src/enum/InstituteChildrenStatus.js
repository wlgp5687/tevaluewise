import { Enum } from './enumify';

export default class InstituteChildrenStatus extends Enum {}

InstituteChildrenStatus.initEnum({
	NORMAL: {
		get value() {
			return 'normal';
		},
		get alias() {
			return '일반';
		}
	},
	LACK: {
		get value() {
			return 'lack';
		},
		get alias() {
			return '정보부족';
		}
	},
	ENGLISH: {
		get value() {
			return 'english';
		},
		get alias() {
			return '영어';
		}
	},
	CLOSING: {
		get value() {
			return 'closing';
		},
		get alias() {
			return '폐원';
		}
	}
});
