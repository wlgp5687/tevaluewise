import { Enum } from './enumify';

export default class Sex extends Enum {}

Sex.initEnum({
	MALE: {
		get value() {
			return 'man';
		},
		get alias() {
			return '남자';
		}
	},
	FEMALE: {
		get value() {
			return 'woman';
		},
		get alias() {
			return '여자';
		}
	},
	UNKNOWN: {
		get value() {
			return 'unknown';
		},
		get alias() {
			return '알수없음';
		}
	}
});
