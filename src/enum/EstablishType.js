import { Enum } from './enumify';

export default class EstablishType extends Enum {}

EstablishType.initEnum({
	PUBLIC: {
		get value() {
			return 'public';
		},
		get alias() {
			return '국공립';
		}
	},
	CORPORATE: {
		get value() {
			return 'corporate';
		},
		get alias() {
			return '법인';
		}
	},
	HOME: {
		get value() {
			return 'home';
		},
		get alias() {
			return '민간/가정';
		}
	},
	PRIVATE: {
		get value() {
			return 'private';
		},
		get alias() {
			return '사립';
		}
	},
	ENGLISH: {
		get value() {
			return 'english';
		},
		get alias() {
			return '영어';
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
