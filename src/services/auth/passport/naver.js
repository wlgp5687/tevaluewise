import { Strategy as NaverStrategy } from 'passport-naver';
import { getModel, transaction } from '../../../database';
import { JoinSite } from '../../../enum';
import generatePassword from 'password-generator';

export const naverStrategy = new NaverStrategy(
	{
		clientID: process.env.NAVER_API_KEY,
		clientSecret: process.env.NAVER_SECRET,
		callbackURL: `${process.env.SERVER_URL}/auth/naver/callback`
	},
	async (accessToken, refreshToken, profile, done) => {
		const Member = getModel('member/Member');
		const Attribute = getModel('member/Attribute');
		const provider = JoinSite.NAVER.value;
		const username = profile.id;
		await transaction(async transaction => {
			try {
				const [user, created] = await User.findOrCreate({
					where: {
						provider,
						username
					},
					defaults: {
						provider,
						username,
						password: generatePassword(16, false),
						nickname: profile.displayName,
						photo: (profile._json && profile._json.profile_image) || null,
						email: (profile.emails && profile.emails[0] && profile.emails[0].value) || null
					},
					transaction
				});
				await GameRecord.findOrCreate({
					where: { userId: user.id },
					defaults: { userId: user.id },
					transaction
				});
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		});
	}
);
