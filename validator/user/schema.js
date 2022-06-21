const schemaRegis = {
  name: "string|required",
  email: "email|required",
  password: "string|min:8",
};
const schemaProfile = {
  name: "string|required",
  province: "string|required",
  city: "string|required",
  address: "string|required",
  phone: "string|min:10|required",
};

module.exports = { schemaRegis, schemaProfile };
