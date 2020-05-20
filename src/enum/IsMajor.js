import { Enum } from './enumify';

export default class IsMajor extends Enum {}

IsMajor.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '메인';
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
