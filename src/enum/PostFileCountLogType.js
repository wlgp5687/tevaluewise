import { Enum } from './enumify';

export default class PostFileCountLogType extends Enum {}

PostFileCountLogType.initEnum({
	DOWNLOAD: {
		get value() {
			return 'download';
		},
		get alias() {
			return '다운로드';
		}
	}
});
