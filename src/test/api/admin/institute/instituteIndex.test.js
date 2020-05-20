import getInstituteById from './getInstituteById.test';
import deleteInstituteRegion from './deleteInstituteRegion.test';
import deleteInstituteFamilies from './deleteInstituteFamilies.test';
import getIsExitsInstituteName from './getIsExistInstituteName.test';
import getInstituteBelongToTutor from './getInstituteBelongToTutor.test';
import getInstitutesByBanner from './getInstitutesByBanner.test';
import getInstituteHome from './getInstituteHome.test';
import postInstitute from './postInstitutes.test';
import getInstitutes from './getInstitutes.test';
import patchInstituteConfirm from './patchInstituteConfirm.test';
import patchInstituteMajor from './patchInstituteMajor.test';
import patchInstitute from './patchInstitute.test';

describe('ROUTER /v1/admins/institutes', () => {
	getInstituteById();
	deleteInstituteRegion();
	deleteInstituteFamilies();
	getIsExitsInstituteName();
	getInstituteBelongToTutor();
	getInstitutesByBanner();
	getInstituteHome();
	postInstitute();
	getInstitutes();
	patchInstituteConfirm();
	patchInstituteMajor();
	patchInstitute();
});
