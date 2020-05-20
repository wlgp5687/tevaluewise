import { Enum } from './enumify';

export default class IsAnonymous extends Enum {}

IsAnonymous.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '익명';
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
