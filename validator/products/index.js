const Validator = require("fastest-validator");

const v = new Validator();

const schema = require("./schema");

module.exports = {
  validateProduct: (payload) => {
    const check = v.validate(payload, schema);
    if (check.length) {
      return check;
    }
    return check;
  },
};
