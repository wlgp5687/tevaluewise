// ########## 공통 ##########

// token 받기
export const getToken = async (request) => {
	const res = await request.get('/v1/auth/jwt/token');
	expect(typeof res.body.token).toBe('string');
	return res.body;
};

// 관리자 로그인 토큰 받기
export const adminLogin = async (request, token) => {
	const sendBody = { user_id: process.env.ADMIN_USER_ID, password: process.env.ADMIN_PASSWORD };

	const res = await request
		.post('/v1/admins/admins/login')
		.set({ 'csrf-token': token.decoded_token.csrf, 'x-access-token': token.token })
		.send(sendBody);
	expect(typeof res.body.token).toBe('string');
	return res.body;
};

// 일반 회원 로그인 토큰 받기
export const siteLogin = async (request, token, member) => {
	const sendBody = { user_id: member.user_id, password: member.password };
	const res = await request
		.post(`/v1/members/login`)
		.set({ 'csrf-token': token.decoded_token.csrf, 'x-access-token': token.token })
		.send(sendBody);
	expect(typeof res.body.token).toEqual('string');
	return res.body;
};

// 날짜 형식 검사
export const dateFormatCheck = (date) => (date.match(/^\d{4}-\d{2}-\d{2}$/) ? true : false);

// 목록 조회 시 total, limit, page 검사
export const listAttrTypeCheck = async (attributes) => {
	for (let i = 0; i < attributes.length; i += 1) expect(typeof attributes[i]).toBe('number');
	return;
};

// 'Y', 'N' ,'UNKNOWN' agreement 검사
export const unknownCheck = (agreement) => ['Y', 'N', 'UNKNOWN'].includes(agreement);

// 'Y', 'N' agreement 검사
export const agreementCheck = (agreement) => ['Y', 'N'].includes(agreement);

// 'Y', 'N', 'REQUEST', 'BLIND' 검사
export const confirmCheck = (confirm) => ['REQUEST', 'Y', 'N', 'BLIND', 'request'].includes(confirm);

// 'man' , 'woman', 'unknown' 검사
export const sexCheck = (sex) => ['man', 'woman', 'unknown'].includes(sex);

// major filter 검사
export const isExistLvFilter = (major) =>
	[2, 7, 16, 20, 25, 53, 66, 80, 85, 92, 132, 137, 145, 153, 163, 170, 184, 195, 210, 218, 244, 254, 266, 274, 289, 294, 313, 317, 353, 449, 462, 475, 617, 4402, 4403].includes(major);

// has 검사
export const hasCheck = (hasOnline) => ['Y', 'N', null].includes(hasOnline);

// 현재 일시 반환
export const nowDateTime = async () => {
	const date = new Date();
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// ########## Member ##########

// join_site 검사
export const joinSiteCheck = (joinSite) => ['naver', 'kakao', 'facebook', 'site', 'internal'].includes(joinSite);

// join_type 검사
export const joinTypeCheck = (joinType) => ['student', 'parent', 'institute', 'tutor'].includes(joinType);

// 기관 type 검사
export const instituteTypeCheck = (instituteType) => ['institute', 'university', 'kindergarten', 'daycare'].includes(instituteType);

// 제제 상태 검사
export const banStatusCheck = (banStatus) => ['ban', 'clear'].includes(banStatus);

// ########## Review ##########

// review_questions answer 타입 검사
export const answerTypeCheck = (type) => ['point', 'text', 'choice', 'year', 'region'].includes(type);

// review_questions text answer 타입 검사
export const textAnserTypeCheck = (type) => ['advantage', 'defect', 'title', 'unknown'].includes(type);

// review_questions pentagon 검사
export const pentagonCheck = (pentagon) =>
	[
		'unknown',
		'recommendation',
		'materials',
		'students_communication',
		'humor_immersion',
		'improve_grade_hit_rate',
		'facility',
		'study_environment',
		'school_expenses',
		'difficulty',
		'test_frequency',
		'plan_agreement',
		'meeting_rate',
		'kindergarten_principal',
		'kindergarten_teacher',
		'safe',
		'time_adjustment',
	].includes(pentagon);

// 리뷰 타입 검사
export const reviewTypeCheck = (type) => ['tutor', 'institute', 'tutor_change', 'institute_change'].includes(type);

// 지역 타입 검사
export const regionTypeCheck = (type) => ['province', 'city', 'town'].includes(type);

// ########## Board ##########
// 게시판 종류 검사
export const boardConfigIdCheck = (id) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(id);

// 게시판 상태 검사
export const boardBlameStatusCheck = (status) => ['NORMAL', 'ACCEPT', 'BLIND', 'DELETED'].includes(status);

// 질문 답변 상태 검사
export const answerStatusCheck = (status) => ['pause', 'completion'].includes(status);

// faq 카테고리 검사
export const faqCategoryCheck = (category) => ['starteacher', 'member', 'service'].includes(category);

// info 카테고리 검사
export const infoCategoryCheck = (category) => ['basic', 'tip', 'news'].includes(category);

// 수강 유형 검사
export const lectureTypeCheck = (type) => ['offline', 'online', 'english_tel'].includes(type);

// 초등 유아임용 하위 구분 검사
export const appointmentSubTypeCheck = (type) => ['element', 'kindergarten', 'special_infant', 'special_element', 'librarian', 'health'].includes(type);

// 지역 검사
export const appointmentLocalRegion = (region) =>
	['seoul', 'gyeonggi', 'incheon', 'sejong', 'daejeon', 'daegu', 'gwangju', 'busan', 'ulsan', 'gangwon', 'chungbuk', 'chungnam', 'gyeongbuk', 'gyeongnam', 'jeonbuk', 'jeonnam', 'jeju'].includes(
		region,
	);

// 공무원 소속 지역
export const gongLocalRegion = (region) => ['state', 'seoul', 'local'].includes(region);

// 파일 타입 검사
export const fileTypeCheck = (type) => ['attache', 'content', 'thumbnail'].includes(type);

// ########## Cafe ##########\
// 카페 타입 검사
export const cafeTypeCheck = (type) => ['tutor', 'institute'].includes(type);

// 유치원 설립 유형 검사
export const establishTypeCheck = (type) => ['public', 'corporate', 'home', 'private', 'english', 'etc'].includes(type);

// 유치원 상태 검사
export const instituteStatusCheck = (type) => ['normal', 'lack', 'english', 'closing'].includes(type);
