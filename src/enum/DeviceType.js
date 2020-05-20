import { Enum } from './enumify';

export default class DeviceType extends Enum {}

DeviceType.initEnum({
	PC: {
		get value() {
			return 'pc';
		},
		get alias() {
			return 'PC';
		}
	},
	MOBILE: {
		get value() {
			return 'mobile';
		},
		get alias() {
			return 'mobile';
		}
	}
});
