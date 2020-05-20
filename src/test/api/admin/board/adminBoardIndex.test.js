import getReferenceBoardPostTest from './getReferenceBoardPost.test';
import patchReferenceBoardPostTest from './patchReferenceBoardPost.test';
import getReferenceBoardPostsTest from './getReferenceBoardPosts.test';

describe('ROUTER /v1/admins/boards', () => {
	getReferenceBoardPostTest();
	patchReferenceBoardPostTest();
	getReferenceBoardPostsTest();
});
