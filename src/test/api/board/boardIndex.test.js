import postGeneralBoardPostTest from './postGeneralBoardPost.test';
import patchGeneralBoardPostTest from './patchGeneralBoardPost.test';
import deleteGeneralBoardPostTest from './deleteGeneralBoardPost.test';
import getGeneralBoardPostsTest from './getGeneralBoardPosts.test';
import getGeneralBoardPostTest from './getGeneralBoardPost.test';
import postReferenceBoardPostTest from './postReferenceBoardPost.test';
import getReferenceBoardPostTest from './getReferenceBoardPost.test';
import getReferenceBoardPostsTest from './getReferenceBoardPosts.test';
import deleteReferenceBoardPostTest from './deleteReferenceBoardPost.test';
import patchReferenceBoardPostTest from './patchReferenceBoardPost.test';

describe('ROUTER /v1/admins/boards', () => {
	postGeneralBoardPostTest();
	patchGeneralBoardPostTest();
	deleteGeneralBoardPostTest();
	getGeneralBoardPostsTest();
	getGeneralBoardPostTest();
	postReferenceBoardPostTest();
	getReferenceBoardPostTest();
	getReferenceBoardPostsTest();
	deleteReferenceBoardPostTest();
	patchReferenceBoardPostTest();
});
