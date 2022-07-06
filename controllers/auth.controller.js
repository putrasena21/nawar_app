const jwt = require("jsonwebtoken");
const { User } = require("../models");

const { JWT_SECRET_KEY } = process.env;

const bcryptHelper = require("../helpers/bcrypt.helper");
const validator = require("../validator/authentication");
const regisValidator = require("../validator/regis.auth");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const check = validator.validateLogin(req.body);

      if (check.length) {
        return res.badRequest("Invalid input");
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.notFound(`User with email ${email} not exist`);
      }

      const passwordValid = await bcryptHelper.checkPassword(
        password,
        user.password
      );
      if (!passwordValid) {
        return res.badRequest("Wrong password!");
      }

      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "7d" });

      return res.success("Login success", { token });
    } catch (err) {
      return res.serverError();
    }
  },
};
