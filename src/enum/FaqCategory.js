import { Enum } from './enumify';

export default class FaqCategory extends Enum {}

FaqCategory.initEnum({
	STARTEACHER: {
		get value() {
			return 'starteacher';
		},
		get alias() {
			return '별별선생';
		}
	},
	MEMBER: {
		get value() {
			return 'member';
		},
		get alias() {
			return '회원';
		}
	},
	SERVICE: {
		get value() {
			return 'service';
		},
		get alias() {
			return '서비스';
		}
	}
});
