const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, {
        foreignKey: "userId",
        as: "products",
      });

      User.hasMany(models.Wishlist, {
        foreignKey: "userId",
        as: "user",
      });

      User.hasMany(models.Transaction, {
        foreignKey: "buyerId",
        as: "buyer",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      province: DataTypes.INTEGER,
      city: DataTypes.INTEGER,
      address: DataTypes.TEXT,
      phone: DataTypes.STRING,
      avatar: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
