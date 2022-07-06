const passport = require("../lib/passport");

module.exports = {
  userAuth: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.unauthorized("Token not provided");
      }
      req.user = user;
      return next();
    })(req, res, next);
  },
};
