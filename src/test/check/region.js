import * as common from '../component/common';

export const checkRegion = (region) => {
	if (region.full_name) expect(typeof region.full_name).toEqual('string');
	if (region.target_region_id) expect(typeof region.target_region_id).toEqual('number');
	if (region.id) expect(typeof region.id).toEqual('number');
	if (region.parent_id) expect(typeof region.parent_id).toEqual('number');
	if (region.code) expect(typeof region.code).toEqual('string');
	if (region.type) expect(common.regionTypeCheck(region.type)).toEqual(true);
	if (region.name) expect(typeof region.name).toEqual('string');
	if (region.is_deleted) expect(common.agreementCheck(region.is_deleted)).toEqual(true);

	return null;
};
