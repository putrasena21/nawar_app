const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;

const { User } = require("../models");

const bcryptHelper = require("../helpers/bcrypt.helper");
const validator = require("../validator/user");

const { imagekit } = require("../helpers/imagekit.helper");

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

  getProfile: async (req, res) => {
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

      const payload = {
        id: user.id,
        name: user.name,
        city: user.city,
        address: user.address,
        phone: user.phone,
        avatar: user.avatar,
      };

      return res.success("User found", payload);
    } catch (err) {
      return res.serverError();
    }
  },

  updateProfile: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const { name, city, address, phone } = req.body;

      const check = validator.validateProfile(req.body);

      if (check.length) {
        return res.badRequest("Invalid input", check);
      }

      const avatar = req.file.buffer.toString("base64");
      const fileName = `avatar - ${req.file.originalname}`;

      const uploadAvatar = await imagekit.upload({
        file: avatar,
        fileName,
      });

      const updateProfile = await User.update(
        {
          name,
          city,
          address,
          phone,
          avatar: uploadAvatar.url,
        },
        { where: { id: decoded.id } }
      );

      return res.success("User updated", updateProfile);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
