import { Enum } from './enumify';

export default class IsDeleted extends Enum { }

IsDeleted.initEnum({
    Y: {
        get value() {
            return 'Y';
        },
        get alias() {
            return '삭제';
        }
    },
    N: {
        get value() {
            return 'N';
        },
        get alias() {
            return '삭제안함';
        }
    }
});
