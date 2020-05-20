import { getModel } from '../database';

const Staff = getModel('member/Staff');

export const isInstitute = async (member_id, options = {}) => {
	const count = await Staff.count({ where: { member_id, target: 'institute', ...options } });
	return count > 0;
};

export const isMasterInstitute = async member_id => await isInstitute(memberId, { is_master: true });
