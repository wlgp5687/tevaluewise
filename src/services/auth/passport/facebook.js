import { Strategy as FacebookStrategy } from 'passport-facebook';
import { getModel, transaction } from '../../../database';
import { JoinSite } from '../../../enum';
import generatePassword from 'password-generator';

export const facebookStrategy = new FacebookStrategy(
	{
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`
	},
	async (accessToken, refreshToken, profile, done) => {
		const User = getModel('User');
		const GameRecord = getModel('GameRecord');
		const provider = JoinSite.FACEBOOK.value;
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
						photo: (profile.photos && profile.photos[0] && profile.photos[0].value) || null,
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
