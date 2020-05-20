import { Enum } from './enumify';

export default class SiteTarget extends Enum {}

SiteTarget.initEnum({
	SITE: {
		get value() {
			return 'site';
		},
		get alias() {
			return '사이트';
		}
	},
	TUTOR: {
		get value() {
			return 'tutor';
		},
		get alias() {
			return '강사';
		}
	},
	INSTITUTE: {
		get value() {
			return 'institute';
		},
		get alias() {
			return '기관';
		}
	}
});
