import postCafeVideo from './postCafeVideo.test';
import getCafeVideo from './getCafeVideo.test';
import deleteCafeVideo from './deleteCafeVideo.test';
import patchCafeVideo from './patchCafeVideo.test';
import getCafeVideos from './getCafeVideos.test';

describe('ROUTER /v1/admins/cafes', () => {
	postCafeVideo();
	getCafeVideo();
	deleteCafeVideo();
	patchCafeVideo();
	getCafeVideos();
});
