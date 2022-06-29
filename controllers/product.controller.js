const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Op } = require("sequelize");
const {
  Product,
  ProductImage,
  ProductCategory,
  Category,
} = require("../models");
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
        publised: true,
      });

      const categories = category;
      if (categories.length > 1) {
        categories.map(async (element) => {
          await ProductCategory.create({
            productId: newProduct.id,
            categoryId: element,
          });
        });
      } else {
        await ProductCategory.create({
          productId: newProduct.id,
          categoryId: category,
        });
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

  createProductNoPublish: async (req, res) => {
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
        publised: false,
      });

      const categories = category;
      if (categories.length > 1) {
        categories.map(async (element) => {
          await ProductCategory.create({
            productId: newProduct.id,
            categoryId: element,
          });
        });
      } else {
        await ProductCategory.create({
          productId: newProduct.id,
          categoryId: category,
        });
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

  publishProduct: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const { productId } = req.params;

      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (product.userId !== decoded.id) {
        return res.unauthorized("You are not authorized");
      }

      if (!product) {
        return res.notFound("Product not found");
      }

      await product.update({
        published: true,
      });

      return res.ok("Success publish product!");
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getAllproductByUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const perPage = 10;
      const { page } = req.query;

      const products = await Product.findAndCountAll({
        where: {
          userId: decoded.id,
        },
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductCategory,
            as: "productCategories",
            attributes: ["categoryId"],
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      const result = {
        totalItem: products.count,
        data: products.rows,
        totalPages: Math.ceil(products.count / perPage),
        previosusPage: `${req.protocol}:${req.get("host")}${req.baseUrl}${
          req.path
        }?page=${parseInt(page, 10) - 1}`,
        currentPage: parseInt(page, 10),
        nextPage: `${req.protocol}:${req.get("host")}${req.baseUrl}${
          req.path
        }?page=${parseInt(page, 10) + 1}`,
      };

      if (result.totalPages < page) {
        return res.notFound("Product not found");
      }

      if (result.totalPages === result.currentPage) {
        result.nextPage = null;
      }

      if (result.currentPage === 1) {
        result.previosusPage = null;
      }

      return res.success("Success get data product!", result);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          {
            model: ProductCategory,
            as: "productCategories",
            attributes: ["categoryId"],
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
        ],
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
        include: [
          {
            model: ProductCategory,
            as: "productCategories",
            attributes: ["categoryId"],
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
        ],
      });
      if (!products) {
        return res.notFound("Product not found");
      }
      return res.success("Success get data product!", products);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getAllProductPagination: async (req, res) => {
    try {
      const perPage = 10;
      const { page } = req.query;

      const products = await Product.findAndCountAll({
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductCategory,
            as: "productCategories",
            attributes: ["categoryId"],
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      const result = {
        totalItem: products.count,
        data: products.rows,
        totalPages: Math.ceil(products.count / perPage),
        previosusPage: `${req.protocol}:${req.get("host")}${req.baseUrl}${
          req.path
        }?page=${parseInt(page, 10) - 1}`,
        currentPage: parseInt(page, 10),
        nextPage: `${req.protocol}:${req.get("host")}${req.baseUrl}${
          req.path
        }?page=${parseInt(page, 10) + 1}`,
      };

      if (result.totalPages < page) {
        return res.notFound("Product not found");
      }

      if (result.totalPages === result.currentPage) {
        result.nextPage = null;
      }

      if (result.currentPage === 1) {
        result.previosusPage = null;
      }

      return res.success("Success get data product!", result);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const product = await Product.findOne({
        where: {
          id: productId,
        },
        include: [
          {
            model: ProductCategory,
            as: "productCategories",
            attributes: ["categoryId"],
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      if (decoded.id !== product.userId) {
        return res.unauthorized(
          "You are not authorized to delete this product"
        );
      }

      if (!product) {
        return res.notFound("Product not found");
      }

      await product.destroy();
      return res.success("Success delete data product!");
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
