const Validator = require("fastest-validator");

const v = new Validator();

const schema = require("./schema");

module.exports = {
  validateLogin: (payload) => {
    const check = v.validate(payload, schema);

    return check;
  },
};
