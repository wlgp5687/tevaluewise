import { Enum } from './enumify';

export default class Agreement extends Enum {}

Agreement.initEnum({
	YES: {
		get value() {
			return 'Y';
		},
		get boolValue() {
			return true;
		}
	},
	NO: {
		get value() {
			return 'N';
		},
		get boolValue() {
			return false;
		}
	}
});
