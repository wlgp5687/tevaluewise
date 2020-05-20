import { Enum } from './enumify';

export default class InstituteType extends Enum {}

InstituteType.initEnum({
	INSTITUTE: {
		get value() {
			return 'institute';
		},
		get alias() {
			return '학원';
		}
	},
	UNIVERSITY: {
		get value() {
			return 'university';
		},
		get alias() {
			return '대학교';
		}
	},
	KINDERGARTEN: {
		get value() {
			return 'kindergarten';
		},
		get alias() {
			return '유치원';
		}
	},
	DAYCARE: {
		get value() {
			return 'daycare';
		},
		get alias() {
			return '어린이집';
		}
	},
	ETC: {
		get value() {
			return 'etc';
		},
		get alias() {
			return '기타';
		}
	}
});
