import { Enum } from './enumify';

export default class AnswerStatus extends Enum {}

AnswerStatus.initEnum({
	PAUSE: {
		get value() {
			return 'pause';
		},
		get alias() {
			return '답변대기';
		}
	},
	COMPLETION: {
		get value() {
			return 'completion';
		},
		get alias() {
			return '답변완료';
		}
	}
});
