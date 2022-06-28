const Validator = require("fastest-validator");

const v = new Validator();

const { schemaRegis, schemaProfile } = require("./schema");

module.exports = {
  validateRegis: (payload) => {
    const check = v.validate(payload, schemaRegis);

    return check;
  },

  validateProfile: (payload) => {
    const check = v.validate(payload, schemaProfile);

    return check;
  },
};
