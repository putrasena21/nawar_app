const schemaRegis = {
  name: "string",
  email: "email",
  password: "string|min:8",
};
const schemaProfile = {
  name: "string",
  city: "string",
  address: "string",
  phone: "string|min:10",
};

module.exports = { schemaRegis, schemaProfile };
