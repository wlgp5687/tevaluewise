import getInstitutes from './getInstitutes.test';
import getInstitutesCampus from './getInstitutesCampus.test';
import getIsExistFamiliesInstitute from './getIsExistFamiliesInstitute.test';
import getFollowInstitute from './getFollowInstitute.test';
import getInstitutesList from './getInstitutesList.test';
import getKindergartenNearBy from './getKindergartenNearBy.test';
import getInstituteById from './getInstituteById.test';

describe('ROUTER /v1/institutes', () => {
	getInstitutes();
	getInstitutesCampus();
	getIsExistFamiliesInstitute();
	getFollowInstitute();
	getInstitutesList();
	getKindergartenNearBy();
	getInstituteById();
});
