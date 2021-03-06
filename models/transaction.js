const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: "buyerId",
        as: "buyer",
      });

      Transaction.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "productTransactions",
      });

      Transaction.hasOne(models.Notification, {
        foreignKey: "providerId",
        as: "notification",
      });
    }
  }
  Transaction.init(
    {
      buyerId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      bidPrice: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
