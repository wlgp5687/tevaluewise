import { Enum } from './enumify';

export default class RequestState extends Enum {}

RequestState.initEnum({
	REQUEST: {
		get value() {
			return 'REQUEST';
		}
	},
	ACCEPTED: {
		get value() {
			return 'Y';
		}
	},
	REJECTED: {
		get value() {
			return 'N';
		}
	},
	INVISIBLE: {
		get value() {
			return 'BLIND';
		}
	}
});
