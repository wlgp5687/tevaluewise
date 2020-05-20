import { Enum } from './enumify';

export default class Confirm extends Enum {}

Confirm.initEnum({
    REQUEST: {
        get value() {
            return 'request';
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
            return '거절';
        }
    }
});
