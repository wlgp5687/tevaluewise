import { Enum } from './enumify';

export default class AllowScroll extends Enum {}

AllowScroll.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '승인';
		}
	},
	N: {
		get value() {
			return 'N';
		},
		get alias() {
			return '비승인';
		}
	}
});
