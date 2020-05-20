import { Enum } from './enumify';

export default class PostFilterType extends Enum {}

PostFilterType.initEnum({
	TUTOR: {
		get value() {
			return 'tutor';
		},
		get alias() {
			return '강사';
		}
	}
});
