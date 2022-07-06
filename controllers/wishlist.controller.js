const {
  User,
  Wishlist,
  Product,
  Category,
  ProductImage,
  ProductCategory,
} = require("../models");

module.exports = {
  addWishlist: async (req, res) => {
    try {
      const { productId } = req.body;

      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.notFound("Product not found");
      }

      if (!productId) {
        return res.badRequest("ProductId is required!");
      }

      const ownedProduct = await Product.findOne({
        where: {
          id: productId,
        },
        include: [
          {
            model: User,
            as: "seller",
            where: {
              id: req.user.id,
            },
          },
        ],
      });

      if (ownedProduct) {
        return res.unauthorized(`You cant wishlist your own product`);
      }

      const wishlist = await Wishlist.findOne({
        where: {
          productId,
          userId: req.user.id,
        },
      });

      if (wishlist) {
        return res.conflict("This product already on your wishlist");
      }

      const addWishlist = await Wishlist.create({
        userId: req.user.id,
        productId,
      });

      return res.created("Success add product to wishlist", addWishlist);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findAll({
        where: {
          userId: req.user.id,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "description"],
            include: [
              {
                model: ProductImage,
                as: "productImages",
                attributes: ["url"],
              },
              {
                model: ProductCategory,
                as: "productCategories",
                attributes: ["id"],
                include: [
                  {
                    model: Category,
                    as: "category",
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.success("Success get all wishlist", wishlist);
    } catch (err) {
      return res.serverError();
    }
  },

  getDetail: async (req, res) => {
    try {
      const { wishlistId } = req.params;

      const wishlist = await Wishlist.findOne({
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
              {
                model: ProductCategory,
                as: "productCategories",
                attributes: ["id"],
                include: [
                  {
                    model: Category,
                    as: "category",
                    attributes: ["name"],
                  },
                ],
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

      if (!wishlist) {
        return res.notFound();
      }

      if (wishlist.userId !== req.user.id) {
        return res.unauthorized("You not authorized");
      }

      return res.success("Success get detail wishlist", wishlist);
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

      return res.success("Success change wishlist", updated);
    } catch (err) {
      return res.serverError();
    }
  },

  deleteWishlist: async (req, res) => {
    try {
      const { wishlistId } = req.params;

      const wishlist = await Wishlist.findOne({
        where: {
          id: wishlistId,
        },
      });

      if (!wishlist) {
        return res.notFound();
      }

      if (req.user.id !== wishlist.userId) {
        return res.unauthorized("You not authorized");
      }

      await Wishlist.destroy({
        where: {
          id: wishlistId,
        },
      });

      return res.success("Success delete wishlist", null);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
