const { Transaction, User, Product, Notification } = require("../models");

module.exports = {
  // buyer
  createTransaction: async (req, res) => {
    try {
      const { productId, bidPrice } = req.body;

      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.notFound();
      }

      if (!productId || !bidPrice) {
        return res.badRequest("Product id and bid price is required");
      }

      if (product.userId === req.user.id) {
        return res.unauthorized("You cant bid your own product");
      }

      const newTransaction = await Transaction.create({
        buyerId: req.user.id,
        productId,
        bidPrice: parseInt(bidPrice, 10),
      });

      await Notification.create({
        providerId: newTransaction.id,
        receiverId: product.userId,
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
            attributes: ["id", "name", "price", "size", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: req.user.id,
                },
              },
            ],
          },
        ],
      });

      if (!transaction) {
        return res.notFound("Transaction not found");
      }

      if (transaction.productTransactions.seller.id !== req.user.id) {
        return res.unauthorized("You not the seller");
      }

      if (
        transaction.status !== "Accepted" &&
        transaction.status !== "Pending"
      ) {
        return res.badRequest("Transaction is not pending or accepted");
      }

      if (transaction.productTransactions === null) {
        return res.unauthorized("You not authorized");
      }

      await transaction.update({
        status: "Rejected",
      });

      await Notification.create({
        providerId: transaction.id,
        receiverId: transaction.buyerId,
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
            attributes: ["id", "name", "price", "size", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: req.user.id,
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

      if (transaction.productTransactions === null) {
        return res.unauthorized("You not authorized");
      }

      if (transaction.productTransactions.seller.id !== req.user.id) {
        return res.unauthorized("You not the seller");
      }

      await transaction.update({
        status: "Accepted",
      });

      await Notification.create({
        providerId: transaction.id,
        receiverId: transaction.buyerId,
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
            attributes: ["id", "name", "price", "size", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: req.user.id,
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

      if (transaction.productTransactions === null) {
        return res.unauthorized("You not authorized");
      }

      if (transaction.productTransactions.seller.id !== req.user.id) {
        return res.unauthorized("You not the seller");
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
        receiverId: transaction.buyerId,
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
            attributes: ["id", "name", "price", "size", "sold", "soldAt"],
            include: [
              {
                model: User,
                as: "seller",
                attributes: ["id", "name", "email"],
                where: {
                  id: req.user.id,
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
