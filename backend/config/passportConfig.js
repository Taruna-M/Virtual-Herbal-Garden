const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppError = require('../utils/AppError');

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_DEV_REDIRECT_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        return done(null, profile);
    } catch (err) {
        return (new AppError(err.message, 500), null);
    }
}));

module.exports = passport;