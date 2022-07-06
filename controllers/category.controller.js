const { Category } = require("../models");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      return res.success("Success Get All Categories", categories);
    } catch (err) {
      return res.serverError();
    }
  },
};
