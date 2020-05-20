import { Enum } from './enumify';

export default class BanStatus extends Enum {}

BanStatus.initEnum({
	BAN: {
		get value() {
			return 'ban';
		},
		get alias() {
			return '제제';
		},
	},
	CLEAR: {
		get value() {
			return 'clear';
		},
		get alias() {
			return '제제 취소';
		},
	},
});
