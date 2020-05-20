import passport from 'passport';
import { getModel, transaction } from '../../../database';
// import { facebookStrategy } from './facebook';
// import { googleStrategy } from './google';
// import { naverStrategy } from './naver';
import { jwtStrategy } from './jwt';

// passport.use(facebookStrategy);
// passport.use(googleStrategy);
// passport.use(naverStrategy);
passport.use(jwtStrategy);

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (user_id, done) => {
	const Member = getModel('member/Member');
	const Attribute = getModel('member/Attribute');
	try {
		const user = await Member.findOne({ where: { user_id }, include: [{ model: Attribute, as: 'attribute' }] });
		if (!user) throw new Error('user does not exist');
		return done(null, user.toJSON());
	} catch (err) {
		return done(err);
	}
});

export default passport;
