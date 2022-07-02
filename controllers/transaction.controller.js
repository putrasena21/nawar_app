const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Transaction, User, Product, Notification } = require("../models");

module.exports = {
  // buyer
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

      return res.created("Success create transaction", newTransaction);
    } catch (err) {
      return res.serverError();
    }
  },

  // seller
  rejectTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("You not authorized");
      }
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          {
            model: User,
            as: "buyer",
            attributes: ["id", "name", "email"],
          },
          {
            model: Product,
            as: "productTransactions",
            attributes: ["id", "name", "price", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: decoded.id,
                },
              },
            ],
          },
        ],
      });

      if (!transaction) {
        return res.notFound("Transaction not found");
      }

      if (transaction.status !== "Pending") {
        return res.badRequest("Transaction is not pending");
      }

      await transaction.update({
        status: "Rejected",
      });

      await Notification.create({
        providerId: transaction.id,
        read: false,
        status: "Buyer",
      });

      return res.success("Success reject transaction", transaction);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  // seller
  acceptTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("You not authorized");
      }
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          {
            model: User,
            as: "buyer",
            attributes: ["id", "name", "email"],
          },
          {
            model: Product,
            as: "productTransactions",
            attributes: ["id", "name", "price", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: decoded.id,
                },
              },
            ],
          },
        ],
      });

      if (!transaction) {
        return res.notFound("Transaction not found");
      }

      if (transaction.status !== "Pending") {
        return res.badRequest("Transaction is not pending");
      }

      await transaction.update({
        status: "Accepted",
      });

      await Notification.create({
        providerId: transaction.id,
        read: false,
        status: "Buyer",
      });

      return res.success("Success accept transaction", transaction);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  // seller
  completeTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("You not authorized");
      }
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          {
            model: User,
            as: "buyer",
            attributes: ["id", "name", "email"],
          },
          {
            model: Product,
            as: "productTransactions",
            attributes: ["id", "name", "price", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: decoded.id,
                },
              },
            ],
          },
        ],
      });

      if (!transaction) {
        return res.notFound("Transaction not found");
      }

      if (transaction.status !== "Accepted") {
        return res.badRequest("Transaction is not accepted");
      }

      await Product.update(
        {
          sold: true,
          soldAt: transaction.bidPrice,
        },
        {
          where: {
            id: transaction.productId,
          },
        }
      );

      await transaction.update({
        status: "Completed",
      });

      await Notification.create({
        providerId: transaction.id,
        read: false,
        status: "Buyer",
      });

      const payload = await Transaction.findByPk(transactionId, {
        include: [
          {
            model: User,
            as: "buyer",
            attributes: ["id", "name", "email"],
          },
          {
            model: Product,
            as: "productTransactions",
            attributes: ["id", "name", "price", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: decoded.id,
                },
              },
            ],
          },
        ],
      });

      return res.success("Success complete transaction", payload);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
