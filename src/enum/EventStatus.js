import { Enum } from './enumify';

export default class EventStatus extends Enum {}

EventStatus.initEnum({
	PROGRESS: {
		get value() {
			return '1';
		},
		get alias() {
			return '진행중';
		}
	},
	WINNER_ANNOUNCED: {
		get value() {
			return '2';
		},
		get alias() {
			return '당첨자발표';
		}
	},
	CLOSED: {
		get value() {
			return '3';
		},
		get alias() {
			return '종료';
		}
	}
});
