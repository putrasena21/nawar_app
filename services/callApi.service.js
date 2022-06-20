const axios = require("axios");

const { URL_CITY_API } = process.env;

module.exports = {
  getProvinces: async () => {
    const url = `${URL_CITY_API}provinces.json`;
    const response = await axios.get(url);
    return response.data;
  },

  getCities: async (provinceId) => {
    const url = `${URL_CITY_API}/regencies/${provinceId}.json`;
    const response = await axios.get(url);
    return response.data;
  },
};
