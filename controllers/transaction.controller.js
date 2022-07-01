const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Transaction, User, Product } = require("../models");

module.exports = {
  createTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const { productId, price, approved } = req.body;

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
        userId: decoded.id,
        productId,
        price,
        approved: null,
      });

      return res.success("Success create transaction", newTransaction);
    } catch (err) {
      return res.serverError();
    }
  },

  getAllTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const all = await Transaction.findAll({
        where: {
          userId: decoded.id,
        },
      });

      return res.success("Success retreived all transactions", all);
    } catch (err) {
      return res.serverError();
    }
  },

  getDetailTransaction: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const { transactionId } = req.params;
      const data = await Transaction.findOne({
        where: {
          id: transactionId,
        },
        include: ["product", "buyer"],
      });

      if (!data) {
        return res.notFound("transaction doesnt exist");
      }

      const detailTransaction = {
        userId: decoded.id,
        productId: data.productId,
        price: data.price,
        approved: data.approved,
        product: data.product,
        buyer: data.buyer,
      };

      return res.success("Success get detail transaction", detailTransaction);
    } catch (err) {
      return res.serverError();
    }
  },

  history: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const data = await Transaction.findAll({
        where: {
          userId: decoded.id,
        },
        include: ["product"],
      });

      return res.success("Succes get your transaction history!", data);
    } catch (err) {
      return res.serverError();
    }
  },
};
