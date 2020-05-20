import { Enum } from './enumify';

export default class IsBlank extends Enum {}

IsBlank.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '새창';
		}
	},
	N: {
		get value() {
			return 'N';
		},
		get alias() {
			return '현재창';
		}
	}
});
