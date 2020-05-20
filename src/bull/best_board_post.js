import * as bull from './index';
import { sequelize } from '../database';

/** @description Best 게시물 카운트 반영 */
export const updateBestBoardPost = async () => {
	const truncateBestBoardPostSql = ['TRUNCATE `best_board_post`;'].join(' ');
	await sequelize.query(truncateBestBoardPostSql, { type: sequelize.QueryTypes.DESTROY });

	const applyBestBoardPostSql = [
		'INSERT INTO `best_board_post` ( ',
		'	`id`, `board_config_id`, `read_count`, `like_count`, `comment_count`, `board_post_total`, `created_at` ',
		') ',
		'SELECT ',
		'	`tmp_best_board_post`.`id`, ',
		'	`tmp_best_board_post`.`board_config_id`, ',
		'	`tmp_best_board_post`.`read_count`, ',
		'	`tmp_best_board_post`.`like_count`, ',
		'	`tmp_best_board_post`.`comment_count`, ',
		'	`tmp_best_board_post`.`board_post_total`, ',
		'	`tmp_best_board_post`.`created_at` ',
		'FROM `tmp_best_board_post`; ',
	].join(' ');
	await sequelize.query(applyBestBoardPostSql, { type: sequelize.QueryTypes.INSERT });
};

/**
 * @description 전달 받은 게시판 인덱스에 소속되는 Best 게시물 카운트 업데이트
 * @param {Int} boardConfigId
 */
export const updateBestBoardPostCount = async (boardConfigId) => {
	const updateBestBoardPostCountSql = [
		'UPDATE `tmp_best_board_post` SET `board_post_total` = ( ',
		'	`tmp_best_board_post`.`read_count` + `tmp_best_board_post`.`like_count` + `tmp_best_board_post`.`comment_count` ',
		') WHERE `tmp_best_board_post`.`id` > 0 AND `tmp_best_board_post`.`board_config_id` = ' + boardConfigId + '; ', // eslint-disable-line prefer-template
	].join(' ');
	await sequelize.query(updateBestBoardPostCountSql, { type: sequelize.QueryTypes.UPDATE });
};

/** @description Best 게시물 게시판 인덱스 조회 후 Loop */
export const loopBestBoardPostQueue = async () => {
	const bestBoardPostBoardConfigIdsSql = ['SELECT DISTINCT(`board_config_id`) FROM `tmp_best_board_post`;'].join(' ');
	const boardConfigIds = await sequelize.query(bestBoardPostBoardConfigIdsSql, { type: sequelize.QueryTypes.SELECT });
	if (boardConfigIds) for (let i = 0; i < boardConfigIds.length; i += 1) bull.bestBoardPostCalueQueue({ boardConfigId: boardConfigIds[i].board_config_id, isProcess: true });
};

/** @description 테이블 초기화 및 Best 게시물 수 만큼 데이터 생성 */
export const initiateBestBoardPostTable = async () => {
	const truncateTmpBestBoardpostSql = ['TRUNCATE `tmp_best_board_post`;'].join(' ');
	await sequelize.query(truncateTmpBestBoardpostSql, { type: sequelize.QueryTypes.DESTROY });

	const initiateBestBoardPostSql = [
		'INSERT INTO `tmp_best_board_post` ( ',
		'	`id`, `board_config_id`, `read_count`, `like_count`, `comment_count`, `board_post_total`, `created_at` ',
		') ',
		'SELECT ',
		'	`board_posts`.`id`, ',
		'	`board_posts`.`board_config_id`, ',
		'	`board_posts`.`read_count`, ',
		'	`board_posts`.`like_count`, ',
		'	( ',
		'		SELECT COUNT(`post_comments`.`id`) ',
		'		FROM `post_comments` ',
		'		WHERE `post_comments`.`id` IS NOT NULL ',
		'		AND `post_comments`.`post_id` = `board_posts`.`id` ',
		'		AND `post_comments`.`is_deleted` = "N" ',
		'	) AS `comment_count`, ',
		'	0 AS `board_post_total`, ',
		'	`board_posts`.`created_at` ',
		'FROM `board_posts` ',
		'WHERE `board_posts`.`id` IS NOT NULL ',
		'AND `board_posts`.`depth` = 1 ',
		'AND `board_posts`.`is_deleted` = "N" ',
		'AND `board_posts`.`is_notice` = "N" ',
		'AND `board_posts`.`is_secret` = "N"; ',
	].join(' ');
	await sequelize.query(initiateBestBoardPostSql, { type: sequelize.QueryTypes.INSERT });
};

/**
 * @description Best 게시물 진행 Process
 * @param {array} job
 */
export const processBestBoardPost = async (job) => {
	const { boardConfigId, isProcess } = job.data;
	try {
		if (isProcess) {
			if (!boardConfigId) {
				await loopBestBoardPostQueue();
			} else {
				await updateBestBoardPostCount(boardConfigId);
			}
		} else {
			// 테이블 초기화 및 게시물 수 만큼 데이터 생성
			await initiateBestBoardPostTable();
		}
	} catch (err) {
		console.err(err);
		throw err;
	}
};
