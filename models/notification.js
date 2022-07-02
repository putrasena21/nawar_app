const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.Transaction, {
        foreignKey: "providerId",
        as: "transactions",
      });

      Notification.belongsTo(models.Product, {
        foreignKey: "providerId",
        as: "product",
      });
    }
  }
  Notification.init(
    {
      providerId: DataTypes.INTEGER,
      read: DataTypes.BOOLEAN,
      status: DataTypes.STRING,
      notifDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
