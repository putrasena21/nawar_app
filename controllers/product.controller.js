const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Product,
  ProductImage,
  ProductCategory,
  Category,
} = require("../models");
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

  getProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: {exclude : ['id', 'createdAt', 'updatedAt']},
          },
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
        ], attributes: {exclude : ['createdAt', 'updatedAt']},
      });

      if (!product) {
        return res.notFound("Product not found");
      }
      return res.success("Success get data product!", product);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getAllProductPagination: async (req, res) => {
    try {
      const perPage = 10;
      const { page=1 , name } = req.query;
      const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
      const products = await Product.findAndCountAll({
        where:
          condition,
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
        ], attributes: {exclude :['updatedAt', 'createdAt']}
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

  getAllProductByCategory: async (req, res) => {
    try {
      const perPage = 10;
      const { page=1} = req.query;
      const { categoryId } = req.params;
      const products = await Category.findAndCountAll({
        where: {id : categoryId},
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductCategory,
            as: "productCategories",
            attributes: ["categoryId"],
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["name", "price", "description"],
                include: [
                  {                  
                      model: ProductImage,
                      as: "productImages",
                      attributes: {exclude : ['id', 'createdAt', 'updatedAt']
                      },
                  },
                ],
              },
            ],
          },
        ], attributes: {exclude :['updatedAt', 'createdAt']}
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
