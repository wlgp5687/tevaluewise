import { Enum } from './enumify';

export default class IsDefault extends Enum {}

IsDefault.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '디폴트';
		},
	},
	N: {
		get value() {
			return 'N';
		},
		get alias() {
			return '일반';
		},
	},
});
