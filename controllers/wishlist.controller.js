const jwt = require("jsonwebtoken");
const { User, Wishlist, Product, ProductImage } = require("../models");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  addWishlist: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const { productId } = req.body;

      const isProductExist = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (!isProductExist) {
        return res.notFound("Product not found");
      }

      if (!productId) {
        return res.badRequest("ProductId is required!");
      }

      const addWishlist = await Wishlist.create({
        userId: decoded.id,
        productId,
      });

      return res.created("Success add product to wishlist", addWishlist);
    } catch (err) {
      return res.serverError(err);
    }
  },

  getWishlist: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("Token is required");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const all = await Wishlist.findAll({
        where: {
          userId: decoded.id,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price"],
            include: [
              {
                model: ProductImage,
                as: "productImages",
                attributes: ["url"],
              },
            ],
          },
        ],
      });

      return res.success("success get all wishlist", all);
    } catch (err) {
      return res.serverError();
    }
  },

  getDetail: async (req, res) => {
    try {
      const { wishlistId } = req.params;

      const detail = await Wishlist.findOne({
        where: {
          id: wishlistId,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price"],
            include: [
              {
                model: ProductImage,
                as: "productImages",
                attributes: ["url"],
              },
            ],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone", "address"],
          },
        ],
      });

      if (!detail) {
        return res.notFound();
      }

      return res.success("success get detail wishlist", detail);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  updateWishlist: async (req, res) => {
    try {
      const wishlistId = req.params.id;
      const { userId, productId } = req.body;

      const isUserExist = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!isUserExist) {
        return res.notFound();
      }

      const query = {
        where: {
          id: wishlistId,
        },
      };

      const updated = await Wishlist.update(
        {
          userId,
          productId,
        },
        query
      );

      return res.success("success change wishlist", updated);
    } catch (err) {
      return res.serverError();
    }
  },

  deleteWishlist: async (req, res) => {
    try {
      const { wishlistId } = req.params;

      const isWishlistExist = await Wishlist.findOne({
        where: {
          id: wishlistId,
        },
      });

      if (!isWishlistExist) {
        return res.notFound();
      }

      const deleted = await Wishlist.destroy({
        where: {
          id: wishlistId,
        },
      });

      return res.success("success delete wishlist", deleted);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
