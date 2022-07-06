const Sequelize = require("sequelize");

const { Op } = Sequelize;
const {
  Product,
  ProductImage,
  ProductCategory,
  Category,
  Notification,
} = require("../models");
const { imagekit } = require("../lib/imagekit");

const validator = require("../validator/products");

module.exports = {
  createProduct: async (req, res) => {
    try {
      const { name, price, description, category } = req.body;

      // parse price to number
      const priceNumber = parseFloat(price);

      const data = {
        name,
        price: priceNumber,
        description,
        category,
      };

      const check = validator.validateProduct(data);
      if (check.length) {
        return res.badRequest("Invalid input", check);
      }

      const newProduct = await Product.create({
        name,
        price: priceNumber,
        description,
        userId: req.user.id,
        published: true,
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

      await Notification.create({
        providerId: newProduct.id,
        receiverId: req.user.id,
        read: false,
        status: "Published",
      });

      return res.created("Success add data product!", newProduct);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  createProductNoPublish: async (req, res) => {
    try {
      const { name, price, description, category } = req.body;

      // parse price to number
      const priceNumber = parseFloat(price);

      const data = {
        name,
        price: priceNumber,
        description,
        category,
      };

      const check = validator.validateProduct(data);
      if (check.length) {
        return res.badRequest("Invalid input", check);
      }

      const newProduct = await Product.create({
        name,
        price: priceNumber,
        description,
        userId: req.user.id,
        published: false,
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
      const { productId } = req.params;

      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (product.userId !== req.user.id) {
        return res.unauthorized("You are not authorized");
      }

      if (!product) {
        return res.notFound("Product not found");
      }

      const updated = await product.update({
        published: true,
      });

      await Notification.create({
        providerId: product.id,
        receiverId: req.user.id,
        read: false,
        status: "Published",
      });

      return res.success("Success publish product!", updated);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  // for seller page
  getAllProductByUser: async (req, res) => {
    try {
      const perPage = 10;
      const { page = 1 } = req.query;

      const products = await Product.findAndCountAll({
        where: {
          userId: req.user.id,
        },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      return res.status(200).json({
        success: true,
        message: "Success get all data product",
        list: result,
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getAllProductPagination: async (req, res) => {
    try {
      const perPage = 10;
      const { page = 1, name } = req.query;
      const condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

      const products = await Product.findAndCountAll({
        where: { published: true, ...condition },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
        ],
        order: [["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      return res.status(200).json({
        success: true,
        message: "Success get all data product",
        list: result,
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  // for home page
  getAllProductPublished: async (req, res) => {
    try {
      const perPage = 10;
      const { page = 1, name } = req.query;
      const condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

      const products = await Product.findAndCountAll({
        where: { published: true, sold: false, ...condition },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
        ],
        order: [["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      return res.status(200).json({
        success: true,
        message: "Success get all data product",
        list: result,
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  // for seller page
  getAllProductUnpublished: async (req, res) => {
    try {
      const perPage = 10;
      const { page = 1 } = req.query;

      const products = await Product.findAndCountAll({
        where: {
          userId: req.user.id,
          published: false,
        },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      return res.status(200).json({
        success: true,
        message: "Success get all data product",
        list: result,
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getProductById: async (req, res) => {
    try {
      const perPage = 10;
      const { page = 1 } = req.query;
      const { productId } = req.params;
      const products = await Product.findAndCountAll({
        where: {
          id: productId,
        },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
        ],
        order: [["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      const { page = 1 } = req.query;
      const { categoryId } = req.params;

      const products = await Product.findAndCountAll({
        where: { published: true, sold: false },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
                where: { id: categoryId },
              },
            ],
          },
        ],
        order: [["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      return res.status(200).json({
        success: true,
        message: "Success get all data product",
        list: result,
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getAllProductSoldByUser: async (req, res) => {
    try {
      const perPage = 10;
      const { page = 1 } = req.query;

      const products = await Product.findAndCountAll({
        where: { published: true, sold: true, userId: req.user.id },
        distinct: true,
        limit: perPage,
        offset: perPage * (page - 1),
        include: [
          {
            model: ProductImage,
            as: "productImages",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
        ],
        order: [["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

      return res.status(200).json({
        success: true,
        message: "Success get all data product",
        list: result,
      });
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (product.userId !== req.user.id) {
        return res.unauthorized("You are not authorized");
      }

      const { name, price, description, category } = req.body;

      const check = validator.validateProduct(req.body);
      if (check.length) {
        return res.badRequest("Invalid input", check);
      }

      const updateProduct = await Product.update(
        {
          name,
          price,
          description,
        },
        {
          where: {
            id: productId,
          },
        }
      );

      if (!updateProduct) {
        return res.notFound("Product not found");
      }

      await ProductCategory.destroy({
        where: {
          productId,
        },
      });

      const categories = category;
      if (categories.length > 1) {
        categories.map(async (element) => {
          await ProductCategory.create({
            productId: product.id,
            categoryId: element,
          });
        });
      } else {
        await ProductCategory.create({
          productId: product.id,
          categoryId: category,
        });
      }

      const payload = {
        id: productId,
        name,
        price,
        description,
        category,
      };

      return res.success("Success update product!", payload);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const { productId } = req.params;

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

      await ProductCategory.destroy({
        where: {
          productId,
        },
      });

      await ProductImage.destroy({
        where: {
          productId,
        },
      });

      if (!product) {
        return res.notFound("Product not found");
      }

      if (req.user.id !== product.userId) {
        return res.unauthorized(
          "You are not authorized to delete this product"
        );
      }

      await product.destroy();
      return res.success("Success delete data product!");
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
