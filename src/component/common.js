// 현재 일시 반환
export const nowDateTime = async () => {
	const date = new Date();
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 날짜 형태 반환
export const getDateFormat = async (input) => {
	const response = `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()}`;
	return response;
};

// 이전 날짜 반환
export const getLastDate = async (input) => {
	const date = new Date();
	const dayOfMonth = date.getDate();
	date.setDate(dayOfMonth - parseInt(input, 10));
	const response = await getDateFormat(date);
	return response;
};

// 날짜 형태 반환
export const getDateTimeFormat = async (input) => {
	const date = new Date(input);
	date.setDate(date.getDate() + 1);
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 입력받은 날짜에 일자를 추가하여 반환
export const getDatePlusDate = async (input, plusDate) => {
	const date = new Date(input);
	date.setDate(date.getDate() + plusDate);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 현재 날짜 + n일 일자 반환
export const nowDatePlusDate = async (input) => {
	const date = new Date();
	date.setDate(date.getDate() + parseInt(input, 10));
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 자릿수 정렬
export const digitsSort = async (nParam, width) => {
	let n = nParam;
	n += '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

// 숫자만 반환
export const returnNumberOnly = async (value) => {
	return value.replace(/[^\d]/gi, '');
};

// return Offset
export const getOffset = async (page, limit) => {
	const offset = (parseInt(page, 10) - parseInt(1, 10)) * limit;
	return offset < 0 ? 0 : offset;
};

// 이메일 형태 확인
export const isValidEmail = (value) => (decodeURIComponent(value).match(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i) ? true : false); // eslint-disable-line

// 랜덤 숫자 반환
export const getRandomInteger = async (min, max) => {
	return Math.floor(Math.random() * (max - min - 1)) + min;
};

// 리뷰 유효일자 반환
export const getReviewExpireTime = async () => {
	const date = new Date();
	date.setDate(date.getDate() + parseInt(process.env.REVIEW_AUTH_EXPIRE_DATE, 10));
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 입력받은 길이를 기준으로 자릿수 반환
export const getLengthByCritertiaNumber = async (input, critertiaNumber) => {
	const data = input.toString();
	const dataDigit = data.length;
	return parseInt(dataDigit, 10) / parseInt(critertiaNumber, 10);
};

// 전달받은 Array 를 구분자를 추가하여 반환
export const returnArrayToStringAddDelimiter = async (arrayItem, delimiter) => {
	let returnString = '';
	for (let i = 0; i < arrayItem.length; i += 1) returnString = i !== parseInt(arrayItem.length, 10) - parseInt(1, 10) ? `${returnString + arrayItem[i] + delimiter} ` : returnString + arrayItem[i];
	// Return
	return returnString;
};

// 전달받은 Array 의 공통을 반환
export const returnCommonArray = async (firstArray, secondArray) => {
	const commonArray = [];
	for (let i = 0; i < secondArray.length; i += 1)
		if (firstArray.includes(parseInt(secondArray[i], 10)) && !commonArray.includes(parseInt(secondArray[i], 10))) commonArray.push(parseInt(secondArray[i], 10));
	// Return
	return Object.keys(commonArray).length > 0 ? commonArray : null;
};

/**
 * @description 수를 나누어 반환
 * @param {Int} dividend
 * @param {Int} divisor
 * @param {Boolean} useDecimal
 */
export const divideNumber = async (dividend, divisor, useDecimal) => {
	let response = 0;
	if (dividend && dividend !== 0 && divisor && divisor !== 0)
		response = useDecimal ? (parseInt(dividend, 10) / parseInt(divisor, 10)) * parseInt(10000, 10) : parseInt(dividend, 10) / parseInt(divisor, 10);
	return parseInt(response, 10);
};

// 검색 페이지 공무원 직렬 검색 필터
export const getSearchPageGongSerialFilter = async (filterId) => {
	let response = null;
	if (filterId === '317') {
		// 행정직
		response = [
			{ code: '4334|4353', name: '일반행정직' },
			{ code: '4335|4354', name: '선거행정직' },
			{ code: '4336|4355', name: '교육행정직' },
			{ code: '4339|4356|4347', name: '회계직' },
			{ code: '4348|4358', name: '관세직' },
			{ code: '4340|4359', name: '통계직' },
			{ code: '4350|4360', name: '감사직' },
			{ code: '4341|4361', name: '교정직' },
			{ code: '4342|4362', name: '보호직' },
			{ code: '4607|4608', name: '계리직' },
			{ code: '4345|4364', name: '출입국관리직' },
			{ code: '4351|4367', name: '사회복지직' },
			{ code: '4343|4363', name: '검찰직' },
			{ code: '4344|4365', name: '마약수사직' },
			{ code: '4349', name: '사서직' },
			{ code: '4605', name: '방호직' },
			{ code: '4337', name: '고용노동직' },
			{ code: '4338', name: '직업상담직' },
			{ code: '4346', name: '철도경찰직' },
			{ code: '4357', name: '세무직' },
			{ code: '4366', name: '외무영사직' },
			{ code: '4415', name: '국회직' },
		];
	} else if (filterId === '353') {
		// 기술직
		response = [
			{ code: '4369|4388', name: '일반기계직' },
			{ code: '4370|4389', name: '전기직' },
			{ code: '4371|4390', name: '화공직' },
			{ code: '4372|4391', name: '농업직' },
			{ code: '4373|4392', name: '임업직' },
			{ code: '4374|4393', name: '토목직' },
			{ code: '4375|4397', name: '축산직' },
			{ code: '4376|4398', name: '보건직' },
			{ code: '4377|4399', name: '식품위생직' },
			{ code: '4378|4400', name: '환경직' },
			{ code: '4379|4394', name: '건축직' },
			{ code: '4381|4395', name: '전산직' },
			{ code: '4380|4401', name: '지적직' },
			{ code: '4382|4396', name: '전송기술직' },
			{ code: '4612|4613', name: '산림자원직' },
			{ code: '4383', name: '방재안전직' },
			{ code: '4384', name: '정보보호직' },
			{ code: '4385', name: '녹지직' },
			{ code: '4386', name: '해양수산직' },
			{ code: '4409', name: '기상직' },
			{ code: '4606', name: '운전직' },
			{ code: '4609', name: '일반선박직' },
			{ code: '4417', name: '간호직' },
			{ code: '4614', name: '보건진료직' },
		];
	} else if (filterId === '475') {
		// 5급
		response = [
			{ code: '4423', name: '일반행정직' },
			{ code: '4424', name: '인사조직' },
			{ code: '4425', name: '법무행정직' },
			{ code: '4426', name: '재경직' },
			{ code: '4427', name: '국제통상직' },
			{ code: '4428', name: '교육행정직' },
			{ code: '4429', name: '사회복지직' },
			{ code: '4430', name: '보호직' },
			{ code: '4431', name: '검찰직' },
			{ code: '4432', name: '출입국관리직' },
			{ code: '4433', name: '일반기계직' },
			{ code: '4434', name: '전기직' },
			{ code: '4435', name: '화공직' },
			{ code: '4436', name: '농업직' },
			{ code: '4437', name: '임업직' },
			{ code: '4438', name: '환경직' },
			{ code: '4439', name: '해양수산직' },
			{ code: '4440', name: '기상직' },
			{ code: '4441', name: '일반토목직' },
			{ code: '4442', name: '건축직' },
			{ code: '4443', name: '전산개발직' },
			{ code: '4444', name: '정보보호직' },
			{ code: '4445', name: '방송통신직' },
			{ code: '4446', name: '방재안전직' },
			{ code: '4449', name: '사서직' },
			{ code: '4450', name: '법제' },
			{ code: '4447', name: '법원사무' },
			{ code: '4448', name: '등기사무' },
			{ code: '4451', name: '일반외교' },
			{ code: '4452', name: '지역외교' },
			{ code: '4453', name: '외교전문' },
		];
	}
	return Object.keys(response) ? response : null;
};

// filterId 에 따른 사이트 경로 반환
export const getSitePathByFilterId = async (filterId) => {
	let response = null;
	switch (filterId) {
		case 2:
			response = 'testenglish';
			break;
		case 7:
			response = 'abroad';
			break;
		case 16:
			response = 'speaking';
			break;
		case 20:
			response = 'english';
			break;
		case 25:
			response = 'high';
			break;
		case 53:
			response = 'middle';
			break;
		case 66:
			response = 'elementary';
			break;
		case 80:
			response = 'chinese';
			break;
		case 85:
			response = 'japanese';
			break;
		case 92:
			response = 'language';
			break;
		case 132:
			response = 'grad';
			break;
		case 137:
			response = 'exchange';
			break;
		case 145:
			response = 'job';
			break;
		case 153:
			response = 'cpa';
			break;
		case 163:
			response = 'estate';
			break;
		case 170:
			response = 'tax';
			break;
		case 184:
			response = 'labor';
			break;
		case 195:
			response = 'legal';
			break;
		case 210:
			response = 'appraise';
			break;
		case 218:
			response = 'patent';
			break;
		case 244:
			response = 'insurance';
			break;
		case 254:
			response = 'underwrite';
			break;
		case 266:
			response = 'customs';
			break;
		case 274:
			response = 'certificate';
			break;
		case 289:
			response = 'teacher1';
			break;
		case 294:
			response = 'teacher2';
			break;
		case 313:
			response = 'gong3';
			break;
		case 317:
			response = 'gong1';
			break;
		case 353:
			response = 'gong2';
			break;
		case 449:
			response = 'police';
			break;
		case 462:
			response = 'fire';
			break;
		case 475:
			response = 'gosi';
			break;
		case 617:
			response = 'professor';
			break;
		case 4402:
			response = 'law';
			break;
		case 4403:
			response = 'kindergarten';
			break;
		default:
			break;
	}
	// Return
	return response;
};
