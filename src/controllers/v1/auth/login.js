import { throwError } from '../../../services';
import { encodeJwt, getJwtAttributes } from '../../../services/auth/jwt';
import { getModel } from '../../../database';
import { verifyPassword } from '../../../services/auth/login';
import { MemberState } from '../../../enum';

const Member = getModel('member/Member');

export const loginViaLocal = async (req, res) => {
	const { user_id, password } = req.body;
	const member = await Member.findOne({ where: { user_id }, attributes: ['id', 'password'] });
	if (!member) return throwError('invalid username or password', 401);
	if (member.state !== MemberState.NORMAL.value) return throwError(`${MemberState.enumValueOf(member.state).alias} 상태의 회원입니다`, 401);
	const valid = await verifyPassword(password, member.password);
	if (!valid) return throwError('invalid username or password', 401);
	await new Promise((resolve, reject) => req.login(member, err => (err ? reject(err) : resolve())));
	const _id = uuidv5(member.id, uuidv5.DNS);
	const csrf = req.csrfToken();
	const jwt = await encodeJwt({ ...getJwtAttributes(member), _id, csrf });
	return res.json({ jwt, user: member.toJSON() });
};

export const loginViaFacebook = async (req, res) => throwError('not implemented', 501);

export const loginViaNaver = async (req, res) => throwError('not implemented', 501);

export const loginViaKakao = async (req, res) => throwError('not implemented', 501);

export const loginCallbackFacebook = async (req, res) => throwError('not implemented', 501);

export const loginCallbackNaver = async (req, res) => throwError('not implemented', 501);

export const loginCallbackKakao = async (req, res) => throwError('not implemented', 501);

export const logout = async (req, res) => {
	req.logout();
	const { _id, csrf } = res.locals.jwt;
	const jwt = await encodeJwt({ _id, csrf });
	return res.json({ jwt });
};
