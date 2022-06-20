const { User } = require("../models");

const bcryptHelper = require("../helpers/bcrypt.helper");
const validator = require("../validator/user");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExist = await User.findOne({
        where: {
          email,
        },
      });

      if (userExist) {
        return res.conflict(`User with email ${email} already exist`);
      }

      const check = validator.validateRegis(req.body);

      if (check.length) {
        return res.badRequest("Invalid input", check);
      }

      if (!name || !email || !password) {
        return res.badRequest("Name, email, and password is required!");
      }

      const encryptedPassword = await bcryptHelper.hashPassword(password);

      const newUser = await User.create({
        name,
        email,
        password: encryptedPassword,
      });

      return res.success("User created", newUser);
    } catch (err) {
      return res.serverError();
    }
  },
};
