import { getModel, sequelize } from '../../database';
import { Sequelize } from 'sequelize';

const Op = Sequelize.Op;
const MemberFollowTutor = getModel('MemberFollowTutor');
const Member = getModel('Member');
const MemberAttribute = getModel('MemberAttribute');
const MemberFollowInstitute = getModel('MemberFollowInstitute');
const FollowTutorVisitLog = getModel('FollowTutorVisitLog');

/**
 * @description 강사 팔로우 회원 존재 여부 확인
 * @param {Int} memberId
 * @param {Int} tutorId
 */
export const isExistMemberFollowTutor = async (memberId, tutorId) => ((await MemberFollowTutor.count({ where: { member_id: memberId, tutor_id: tutorId } })) > 0 ? true : false); // eslint-disable-line no-unneeded-ternary

// 기관 팔로우 인덱스 존재 여부 확인
export const isExistInstituteFollowId = async (id) => {
	const existNum = await MemberFollowInstitute.count({ where: { id } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

// 강사 팔로우 인덱스 존재 여부 확인
export const isExistTutorFollowId = async (id) => {
	const existNum = await MemberFollowTutor.count({ where: { id } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

/**
 * @description 강사 팔로우 방문 횟수 조회
 * @param {Int} tutorId
 * @param {Int} memberId
 */
export const getFollowTutorVisitLogCount = async (tutorId, memberId) => {
	const response = await FollowTutorVisitLog.count({ where: { tutor_id: tutorId, member_id: memberId } });
	return response;
};

// 강사 팔로우
export const addFollowTutor = async (memberFollowTutor, isGetId = false) => {
	const response = await MemberFollowTutor.create({
		member_id: memberFollowTutor.member_id,
		tutor_id: memberFollowTutor.tutor_id,
		filter_id: memberFollowTutor.filter_id,
		is_confirm: memberFollowTutor.is_confirm,
	});

	// Return
	return isGetId ? response.dataValues.id : response;
};

// 강사 팔로우 삭제
export const deleteFollowTutor = async (memberId, tutorId) => {
	const response = await MemberFollowTutor.destroy({ where: { member_id: memberId, tutor_id: tutorId } });
	return response;
};

// 기관 팔로우
export const addFollowInstitute = async (memberFollowInstitute, isGetId = false) => {
	const response = await MemberFollowInstitute.create({
		member_id: memberFollowInstitute.member_id,
		institute_id: memberFollowInstitute.institute_id,
		filter_id: memberFollowInstitute.filter_id,
		is_confirm: memberFollowInstitute.is_confirm,
	});

	// Return
	return isGetId ? response.dataValues.id : response;
};

// 기관 팔로우 삭제
export const deleteFollowInstitute = async (memberId, instituteId) => {
	const response = await MemberFollowInstitute.destroy({ where: { member_id: memberId, institute_id: instituteId } });
	return response;
};

// 회원의 강사 팔로우 여부 조회
export const isExistTutorFollow = async (tutorId, memberId) => {
	const existNum = await MemberFollowTutor.count({ where: { tutor_id: tutorId, member_id: memberId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

// 회원의 기관 팔로우 여부 조회
export const isExistInstituteFollow = async (instituteId, memberId) => {
	const existNum = await MemberFollowInstitute.count({ where: { institute_id: instituteId, member_id: memberId } });
	// eslint-disable-next-line no-unneeded-ternary
	return existNum > 0 ? true : false;
};

// 강사 팔로워 목록 조회
export const getTutorMemberFollows = async (searchFields, tutorMemberIds, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const member = searchFields.member ? searchFields.member : null;
	const date = searchFields.date ? searchFields.date : null;
	const orderBy = searchFields.order ? searchFields.order : null;
	let response = null;

	const memberAttr = {};
	if (member) {
		if (member.nickname) memberAttr.nickname = { [Op.like]: [`%${member.nickname}%`] };
	}

	const orderAttr = {};
	if (orderBy) {
		if (orderBy.order) orderAttr.order = orderBy.order;
	}

	const sql = {
		where: { tutor_id: { [Op.in]: tutorMemberIds }, created_at: { [Op.gte]: date.start_date, [Op.lt]: date.end_date } },
		include: [
			{
				model: Member,
				as: 'member',
				where: memberAttr,
				attributes: ['id', 'user_id', 'nickname', 'join_site', 'join_type'],
				require: true,
				include: [{ model: MemberAttribute, as: 'attribute', attributes: ['name', 'sex', 'thumbnail'] }],
			},
		],
	};

	// Total
	const total = await MemberFollowTutor.count(sql);
	if (total && total > 0) {
		sql.attributes = ['id', 'filter_id', 'is_confirm', 'created_at', 'visit_count', 'last_visit_at'];
		if (orderBy && orderBy.order) {
			if (orderBy.order === 'max_visit_count')
				sql.order = [
					['visit_count', 'DESC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (orderBy.order === 'min_visit_count')
				sql.order = [
					['visit_count', 'ASC'],
					['created_at', 'DESC'],
					['id', 'DESC'],
				];
			if (orderBy.order === 'sex_man') sql.order = [[sequelize.literal("FIELD( `sex`, 'man', 'woman', 'unknown' )")], ['created_at', 'DESC'], ['id', 'DESC']];
			if (orderBy.order === 'sex_woman') sql.order = [[sequelize.literal("FIELD( `sex`, 'woman', 'man', 'unknown' )")], ['created_at', 'DESC'], ['id', 'DESC']];
			if (orderBy.order === 'last_follow')
				sql.order = [
					['created_at', 'ASC'],
					['id', 'DESC'],
				];
		} else {
			sql.order = [
				['created_at', 'DESC'],
				['id', 'DESC'],
			];
		}

		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);

		// 팔로워 목록 조회
		const followers = await MemberFollowTutor.findAll(sql);
		if (Object.keys(followers).length > 0) response = { total, list: followers };
	}

	// Return
	return response || null;
};

/**
 * @description 강사 팔로우 조회수 로그 작성
 * @param {Array} followTutorVisitLog
 * @param {Boolean} isGetId
 * @param {Transaction} t
 */
export const postFollowTutorVisitLog = async (followTutorVisitLog, isGetId = false, t) => {
	const response = await FollowTutorVisitLog.create({ member_id: followTutorVisitLog.member_id, tutor_id: followTutorVisitLog.tutor_id, login_ip: followTutorVisitLog.login_ip }, { transaction: t });
	// Return
	return isGetId ? response.dataValues.id : response;
};

/**
 * @description 회원 팔로우 강사 조회수 업데이트
 * @param {Array} memberFollowTutor
 * @param {Transaction} t
 */
export const updateMemberFollowTutorVisitCount = async (memberFollowTutor, t) => {
	const response = await MemberFollowTutor.update(
		{ visit_count: sequelize.literal(`visit_count + 1`), last_visit_at: memberFollowTutor.last_visit_at },
		{ where: { member_id: memberFollowTutor.member_id, tutor_id: memberFollowTutor.tutor_id }, transaction: t },
	);
	return response;
};
