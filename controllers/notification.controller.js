const sequelize = require("sequelize");

const { Op } = sequelize;
const {
  Transaction,
  User,
  Product,
  Notification,
  ProductImage,
} = require("../models");

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
                {
                  model: ProductImage,
                  as: "productImages",
                  attributes: ["url"],
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
                  attributes: ["id", "name", "price", "size", "description"],
                  where: {
                    userId: req.user.id,
                  },
                  include: [
                    {
                      model: ProductImage,
                      as: "productImages",
                      attributes: ["url"],
                    },
                  ],
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
                attributes: ["id", "name", "price", "size", "description"],
                include: [
                  {
                    model: User,
                    as: "seller",
                    attributes: ["id", "name", "phone"],
                  },
                  {
                    model: ProductImage,
                    as: "productImages",
                    attributes: ["url"],
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
            attributes: ["id", "bidPrice", "status"],
            include: [
              {
                model: User,
                as: "buyer",
                attributes: ["id", "name", "address", "phone"],
              },
              {
                model: Product,
                as: "productTransactions",
                attributes: ["id", "name", "price", "size", "description"],
                include: [
                  {
                    model: User,
                    as: "seller",
                    attributes: ["id", "name", "address", "phone"],
                  },
                  {
                    model: ProductImage,
                    as: "productImages",
                    attributes: ["url"],
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
