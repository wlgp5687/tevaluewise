import { Enum } from './enumify';

export default class IsConfirm extends Enum { }

IsConfirm.initEnum({
    REQUEST: {
        get value() {
            return 'REQUEST';
        },
        get alias() {
            return '대기';
        }
    },
    YES: {
        get value() {
            return 'Y';
        },
        get alias() {
            return '승인';
        }
    },
    NO: {
        get value() {
            return 'N';
        },
        get alias() {
            return '반려';
        }
    },
    BLIND: {
        get value() {
            return 'BLIND';
        },
        get alias() {
            return '블라인드';
        }
    }
});
