const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};
passport.use(
  new JwtStrategy(options, async (payload, done) => {
    User.findByPk(payload.id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  })
);
module.exports = passport;
