import { getModel } from '../database';

const Staff = getModel('member/Staff');

const isStaff = async (member_id, options = {}) => {
	const count = await Staff.count({ where: { member_id, ...options } });
	return count > 0;
};

const isTutorStaff = async member_id => await isStaff(member_id, { target: 'tutor' });

const isMasterTutorStaff = async member_id => await isStaff(member_id, { target: 'tutor', is_master: true });

const isInstituteStaff = async member_id => await isStaff(member_id, { target: 'institute' });

const isMasterInstituteStaff = async member_id => await isStaff(member_id, { target: 'institute', is_master: true });
