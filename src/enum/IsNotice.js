import { Enum } from './enumify';

export default class IsNotice extends Enum {}

IsNotice.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get alias() {
			return '공지';
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
