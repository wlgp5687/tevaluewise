import { Enum } from './enumify';

export default class RequestType extends Enum {}

RequestType.initEnum({
	INVITATION: {
		get value() {
			return 'invitation';
		},
		get alias() {
			return '요청';
		},
	},
	COMPULSORINESS: {
		get value() {
			return 'compulsoriness';
		},
		get alias() {
			return '강제';
		},
	},
});
