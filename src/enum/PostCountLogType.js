import { Enum } from './enumify';

export default class PostCountLogType extends Enum {}

PostCountLogType.initEnum({
	LIKE: {
		get value() {
			return 'like';
		},
		get alias() {
			return '좋아요';
		}
	},
	DISLIKE: {
		get value() {
			return 'dislike';
		},
		get alias() {
			return '싫어요';
		}
	},
	VIEW: {
		get value() {
			return 'view';
		},
		get alias() {
			return '조회수';
		}
	}
});
