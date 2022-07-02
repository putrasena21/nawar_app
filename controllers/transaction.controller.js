const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Transaction, User, Product, Notification } = require("../models");

module.exports = {
  createTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const { productId } = req.body;

      const price = Number(req.body.price);

      const user = await User.findOne({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res.notFound();
      }

      if (user.completed === false) {
        return res.unauthorized("Completed your profile!");
      }

      const isProductExist = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (!isProductExist) {
        return res.notFound();
      }

      if (!productId || !price) {
        return res.badRequest("productId and price is required");
      }

      const newTransaction = await Transaction.create({
        buyerId: decoded.id,
        productId,
        bidPrice: price,
      });

      await Notification.create({
        providerId: newTransaction.id,
        read: false,
        status: "Bid",
      });

      return res.success("Success create transaction", newTransaction);
    } catch (err) {
      return res.serverError();
    }
  },
};
