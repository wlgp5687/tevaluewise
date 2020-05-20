import { Enum } from './enumify';

export default class InfoCategory extends Enum {}

InfoCategory.initEnum({
	BASIC: {
		get value() {
			return 'basic';
		},
		get alias() {
			return '기본정보';
		}
	},
	TIP: {
		get value() {
			return 'tip';
		},
		get alias() {
			return '꿀팁';
		}
	},
	NEWS: {
		get value() {
			return 'news';
		},
		get alias() {
			return '뉴스';
		}
	}
});
