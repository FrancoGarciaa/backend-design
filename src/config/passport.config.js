import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user.model.js';
import { cookieExtractor } from '../utils/cookieExtractor.js';

const JWT_SECRET = 'secretJWT123';

const jwtOptions = {
jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
secretOrKey: JWT_SECRET
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
try {
    const user = await UserModel.findById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
} catch (error) {
    return done(error, false);
}
}));

passport.use('current', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
try {
    const user = await UserModel.findById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
} catch (error) {
    return done(error, false);
}
}));

export const initializePassport = () => {
passport.initialize();
};