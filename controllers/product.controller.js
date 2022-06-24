const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Product, ProductImage, ProductCategory } = require("../models");
const { imagekit } = require("../lib/imagekit");
const validator = require("../validator/products");

module.exports = {
  createProduct: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const { name, price, description, category } = req.body;

      const check = validator.validateProduct(req.body);
      if (check.length) {
        return res.badRequest("Invalid input", check);
      }

      const newProduct = await Product.create({
        name,
        price,
        description,
        userId: decoded.id,
      });

      const categories = category;
      categories.map(async (element) => {
        await ProductCategory.create({
          productId: newProduct.id,
          categoryId: element,
        });
      });

      req.files.map(async (file) => {
        const imageUrl = file.buffer.toString("base64");
        const fileName = `${Date.now()}-${file.originalname}`;
        const uploadImage = await imagekit.upload({
          file: imageUrl,
          fileName,
        });

        const image = await ProductImage.create({
          productId: newProduct.id,
          image: fileName,
          url: uploadImage.url,
        });
        return image;
      });

      return res.created("Success add data product!", newProduct);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
  getProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
        include: ["categories", "productImages"],
      });

      if (!product) {
        return res.notFound("Product not found");
      }

      return res.success("Success get data product!", product);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  deleteProduct: async (req,res) => {
    try{
      const {id} = req.params.id;

      let deleted = await Product.destroy({
        where: {
          id
        }
      });

      return res.success('success deleted product!', deleted)

    }catch(err){
      return res.serverError(err.message);
    }
  }
};
