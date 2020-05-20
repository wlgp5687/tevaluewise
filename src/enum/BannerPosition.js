import { Enum } from './enumify';

export default class BannerPosition extends Enum {}

BannerPosition.initEnum({
	MAIN: {
		get value() {
			return 'main';
		},
		get alias() {
			return 'LV0';
		},
	},
	JOIN: {
		get value() {
			return 'join';
		},
		get alias() {
			return '회원 가입';
		},
	},
	HOME: {
		get value() {
			return 'home';
		},
		get alias() {
			return '홈';
		},
	},
	NORMAL_REVIEW: {
		get value() {
			return 'normal_review';
		},
		get alias() {
			return '일반 리뷰';
		},
	},
	TRANSFER_REVIEW: {
		get value() {
			return 'transfer_review';
		},
		get alias() {
			return '환승 리뷰';
		},
	},
	TALK_LIST: {
		get value() {
			return 'talk_list';
		},
		get alias() {
			return '수다 목록';
		},
	},
	TALK_DETAIL: {
		get value() {
			return 'talk_detail';
		},
		get alias() {
			return '수다 상세';
		},
	},
	INFO_LIST: {
		get value() {
			return 'info_list';
		},
		get alias() {
			return '정보 목록';
		},
	},
	INFO_DETAIL: {
		get value() {
			return 'info_detail';
		},
		get alias() {
			return '정보 상세';
		},
	},
	EXAM_LIST: {
		get value() {
			return 'exam_list';
		},
		get alias() {
			return '기출문제 목록';
		},
	},
	EXAM_DETAIL: {
		get value() {
			return 'exam_detail';
		},
		get alias() {
			return '기출문제 상세';
		},
	},
	ESSAY_LIST: {
		get value() {
			return 'essay_list';
		},
		get alias() {
			return '합격수기 목록';
		},
	},
	ESSAY_DETAIL: {
		get value() {
			return 'essay_detail';
		},
		get alias() {
			return '합격수기 상세';
		},
	},
	REPORT_LIST: {
		get value() {
			return 'report_list';
		},
		get alias() {
			return '적폐청산 목록';
		},
	},
	REPORT_DETAIL: {
		get value() {
			return 'report_detail';
		},
		get alias() {
			return '적폐청산 상세';
		},
	},
	EVENT_LIST: {
		get value() {
			return 'event_list';
		},
		get alias() {
			return '이벤트 목록';
		},
	},
	EVENT_DETAIL: {
		get value() {
			return 'event_detail';
		},
		get alias() {
			return '이벤트 상세';
		},
	},
	QNA_LIST: {
		get value() {
			return 'qna_list';
		},
		get alias() {
			return 'QNA 목록';
		},
	},
	QNA_DETAIL: {
		get value() {
			return 'qna_detail';
		},
		get alias() {
			return 'QNA 상세';
		},
	},
	FAQ_LIST: {
		get value() {
			return 'faq_list';
		},
		get alias() {
			return 'FAQ 목록';
		},
	},
	RESOURCE_LIST: {
		get value() {
			return 'resource_list';
		},
		get alias() {
			return '자료실 목록';
		},
	},
	RESOURCE_DETAIL: {
		get value() {
			return 'resource_detail';
		},
		get alias() {
			return '자료실 목록';
		},
	},
	GENERAL_LIST: {
		get value() {
			return 'general_list';
		},
		get alias() {
			return '일반 목록';
		},
	},
	GENERAL_DETAIL: {
		get value() {
			return 'general_detail';
		},
		get alias() {
			return '일반 목록';
		},
	},
	GUIDE: {
		get value() {
			return 'guide';
		},
		get alias() {
			return '초보 가이드';
		},
	},
	SEARCH: {
		get value() {
			return 'search';
		},
		get alias() {
			return '검색';
		},
	},
});
