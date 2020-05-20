import generatePassword from 'password-generator';
import jwt from 'jsonwebtoken';

export const setAuth = token => request => request.set('x-access-token', token);

export const generatePhone = () => '000' + generatePassword(8, false, /^[0-9]$/);

export const issueToken = async agent => {
	const { body } = await agent.get('/v1/auth/jwt/token');
	should(body.token).be.String();
	return body.token;
};

export const requestSms = number => async (agent, token) => {
	const { body: phone } = await setAuth(token)(agent.post('/v1/sms/verify').send({ phone: number }));
	const { data } = jwt.decode(phone.token);
	should(phone.token).be.String();
	should(data.sms_verify.code).be.String();
	return [phone.token, data.sms_verify.code];
};

export const verifySms = code => async (agent, token) => {
	const { body: phone } = await setAuth(token)(agent.get(`/v1/sms/verify?code=${code}`));
	should(phone.token).be.String();
	return phone.token;
};

export const login = (user_id, password) => async (agent, token) => {
	const { body: member } = await setAuth(token)(agent.post('/v1/members/login').send({ user_id, password }));
	should(member.token).be.String();
	return member.token;
};

export const signup = (email, password, nickname) => async (agent, token) => {
	const number = generatePhone();
	const [smsToken, code] = await requestSms(number)(agent, token);
	const verifiedToken = await verifySms(code)(agent, smsToken);
	const sex = Math.random() > 0.5 ? 'man' : 'woman';
	const { body: member } = await setAuth(verifiedToken)(
		agent.post('/v1/members/join').send({ user_id: email, password, nickname, join_type: 'student', name: nickname, sex, birthday: '1970-01-01', email, phone: number })
	);
	should(member.token).be.String();
	return member.token;
};

export const isErrorStatus = res => {
	if (res.status < 400) throw new Error('not an error status');
};
