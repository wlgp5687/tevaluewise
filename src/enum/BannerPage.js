import { Enum } from './enumify';

export default class BannerPage extends Enum {}

BannerPage.initEnum({
	MAIN: {
		get value() {
			return 'main';
		},
		get alias() {
			return 'LV0 페이지';
		}
	},
	JOIN: {
		get value() {
			return 'join';
		},
		get alias() {
			return '회원가입 페이지';
		}
	},
	TUTOR_PAGE: {
		get value() {
			return 'tutor_page';
		},
		get alias() {
			return '강사 페이지';
		}
	},
	NON_CSAT_INSTITUTE_PAGE: {
		get value() {
			return 'non_csat_institute_page';
		},
		get alias() {
			return '비수능 기관 페이지';
		}
	},
	CSAT_INSTITUTE_PAGE: {
		get value() {
			return 'csat_institute_page';
		},
		get alias() {
			return '수능 기관 페이지';
		}
	},
	UNIVERSITY_PAGE: {
		get value() {
			return 'university_page';
		},
		get alias() {
			return '대학교 페이지';
		}
	},
	PROFESSOR_PAGE: {
		get value() {
			return 'professor_page';
		},
		get alias() {
			return '교수 페이지';
		}
	},
	KINDERGARTEN_PAGE: {
		get value() {
			return 'kindergarten_page';
		},
		get alias() {
			return '유치원 페이지';
		}
	},
	BOARD: {
		get value() {
			return 'board';
		},
		get alias() {
			return '게시판 페이지';
		}
	},
	GUIDE: {
		get value() {
			return 'guide';
		},
		get alias() {
			return '초보 가이드';
		}
	},
	KINDERGARTEN_SITE: {
		get value() {
			return 'kindergarten_site';
		},
		get alias() {
			return '유치원 사이트 메인';
		}
	},
	PROFESSOR_SITE: {
		get value() {
			return 'professor_site';
		},
		get alias() {
			return '교수 사이트 메인';
		}
	},
	CSAT_SITE: {
		get value() {
			return 'csat_site';
		},
		get alias() {
			return '수능 사이트 메인';
		}
	},
	NON_CSAT_SITE: {
		get value() {
			return 'non_csat_site';
		},
		get alias() {
			return '비수능 사이트 메인';
		}
	}
});
