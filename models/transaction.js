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
        foreignKey: "userId",
        as: "buyer",
      });

      Transaction.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      price: DataTypes.BIGINT,
      approved: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
