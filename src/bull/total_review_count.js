import { sequelize } from '../database';

import * as log from './logs';

// 강사 리뷰 수 업데이트 처리
export const updateTutorTotalReviewCount = async (job) => {
	const logId = await log.addStartLog('tutor_review_count');
	const sql = [
		'UPDATE `tutor_counts` SET `total_review_count` = ( ',
		'    ( ',
		'        SELECT COUNT(`tutor_reviews`.`review_id`) ',
		'        FROM `tutor_reviews` ',
		'        INNER JOIN `reviews` ON `reviews`.`id` = `tutor_reviews`.`review_id` ',
		'        WHERE `tutor_reviews`.`tutor_id` = `tutor_counts`.`tutor_id` ',
		'        AND `reviews`.`is_deleted` = "N" ',
		'        AND `reviews`.`is_confirm` = "Y" ',
		'    ) + ( ',
		'        SELECT COUNT(`tutor_change_reviews`.`review_id`) ',
		'        FROM `tutor_change_reviews` ',
		'        INNER JOIN `reviews` ON `reviews`.`id` = `tutor_change_reviews`.`review_id` ',
		'        WHERE `tutor_change_reviews`.`before_tutor_id` = `tutor_counts`.`tutor_id` ',
		'        AND `reviews`.`is_deleted` = "N" ',
		'       AND `reviews`.`is_confirm` = "Y" ',
		'   ) + ( ',
		'        SELECT COUNT(`tutor_change_reviews`.`review_id`) ',
		'        FROM `tutor_change_reviews` ',
		'        INNER JOIN `reviews` ON `reviews`.`id` = `tutor_change_reviews`.`review_id` ',
		'        WHERE `tutor_change_reviews`.`after_tutor_id` = `tutor_counts`.`tutor_id` ',
		'        AND `reviews`.`is_deleted` = "N" ',
		'        AND `reviews`.`is_confirm` = "Y" ',
		'    ) ',
		') WHERE `tutor_id` > 0; ',
	].join(' ');
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
	await log.updateEndLog(logId);
};

// 기관 리뷰 수 업데이트 처리
export const updateInstituteTotalReviewCount = async (job) => {
	const logId = await log.addStartLog('institute_review_count');
	const sql = [
		'UPDATE `institute_counts` SET `total_review_count` = ( ',
		'    ( ',
		'        SELECT COUNT(`institute_reviews`.`review_id`) ',
		'        FROM `institute_reviews` ',
		'        INNER JOIN `reviews` ON `reviews`.`id` = `institute_reviews`.`review_id` ',
		'       WHERE `institute_reviews`.`institute_id` = `institute_counts`.`institute_id` ',
		'        AND `reviews`.`is_deleted` = "N" ',
		'        AND `reviews`.`is_confirm` = "Y" ',
		'    ) + ( ',
		'        SELECT COUNT(`institute_change_reviews`.`review_id`) ',
		'        FROM `institute_change_reviews` ',
		'        INNER JOIN `reviews` ON `reviews`.`id` = `institute_change_reviews`.`review_id` ',
		'        WHERE `institute_change_reviews`.`before_institute_id` = `institute_counts`.`institute_id` ',
		'        AND `reviews`.`is_deleted` = "N" ',
		'        AND `reviews`.`is_confirm` = "Y" ',
		'    ) + ( ',
		'        SELECT COUNT(`institute_change_reviews`.`review_id`) ',
		'        FROM `institute_change_reviews` ',
		'        INNER JOIN `reviews` ON `reviews`.`id` = `institute_change_reviews`.`review_id` ',
		'        WHERE `institute_change_reviews`.`after_institute_id` = `institute_counts`.`institute_id` ',
		'        AND `reviews`.`is_deleted` = "N" ',
		'        AND `reviews`.`is_confirm` = "Y" ',
		'    ) ',
		') WHERE `institute_id` > 0; ',
	].join(' ');
	await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
	await log.updateEndLog(logId);
};
