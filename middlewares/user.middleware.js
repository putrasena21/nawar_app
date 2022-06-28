const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { User } = require("../models");

module.exports = {
  // eslint-disable-next-line consistent-return
  checkProfileCompleted: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const user = await User.findOne({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res.unauthorized("User not found");
      }

      if (!user.completed) {
        return res.unauthorized("Please complete your profile first");
      }

      next();
    } catch (err) {
      return res.serverError();
    }
  },
};
