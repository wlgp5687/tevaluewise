import { Enum } from './enumify';

export default class CafeType extends Enum {}

CafeType.initEnum({
	TUTOR: {
		get value() {
			return 'tutor';
		},
		get alias() {
			return '강사';
		},
	},
	INSTITUTE: {
		get value() {
			return 'institute';
		},
		get alias() {
			return '기관';
		},
	},
});
