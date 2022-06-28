const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
        as: "productImages",
      });

      Product.hasMany(models.ProductCategory, {
        foreignKey: "productId",
        as: "productCategories",
      });
    }
  }
  Product.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
