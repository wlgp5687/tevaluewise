import { Enum } from './enumify';

export default class CheatingTarget extends Enum {}

CheatingTarget.initEnum({
	REVIEW: {
		get value() {
			return 'review';
		},
		get alias() {
			return '리뷰';
		}
	},
	REVIEW_COMMENT: {
		get value() {
			return 'review_comment';
		},
		get alias() {
			return '리뷰 댓글';
		}
	},
	BOARD_ARTICLE: {
		get value() {
			return 'board_article';
		},
		get alias() {
			return '게시물';
		}
	},
	BOARD_ARTICLE_COMMENT: {
		get value() {
			return 'board_article_comment';
		},
		get alias() {
			return '게시물 댓글';
		}
	}
});
