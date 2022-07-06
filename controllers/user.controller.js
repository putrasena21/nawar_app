const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { User } = require("../models");
const { imagekit } = require("../helpers/imagekit.helper");

const bcryptHelper = require("../helpers/bcrypt.helper");
const validator = require("../validator/user");
const callApi = require("../services/callApi.service");

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

      return res.created("User created", newUser);
    } catch (err) {
      return res.serverError();
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.user.id,
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
      const { name, province, city, address, phone } = req.body;

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
          province: parseInt(province, 10),
          city: parseInt(city, 10),
          address,
          phone,
          avatar: uploadAvatar.url,
          completed: true,
        },
        { where: { id: req.user.id } }
      );

      return res.success("User updated", updateProfile);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getProvinces: async (req, res) => {
    try {
      const provinces = await callApi.getProvinces();

      return res.success("Provinces found", provinces);
    } catch (err) {
      return res.serverError();
    }
  },

  getCities: async (req, res) => {
    try {
      const { provinceId } = req.params;

      const cities = await callApi.getCities(provinceId);

      return res.success("Cities found", cities);
    } catch (err) {
      return res.serverError();
    }
  },
};
