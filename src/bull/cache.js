import Queue from 'bull';
import { fetchToken, fetchApi } from '../services/cache';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import aws from 'aws-sdk';
import format from 'date-fns/format';
import startOfMonth from 'date-fns/start_of_month';
import endOfMonth from 'date-fns/end_of_month';

const s3 = new aws.S3();
const delay = 5 * 60 * 1000;
const redis = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST };
const CacheManager = new Queue('CacheManager', { redis });
const Cache = new Queue('Cache', { redis });

const filters = {
	testenglish: { name: '시험영어', code: '00000000', subjects: [1, 2, 3, 8, 7] },
	abroad: { name: '유학영어', code: '00000001', subjects: [10, 11, 21, 22, 30, 24] },
	speaking: { name: 'Speaking', code: '00000002', subjects: [31, 3] },
	english: { name: '생활영어', code: '00000003', subjects: [33, 32] },
	gong1: { name: '행정직', code: '00070001', subjects: [271, 272, 273, 274, 275, 282, 276, 283, 293] },
	gong2: { name: '기술직', code: '00070002', subjects: [271, 272, 273, 346, 333] },
	police: { name: '경찰', code: '00070003', subjects: [527, 526, 364, 281, 280, 528, 277, 278, 279] },
	fire: { name: '소방', code: '00070004', subjects: [366, 367, 529, 530, 5310, 370, 278, 277, 279] },
	gosi: { name: '고등고시', code: '00070005', subjects: [370, 371, 372, 373, 369, 374] },
	gong3: { name: '군무원/특정직', code: '00070000', subjects: [269, 523] },
	teacher1: { name: '초등/유아임용', code: '00060000', subjects: [248, 249, 250, 251] },
	teacher2: { name: '중등임용', code: '00060001', subjects: [252, 254, 253, 255, 256] },
	high: { name: '고등학교', code: '00010000', type: 'csat', subjects: [35, 36, 37, 46, 41, 39, 40, 42, 43] },
	middle: { name: '중학교', code: '00010001', type: 'csat', subjects: [] },
	elementary: { name: '초등학교 ', code: '00010002', type: 'csat', subjects: [] },
	chinese: { name: '중국어', code: '00020000', subjects: [71, 73, 74] },
	japanese: { name: '일본어', code: '00020001', subjects: [76, 75, 78] },
	language: { name: '기타외국어', code: '00020002', subjects: [537, 81, 84] },
	grad: { name: '전문대학원', code: '00030000', subjects: [120, 121, 118] },
	exchange: { name: '편입', code: '00030001', subjects: [125, 123] },
	job: { name: '취업', code: '00040000', subjects: [129, 131, 128, 130] },
	cpa: { name: 'CPA', code: '00040001', subjects: [139, 135, 136, 137, 138] },
	law: { name: '변호사', code: '0004000C', subjects: [4284, 4285, 4286, 4287, 4288, 4289, 4290] },
	estate: { name: '공인중개사', code: '00040002', subjects: [144, 145] },
	tax: { name: '세무사', code: '00040003', subjects: [155, 154, 150, 154] },
	labor: { name: '노무사', code: '00040004', subjects: [159, 160, 164, 161, 165] },
	legal: { name: '법무사', code: '00040005', subjects: [171, 170, 174, 175, 169, 178, 172] },
	appraise: { name: '감정평가사', code: '00040006', subjects: [186, 189, 184, 187] },
	patent: { name: '변리사', code: '00040007', subjects: [190, 183, 192] },
	insurance: { name: '계리사', code: '00040008', subjects: [215, 216, 220, 218] },
	underwrite: { name: '손해사정사', code: '00040009', subjects: [224, 225, 226] },
	customs: { name: '관세사', code: '0004000A', subjects: [231, 232, 233, 234] },
	certificate: { name: '기타자격증', code: '0004000B', subjects: [240] },
	professor: { name: '교수', code: '00080000', type: 'professor', subjects: [] },
	kindergarten: { name: '유치원', code: '00080001', type: 'kindergarten', subjects: [] },
};

const addCacheJob = (token, level, site_type = '', site_name = '', delay = 0) =>
	Cache.add({ token, level, site_type, site_name, _t: format(Date.now(), 'YYYY-MM-DD HH:mm:ss') }, { removeOnComplete: true, removeOnFail: true, delay });

const getFilterIdBySitename = (site_name, sites) => {
	const code = filters[site_name]?.code;
	if (!code) return null;
	return sites.find((site) => site.code === code)?.id;
};

const uploadS3 = async (pathname, json) => {
	console.log(pathname);
	await new Promise((resolve, reject) => mkdirp(path.dirname(pathname), (err) => resolve()));
	await new Promise((resolve, reject) => fs.writeFile(pathname, json, (err) => (err ? reject(err) : resolve())));
	await new Promise((resolve, reject) => {
		const params = {
			Bucket: process.env.AWS_S3_BUCKET,
			Key: process.env.AWS_ACCESS_KEY_ID,
			ACL: 'public-read',
			ContentType: 'application/json',
			CacheControl: 'max-age=300',
			Key: `cache/${path.basename(pathname)}`,
			Body: fs.createReadStream(pathname),
		};
		s3.upload(params, (err, result) => (err ? reject(err) : resolve(result)));
	});
};
const processCache = async (job) => {
	const { level, site_type, site_name, token } = job.data;
	if (level === 0) await processCacheRoot(token);
	else {
		switch (site_type) {
			case 'non-csat':
				await processCacheNoncsatSite(token, site_name);
				break;

			case 'csat':
				await processCacheCsatSite(token, site_name);
				break;

			case 'professor':
				await processCacheProfessorSite(token, site_name);
				break;

			case 'kindergarten':
				await processCacheKindergartenSite(token, site_name);
				break;
		}
	}
};

const processCommon = async (token) => {
	try {
		const [hubs, sites, provinces] = await Promise.all([
			fetchApi(`/filters`, token, { depth: 1, limit: 300 }),
			fetchApi(`/filters`, token, { depth: 2, limit: 300 }),
			fetchApi(`/regions/sub-region`, token, { id: null, limit: 300 }),
		]);
		const pathname = path.resolve(__dirname, '../../tmp/common.json');
		await uploadS3(pathname, JSON.stringify({ hubs, sites, provinces }));
		return { hubs, sites, provinces };
	} catch (err) {
		console.error(err);
	}
};

const processCacheRoot = async (token) => {
	try {
		const [count, liveReviews, hotReviews, infoArticles, talkArticles] = await Promise.all([
			fetchApi(`/statistics/exposure-count`, token, { lv1_id: null }), // count
			fetchApi(`/reviews/main-page/live`, token, {}),
			fetchApi(`/reviews/main-page/now`, token, {}),
			fetchApi(`/boards/main-page/info`, token, {}),
			fetchApi(`/boards/main-page/talk`, token, {}),
		]);
		const pathname = path.resolve(__dirname, '../../tmp/root.json');
		await uploadS3(pathname, JSON.stringify({ count, liveReviews, hotReviews, infoArticles, talkArticles }));
	} catch (err) {
		console.error(err);
	}
};

const processCacheNoncsatSite = async (token, site_name) => {
	const { list: sites } = await fetchApi(`/filters`, token, { depth: 2, limit: 300 });
	const subject_id = filters[site_name].subjects?.[0];
	const lv1_id = getFilterIdBySitename(site_name, sites);
	try {
		const [count, tutorReview, tutorTransferReview, tutorRanks, instituteRanks, infoArticles, pressArticles, qnaArticles, talkArticles, schedules, subjects] = await Promise.all([
			fetchApi(`/statistics/exposure-count`, token, { lv1_id }), // count
			fetchApi(`/reviews/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', review_type: 'tutor', review_attitude_division: 'negative' }), // tutorReview
			fetchApi(`/reviews/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', review_type: 'tutor_change', review_attitude_division: 'negative' }), // tutorTransferReview
			fetchApi(`/statistics/lv1-tutor-rank/${lv1_id}`, token, { subject_id }), // tutorRanks
			fetchApi(`/statistics/lv1-institute-rank/${lv1_id}`, token, { subject_id }), // instituteRanks
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'info' }), // infoArticles
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'press' }), // pressArticles
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'qna' }), // qnaArticles
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'talk' }), // talkArticles
			fetchApi(`/calendar/${lv1_id}`, token, { start_date: format(startOfMonth(Date.now()), 'YYYY-MM-DD'), end_date: format(endOfMonth(Date.now()), 'YYYY-MM-DD') }), // schedules
			fetchApi(`/subjects/list`, token, { filter_id: lv1_id, limit: 300 }), // subjects
		]);
		const pathname = path.resolve(__dirname, `../../tmp/${site_name}.non-csat.json`);
		await uploadS3(pathname, JSON.stringify({ count, tutorReview, tutorTransferReview, tutorRanks, instituteRanks, infoArticles, pressArticles, qnaArticles, talkArticles, schedules, subjects }));
	} catch (err) {
		console.error(err);
	}
};

const processCacheCsatSite = async (token, site_name) => {
	try {
		const { list: sites } = await fetchApi(`/filters`, token, { depth: 2, limit: 300 });
		const subject_id = filters[site_name].subjects[0];
		const lv1_id = getFilterIdBySitename(site_name, sites);
		const [count, csatReview, infoArticles, qnaArticles, schedules] = await Promise.all([
			fetchApi(`/statistics/exposure-count`, token, { lv1_id }), // count
			fetchApi(`/reviews/main-page`, token, { filter_id: lv1_id, page_type: 'csat' }), // csatReview
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'info' }), // infoArticles
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'qna' }), // qnaArticles
			fetchApi(`/calendar/${lv1_id}`, token, { start_date: format(startOfMonth(Date.now()), 'YYYY-MM-DD'), end_date: format(endOfMonth(Date.now()), 'YYYY-MM-DD') }), // schedules
		]);
		const pathname = path.resolve(__dirname, `../../tmp/${site_name}.csat.json`);
		await uploadS3(pathname, JSON.stringify({ count, csatReview, infoArticles, qnaArticles, schedules }));
	} catch (err) {
		console.error(err);
	}
};

const processCacheProfessorSite = async (token, site_name) => {
	try {
		const { list: sites } = await fetchApi(`/filters`, token, { depth: 2, limit: 300 });
		const lv1_id = getFilterIdBySitename(site_name, sites);
		const [count, professorReviews, infoArticles, talkArticles, schedules] = await Promise.all([
			fetchApi(`/statistics/exposure-count`, token, { lv1_id }), // count
			fetchApi(`/reviews/main-page`, token, { filter_id: lv1_id, page_type: 'professor' }), // professorReviews
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'info' }), // infoArticles
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'talk' }), // talkArticles
			fetchApi(`/calendar/${lv1_id}`, token, { start_date: format(startOfMonth(Date.now()), 'YYYY-MM-DD'), end_date: format(endOfMonth(Date.now()), 'YYYY-MM-DD') }), // schedules
		]);
		const pathname = path.resolve(__dirname, `../../tmp/${site_name}.json`);
		await uploadS3(pathname, JSON.stringify({ count, professorReviews, infoArticles, talkArticles, schedules }));
	} catch (err) {
		console.error(err);
	}
};

const processCacheKindergartenSite = async (token, site_name) => {
	try {
		const { list: sites } = await fetchApi(`/filters`, token, { depth: 2, limit: 300 });
		const lv1_id = getFilterIdBySitename(site_name, sites);
		const [count, kindergartenReviews, infoArticles, talkArticles, schedules] = await Promise.all([
			fetchApi(`/statistics/exposure-count`, token, { lv1_id }), // count
			fetchApi(`/reviews/main-page`, token, { filter_id: lv1_id, page_type: 'kindergarten' }), // kindergartenReviews
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'info' }), // infoArticles
			fetchApi(`/boards/main-page`, token, { filter_id: lv1_id, page_type: 'non-csat', board_type: 'talk' }), // talkArticles
			fetchApi(`/calendar/${lv1_id}`, token, { start_date: format(startOfMonth(Date.now()), 'YYYY-MM-DD'), end_date: format(endOfMonth(Date.now()), 'YYYY-MM-DD') }), // schedules
		]);
		const pathname = path.resolve(__dirname, `../../tmp/${site_name}.json`);
		await uploadS3(pathname, JSON.stringify({ count, kindergartenReviews, infoArticles, talkArticles, schedules }));
	} catch (err) {
		console.error(err);
	}
};

const processCacheManager = async () => {
	const token = await fetchToken();
	const { sites } = await processCommon(token);
	await addCacheJob(token, 0, '', '', 5 * 1000);
	await Promise.all(
		Object.keys(filters).map((site_name, i) => {
			const site = filters[site_name];
			const site_type = site.type || 'non-csat';
			return addCacheJob(token, 1, site_type, site_name, (i + 2) * 5 * 1000);
		}),
	);
	await addCacheJob(token, 1, 'non-csat', 'high', 200 * 1000);
};

const emptyCacheManager = async () => {
	await CacheManager.clean(3000);
};

const emptyCache = async () => {
	await Cache.clean(3000);
};

export const runCache = async () => {
	await emptyCacheManager();
	await emptyCache();

	CacheManager.process(processCacheManager);
	Cache.process(processCache);

	CacheManager.add({}, { removeOnComplete: true, removeOnFail: true, repeat: { every: process.env.NODE_ENV === 'production' && !process.env.STAGING ? 10 * 60 * 1000 : 12 * 60 * 60 * 1000 } });
};
