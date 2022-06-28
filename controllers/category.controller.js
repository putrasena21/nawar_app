const { Category } = require("../models");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
