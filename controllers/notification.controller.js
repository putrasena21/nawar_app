const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
const { Transaction, User, Product, Notification } = require("../models");

module.exports = {
  getAllNotification: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const notifications = await Notification.findAll();

      const populatedNotif = notifications.map(
        async ({ dataValues: notification }) => {
          if (notification.status === "Published") {
            const product = await Product.findByPk(notification.providerId, {
              include: [
                {
                  model: User,
                  as: "seller",
                  attributes: ["name", "email", "phone"],
                  where: {
                    id: decoded.id,
                  },
                },
              ],
            });
            return {
              ...notification,
              product,
            };
          }

          const transaction = await Transaction.findByPk(
            notification.providerId,
            {
              include: [
                {
                  model: User,
                  as: "buyer",
                  attributes: ["id", "name", "email", "phone"],
                },
              ],
            }
          );
          return {
            ...notification,
            transaction,
          };
        }
      );

      const result = await Promise.all(populatedNotif);
      return res.success("Success get notification", result);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.unauthorized("Token is required!");
      }

      const { notificationId } = req.params;
      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const notification = await Notification.findByPk(notificationId);

      if (notification.status === "Published") {
        const product = await Product.findByPk(notification.providerId, {
          attributes: ["id", "name", "price", "description"],
          include: [
            {
              model: User,
              as: "seller",
              attributes: ["name", "email", "phone"],
              where: {
                id: decoded.id,
              },
            },
          ],
        });
        return res.success("Success get notification", product);
      }

      const transaction = await Transaction.findByPk(notification.providerId, {
        attributes: ["id", "bidPrice", "status"],
        include: [
          {
            model: User,
            as: "buyer",
            attributes: ["id", "name", "email", "phone"],
          },
        ],
      });

      return res.success("Success get notification", transaction);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
