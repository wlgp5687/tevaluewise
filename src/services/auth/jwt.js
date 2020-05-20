import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import { throwError } from '..';

import * as tutorComponent from '../../component/tutor/tutor';

export const getJwtToken = (req) => req.headers['x-access-token'] || req.cookies.token || req.query.token;

// Decode Token
export const decodeToken = async (token = null, isUseExpiredTime = true) => {
	if (!token) throwError('JsonWebTokenError', 400);

	let decodedToken = null;

	if (isUseExpiredTime) {
		const tmpToken = jwt.decode(token);
		const tmpTime = Math.floor(+new Date() / 1000);
		if (parseInt(tmpTime, 10) >= parseInt(tmpToken.exp, 10)) throwError('jwt expired', 400);
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	} else {
		decodedToken = jwt.decode(token);
	}

	return decodedToken;
};

// Generate Uuid
export const generateUuid = async () => {
	return uuidv4();
};

// Generate Payload
export const generatePayload = async (data = {}, uuidData = null, csrf = null) => {
	// Uuid 가 존재 하지 않는 경우 추가 생성
	const uuid = !uuidData ? await generateUuid() : uuidData;
	const payload = { uuid, csrf, data };
	return payload;
};

// Encode Token
export const encodeToken = async (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXP_TIME,
				issuer: process.env.JWT_ISSUER,
			},
			(err, token) => (err ? reject(err) : resolve(token)),
		);
	});
};

// generate Token
export const generateToken = async (prevToken = null, csrf, data = {}, isSave = true) => {
	let uuid = null;

	// 기존 Token 이 존재하는 경우 uuid 유지
	if (prevToken) {
		const decodedToken = await decodeToken(prevToken, false);
		uuid = decodedToken.uuid;
	}

	// Payload 생성
	const payload = await generatePayload(data, uuid, csrf);

	// Token 생성
	const token = await encodeToken(payload);

	// Token 저장
	if (isSave) {
		/**
		 * TODO Redis 에 저장하는 부분이 추가적으로 필요합니다.
		 * uuid 를 키로 하여 Token 의 저장이 필요로 합니다.
		 */
	}

	// Return
	return { token, decoded_token: await decodeToken(token, false) };
};

// return time
export const hrTime = async (type) => {
	let response = null;
	const hrTime = process.hrtime(); // eslint-disable-line
	switch (type) {
		case 'milli':
			response = hrTime[0] * 1000 + hrTime[1] / 1000000;
			break;
		case 'micro':
			response = hrTime[0] * 1000000 + hrTime[1] / 1000;
			break;
		case 'nano':
			response = hrTime[0] * 1000000000 + hrTime[1];
			break;
		default:
			response = now('nano'); // eslint-disable-line
			break;
	}
	return response;
};

// Refresh Token
export const refreshToken = async (csrf = null, prevToken = null, data = {}, isRewrite = false, isSave = true) => {
	const decodedToken = await decodeToken(prevToken);

	if (Object.keys(decodedToken.data).length > 0) {
		let tutor = null;
		const memberId = decodedToken.member ? decodedToken.member.id : null;
		if (memberId) {
			const tutorMember = await tutorComponent.getTutorIdsByMemberId(memberId); // eslint-disable-line no-case-declarations
			if (Object.keys(tutorMember).length > 0) {
				const cafeTutor = await tutorComponent.getCafeIdByTutorId(tutorMember[0]);
				tutor = cafeTutor ? { tutor_id: tutorMember[0], cafe_id: cafeTutor.dataValues.cafe_id } : { tutor_id: tutorMember[0], cafe_id: null };
			}
			decodedToken.data.member.tutor = tutor;
		}
	} else {
		decodedToken.data = {};
	}
	decodedToken.data = isRewrite ? data : Object.assign(decodedToken.data, data);

	const payload = await generatePayload(decodedToken.data, decodedToken.uuid, csrf || decodedToken.csrf);
	const token = await encodeToken(payload);

	if (isSave) {
		/**
		 * TODO Redis 에 저장하는 부분이 추가적으로 필요합니다.
		 * uuid 를 키로 하여 Token 의 저장이 필요로 합니다.
		 */
	}

	// Response
	return { token };
};
