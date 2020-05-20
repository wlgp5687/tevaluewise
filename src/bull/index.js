import Queue from 'bull';
import { processBestBoardPost, updateBestBoardPost } from './best_board_post';
// import { runCache } from './cache';

const redis = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST };

/** @description SMS 발송 Queue */
const SMS = new Queue('SMS', { redis });

/** @description Email 발송 Queue */
const Email = new Queue('Email', { redis });

/** @description 랭킹 Queue */
// const RankManager = new Queue('RankManager', { redis });
// const Rank = new Queue('Rank', { redis });

/** @description 사이트 노출 지표 */
const SiteExposureCount = new Queue('SiteExposureCount', { redis });

/** @description 강사 & 기관 리뷰수 Queue */
const UpdateTutorTotalReviewCount = new Queue('UpdateTutorTotalReviewCount', { redis });
const UpdateInstituteTotalReviewCount = new Queue('UpdateInstituteTotalReviewCount', { redis });

/** @description 강사 & 기관 팔로워수 Queue */
const UpdateTutorTotalFollowCount = new Queue('UpdateTutorTotalFollowCount', { redis });
const UpdateInstituteTotalFollowCount = new Queue('UpdateInstituteTotalFollowCount', { redis });

/** @description 강사 & 기관 정렬순서 Queue */
const TutorSortQueue = new Queue('TutorSortQueue', { redis, limiter: { max: 2, duration: 1 } });
const InstituteSortQueue = new Queue('InstituteSortQueue', { redis, limiter: { max: 2, duration: 1 } });
const UpdateTutorSort = new Queue('UpdateTutorSort', { redis });
const UpdateInstituteSort = new Queue('UpdateInstituteSort', { redis });

/** @description 랭킹 초기화 */
const InitiateRank = new Queue('InitiateRank', { redis, limiter: { max: 2, duration: 1 } });

/** @description 기관 랭킹 계산 Queue */
const NonCsatInstituteRankCalueQueue = new Queue('NonCsatInstituteRankCalueQueue', { redis, limiter: { max: 2, duration: 1 } });
const UpdateNonCsatInstituteRank = new Queue('UpdateNonCsatInstituteRank', { redis });

/** @description 랭킹 통합지표 게산 Queue */
const RankIndicatorsCalueQueue = new Queue('RankIndicatorsCalueQueue', { redis, limiter: { max: 2, duration: 1 } });
const UpdateRankIndicators = new Queue('UpdateRankIndicators', { redis });

/** @description 강사 랭킹 계산 Queue */
const TutorRankCalueQueue = new Queue('TutorRankCalueQueue', { redis, limiter: { max: 2, duration: 1 } });
const UpdateTutorRank = new Queue('UpdateTutorRank', { redis });

/** @description 기간 강사 랭킹 계산 Queue */
const RangeTutorRankCalueQueue = new Queue('RangeTutorRankCalueQueue', { redis, limiter: { max: 2, duration: 1 } });
const UpdateRangeTutorRank = new Queue('UpdateRangeTutorRank', { redis });

/** @description 랭킹 적용 */
const ApplyRank = new Queue('ApplyRank', { redis, limiter: { max: 2, duration: 1 } });

/** @description Best 게시물 계산 Queue */
const BestBoardPostCalueQueue = new Queue('BestBoardPostCalueQueue', { redis, limiter: { max: 2, duration: 1 } });
const UpdateBestBoardPost = new Queue('UpdateBestBoardPost', { redis });

/** @description Eamil 발송 Queue */
const NcloudEmail = new Queue('NcloudEmail', { redis });
const NcloudEmailSync = new Queue('NcloudEmailSync', { redis });

/**
 * @description SMS 발송 처리
 * @param {string|array} to phone number or phone numbers
 * @param {string} message
 */
export const sendSMS = async ({ number, message }) => await SMS.add({ number, message }, { removeOnComplete: true });

/**
 * @description 이메일 발송 처리
 * @param {string} email phone number or phone numbers
 * @param {string} message
 */
export const sendEmail = async ({ email, title, body }) => await Email.add({ email, title, body }, { removeOnComplete: true });

/**
 * @description 랭킹 업데이트
 * @param
 */
export const updateRank = async () => {
	// @TODO remove existing Rank tasks add a RankManager task without repeat option
};

/** @description 사이트 노출 지표 */
export const siteExposureCount = async () => await SiteExposureCount.add({}, { removeOnComplete: true });

/**
 * @description 강사 정렬 계산 요청
 * @param {*} param0
 */
export const tutorSortQueue = async ({ tutorId, page, limit }) => await TutorSortQueue.add({ tutorId, page, limit }, { removeOnComplete: true });

/**
 * @description 기관 정렬 계산 요청
 * @param {*} param0
 */
export const instituteSortQueue = async ({ instituteId, page, limit }) => await InstituteSortQueue.add({ instituteId, page, limit }, { removeOnComplete: true });

/**
 * @description 기관 랭킹 계산요청
 * @param {*} param0
 */
export const nonCsatInstituteRankCalueQueue = async ({ subjectId, isProcess }) => await NonCsatInstituteRankCalueQueue.add({ subjectId, isProcess }, { removeOnComplete: true });

/**
 * @description 랭킹 통합지표 계산요청
 * @param {*} param0
 */
export const rankIndicatorsCalueQueue = async ({ subjectId, isProcess }) => await RankIndicatorsCalueQueue.add({ subjectId, isProcess }, { removeOnComplete: true });

/**
 * @description 강사 랭킹 계산 요청
 * @param {*} param0
 */
export const tutorRankCalueQueue = async ({ subjectId, isProcess }) => await TutorRankCalueQueue.add({ subjectId, isProcess }, { removeOnComplete: true });

/**
 * @description 기간 강사 랭킹 계산 요청
 * @param {*} param0
 */
export const rangeTutorRankCalueQueue = async ({ subjectId, isProcess }) => await RangeTutorRankCalueQueue.add({ subjectId, isProcess }, { removeOnComplete: true });

/**
 * @description Best 게시물 계산 요청
 * @param {*} param0
 */
export const bestBoardPostCalueQueue = async ({ boardConfigId, isProcess }) => await BestBoardPostCalueQueue.add({ boardConfigId, isProcess }, { removeOnComplete: true });

/**
 * @description 이메일 발송 요청
 * @param {*} param0
 */
export const ncloudEmail = async ({ mailRequestId, isRequest }) => await NcloudEmail.add({ mailRequestId, isRequest }, { removeOnComplete: true });

/**
 * @description 발송 이메일 동기화
 * @param {*} param0
 */
export const ncloudEmailSync = async ({ mailRequestId, isRequest }) => await NcloudEmailSync.add({ mailRequestId, isRequest }, { removeOnComplete: true });

export const runTaskQueue = () => {
	if (!process.env.ALPHA) {
		// SMS
		SMS.process(processSMS);

		// 이메일
		Email.process(processEmail);

		// #################### 랭킹
		// RankManager.process(processRankManager);
		// Rank.process(processRank);

		// 사이트 노출 지표
		SiteExposureCount.process(processSiteExposureCount);

		// 강사별 총 리뷰 수 업데이트 처리
		UpdateTutorTotalReviewCount.process(updateTutorTotalReviewCount);
		// 기관별 총 리뷰 수 업데이트 처리
		UpdateInstituteTotalReviewCount.process(updateInstituteTotalReviewCount);

		// 강사병 총 팔로워 수 업데이트 처리
		UpdateTutorTotalFollowCount.process(updateTutorTotalFollowCount);
		// 기관별 총 팔로워 수 업데이트 처리
		UpdateInstituteTotalFollowCount.process(updateInstituteTotalFollowCount);

		// 강사 정렬 순서 업데이트 처리
		TutorSortQueue.process(processTutorSort);
		// 기관 정렬 순서 업데이트 처리
		InstituteSortQueue.process(processInstituteSort);
		// 강사 정렬 순서 업데이트
		UpdateTutorSort.process(updateTutorSort);
		// 기관 정렬 순서 업데이트
		UpdateInstituteSort.process(updateInstituteSort);

		// 랭킹 초기화 처리
		InitiateRank.process(initiateRank);
		// 비수능 기관 랭킹 지표 업데이트 처리
		NonCsatInstituteRankCalueQueue.process(processNonCsatInstituteRank);
		// 기관 랭킹 계산 완료시 본사 업데이트 및 랭킹 산정 및 반영
		UpdateNonCsatInstituteRank.process(updateNonCsatInstituteRank);
		// 랭킹 통합지표 업데이트 처리
		RankIndicatorsCalueQueue.process(processRankIndicators);
		// 강사 랭킹 통합지표 계산 완료시 반영
		UpdateRankIndicators.process(updateRankIndicators);
		// 강사 랭킹 지표 업데이트 처리
		TutorRankCalueQueue.process(processTutorRank);
		// 강사 랭킹 계산 완료시 반영
		UpdateTutorRank.process(updateTutorRank);
		// 기간 강사 랭킹 지표 업데이트
		RangeTutorRankCalueQueue.process(processRangeTutorRank);
		// 기간 강사 랭킹 계산 완료시 반영
		UpdateRangeTutorRank.process(updateRangeTutorRank);
		// 랭킹 적용 처리
		ApplyRank.process(applyRank);

		// Best 게시물 업데이트 처리
		BestBoardPostCalueQueue.process(processBestBoardPost);
		UpdateBestBoardPost.process(updateBestBoardPost);

		// Ncloud Email
		NcloudEmail.process(processNcloudEamil);
		NcloudEmailSync.process(processNcloudEamilSync);

		// RankManager.add({}, { removeOnComplete: true, repeat: { cron: '0 1 * * *' } });

		BestBoardPostCalueQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 05 00 * * ?' } });
		BestBoardPostCalueQueue.add({ boardConfigId: null, isProcess: true }, { removeOnComplete: true, repeat: { cron: '0 10 00 * * ?' } });
		UpdateBestBoardPost.add({}, { removeOnComplete: true, repeat: { cron: '0 15 00 * * ?' } });
		SiteExposureCount.add({}, { removeOnComplete: true, repeat: { cron: '0 10 00 * * ?' } });
		UpdateTutorTotalReviewCount.add({}, { removeOnComplete: true, repeat: { cron: '0 15 00 * * ?' } });
		UpdateTutorTotalFollowCount.add({}, { removeOnComplete: true, repeat: { cron: '0 15 00 * * ?' } });
		UpdateInstituteTotalReviewCount.add({}, { removeOnComplete: true, repeat: { cron: '0 15 00 * * ?' } });
		UpdateInstituteTotalFollowCount.add({}, { removeOnComplete: true, repeat: { cron: '0 15 00 * * ?' } });
		TutorAverageQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 30 00 * * ?' } });
		TutorSortQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 00 01 * * ?' } });
		InitiateRank.add({}, { removeOnComplete: true, repeat: { cron: '0 20 01 * * ?' } });
		NonCsatInstituteRankCalueQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 30 01 * * ?' } });
		RankIndicatorsCalueQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 00 02 * * ?' } });
		RangeTutorRankCalueQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 30 02 * * ?' } });
		TutorRankCalueQueue.add({}, { removeOnComplete: true, repeat: { cron: '0 30 03 * * ?' } });
		UpdateNonCsatInstituteRank.add({}, { removeOnComplete: true, repeat: { cron: '0 30 08 * * ?' } });
		UpdateRankIndicators.add({}, { removeOnComplete: true, repeat: { cron: '0 30 08 * * ?' } });
		UpdateTutorRank.add({}, { removeOnComplete: true, repeat: { cron: '0 40 08 * * ?' } });
		UpdateRangeTutorRank.add({}, { removeOnComplete: true, repeat: { cron: '0 40 08 * * ?' } });
		ApplyRank.add({}, { removeOnComplete: true, repeat: { cron: '0 00 10 * * ?' } });
		NcloudEmail.add({}, { removeOnComplete: true, repeat: { cron: '*/1 * * * *' } });
		NcloudEmailSync.add({}, { removeOnComplete: true, repeat: { cron: '*/5 * * * *' } });
	}

	console.log('- task queue started...');
};
