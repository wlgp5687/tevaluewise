import { getModel } from '../database';

const Staff = getModel('member/Staff');

export const isTutor = async (member_id, options = {}) => {
	const count = await Staff.count({ where: { member_id, target: 'tutor', ...options } });
	return count > 0;
};

export const isMasterTutor = async member_id => await isTutor(memberId, { is_master: true });
