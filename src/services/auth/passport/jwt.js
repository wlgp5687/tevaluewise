import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export const jwtStrategy = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('jwt')]),
		secretOrKey: process.env.JWT_SECRET,
		issuer: process.env.JWT_ISSUER
	},
	async (payload, done) => done(null, payload)
);
