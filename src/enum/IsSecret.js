import { Enum } from './enumify';

export default class IsSecret extends Enum {}

IsSecret.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '비밀글';
		}
	},
	N: {
		get value() {
			return 'N';
		},
		get alias() {
			return '일반';
		}
	}
});
