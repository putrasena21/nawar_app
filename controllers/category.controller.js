const { Category } = require("../models");

const { validateCategory } = require("../validator/category");
module.exports = {
    createCategory: async (req, res) => {
        try {
            const {name} = req.body;
            validateCategory(req.body);

            const newCategory = await Category.create({
                name
            })

            return res.created('Success add data category!', newCategory);
        } catch (err) {
            return res.serverError(err.message);
        }
    },

    getAllCategory: async (req, res) => {
        try {
            let categories = await Category.findAll();
            return res.success('Success get all data category!', categories);
        } catch (err) {
            return res.serverError(err.message);
        }
    }
}