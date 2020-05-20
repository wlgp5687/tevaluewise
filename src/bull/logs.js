import { sequelize } from '../database';

// 로그 작성 시작
export const addStartLog = async (type) => {
	let date = new Date();
	date = `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;

	const addLogSql = [
		'INSERT INTO `tmp_bull_logs` ',
		'(`type`, `start_date`, `end_date`, `status`, `created_at`) ',
		/* eslint-disable-next-line */
		'VALUES ( "' + type + '", "' + date + '", ' + null + ', "pause", "' + date + '"); ',
	].join(' ');
	const logData = await sequelize.query(addLogSql, { type: sequelize.QueryTypes.INSERT });

	return Object.keys(logData).length > 0 ? logData[0] : null;
};

// 로그 업데이트 처리
export const updateEndLog = async (id) => {
	let date = new Date();
	date = `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;

	/* eslint-disable-next-line */
	const updateLogSql = ['UPDATE `tmp_bull_logs` SET `end_date` = "' + date + '", `status` = "end" WHERE `id` = "' + id + '"; '].join(' ');
	await sequelize.query(updateLogSql, { type: sequelize.QueryTypes.UPDATE });

	return null;
};
