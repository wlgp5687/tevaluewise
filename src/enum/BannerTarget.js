import { Enum } from './enumify';

export default class BannerTarget extends Enum {}

BannerTarget.initEnum({
	INTERVIEW: {
		get value() {
			return 'interview';
		},
		get alias() {
			return '인터뷰';
		},
	},
	POPUP: {
		get value() {
			return 'popup';
		},
		get alias() {
			return '팝업';
		},
	},
	LOGIN: {
		get value() {
			return 'login';
		},
		get alias() {
			return '로그인';
		},
	},
	COMMON: {
		get value() {
			return 'common';
		},
		get alias() {
			return '공통';
		},
	},
	MAIN_TOP: {
		get value() {
			return 'main_top';
		},
		get alias() {
			return '메인 상단';
		},
	},
	MAIN_BOTTOM: {
		get value() {
			return 'main_bottom';
		},
		get alias() {
			return '메인 하단';
		},
	},
	RIGHT_QUICK: {
		get value() {
			return 'right_quick';
		},
		get alias() {
			return '우측 퀵';
		},
	},
	CONTENT_KEYWORD: {
		get value() {
			return 'content_keyword';
		},
		get alias() {
			return '워드클라우드';
		},
	},
	CONTENT: {
		get value() {
			return 'content';
		},
		get alias() {
			return '컨텐츠';
		},
	},
	LNB_BLOCK: {
		get value() {
			return 'lnb_block';
		},
		get alias() {
			return '좌측 LNB';
		},
	},
	SOCCER_FIELD: {
		get value() {
			return 'soccer_field';
		},
		get alias() {
			return '사커필드';
		},
	},
});
