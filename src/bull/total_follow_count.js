import { sequelize } from '../database';

import * as log from './logs';

// 강사 팔로워 수 업데이트 처리
export const updateTutorTotalFollowCount = async () => {
	const logId = await log.addStartLog('tutor_follow_count');
	const sql = [
		'UPDATE `tutor_counts` SET `follow_count` = ( ',
		'    SELECT COUNT(`id`) ',
		'    FROM `member_follow_tutors` ',
		'    WHERE `member_follow_tutors`.`tutor_id` = `tutor_counts`.`tutor_id` ',
		') WHERE `tutor_id` > 0; ',
	].join(' ');
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
	await log.updateEndLog(logId);
};

// 기관 팔로워 수 업데이트 처리
export const updateInstituteTotalFollowCount = async () => {
	const logId = await log.addStartLog('institute_follow_count');
	const sql = [
		'UPDATE `institute_counts` SET `follow_count` = ( ',
		'    SELECT COUNT(`id`) ',
		'    FROM `member_follow_institutes` ',
		'    WHERE `member_follow_institutes`.`institute_id` = `institute_counts`.`institute_id` ',
		') WHERE `institute_id` > 0; ',
	].join(' ');
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
	await log.updateEndLog(logId);
};
