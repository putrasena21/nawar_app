const bcrypt = require("bcrypt");

const { SALT } = process.env;

module.exports = {
  hashPassword: async (password) => {
    const hashedPassword = await bcrypt.hash(password, parseInt(SALT, 10));

    return hashedPassword;
  },

  checkPassword: async (password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword);

    return result;
  },
};
