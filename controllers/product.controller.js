const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Product, ProductImage, ProductCategory, Category } = require("../models");
const Op = require("sequelize").Op;
const { imagekit } = require("../lib/imagekit");
const validator = require("../validator/products");
const pagination = require("../helpers/pagination.helper");

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
      if (categories.length > 1) {
        categories.map(async (element) => {
          await ProductCategory.create({
            productId: newProduct.id,
            categoryId: element,
          });
        });
      } else{
        await ProductCategory.create({
          productId: newProduct.id,
          categoryId: category,
        })
      }

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

  getProductById: async (req, res) => {
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

  getAllProduct: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: ["categories", "productImages"],
      });
      if (!products) {
        return res.notFound("Product not found");
      }
      return res.success("Success get data product!", products);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getAllProductByName: async (req, res) => {
    try {
      const { page, size, name } = req.query;
      const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
      const { limit, offset } = pagination.getPagination(page, size);
      const products = await Product.findAndCountAll({
        where: condition,
        include: ["categories", "productImages"],
        limit,
        offset,
      });
      const { totalPage } = pagination.getPaginationData(page, size, products.count);
      return res.success("Success get data product!", {
        products: products.rows,
        pagination: {
          page,
          size,
          totalPage,
        },
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
        include: ["categories", "productImages"],
      });

      if (!product) {
        return res.notFound("Product not found");
      }

      await product.destroy();
      return res.success("Success delete data product!");
    } catch (err) {
      return res.serverError(err.message);
    }
  }
};
