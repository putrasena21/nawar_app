const sequelize = require("sequelize");

const { Op } = sequelize;
const { Transaction, User, Product, Notification } = require("../models");

module.exports = {
  getAllNotificationSeller: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: {
          status: {
            [Op.or]: ["Bid", "Published"],
          },
          receiverId: req.user.id,
        },
      });

      const populatedNotif = notifications.map(
        async ({ dataValues: notification }) => {
          if (notification.status === "Published") {
            const product = await Product.findByPk(notification.providerId, {
              include: [
                {
                  model: User,
                  as: "seller",
                  attributes: ["id", "name", "email", "phone"],
                  where: {
                    id: req.user.id,
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
                {
                  model: Product,
                  as: "productTransactions",
                  attributes: ["name", "price"],
                  where: {
                    userId: req.user.id,
                  },
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

  getAllNotificationBuyer: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: {
          status: "Buyer",
          receiverId: req.user.id,
        },
        include: [
          {
            model: Transaction,
            as: "transactions",
            attributes: ["id", "status", "bidPrice"],
            include: [
              {
                model: Product,
                as: "productTransactions",
                attributes: ["name", "price", "description"],
                include: [
                  {
                    model: User,
                    as: "seller",
                    attributes: ["id", "name", "phone"],
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.success("Success get notification", notifications);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          receiverId: req.user.id,
        },
        include: [
          {
            model: Transaction,
            as: "transactions",
            attributes: ["bidPrice", "status"],
            include: [
              {
                model: User,
                as: "buyer",
                attributes: ["id", "name", "address", "phone"],
              },
              {
                model: Product,
                as: "productTransactions",
                attributes: ["name", "price", "description"],
                include: [
                  {
                    model: User,
                    as: "seller",
                    attributes: ["id", "name", "address", "phone"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!notification) {
        return res.notFound("Notification not found");
      }

      await Notification.update(
        {
          read: true,
        },
        {
          where: {
            id: notificationId,
          },
        }
      );

      return res.success("Success get notification", notification);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
