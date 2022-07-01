const { Model } = require("sequelize");
const products = require("../validator/products");

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

      Product.belongsToMany(models.Category, {
        through: "ProductCategory",
        foreignKey: "productId",
        as: "categories",
      });

      Product.hasMany(models.Wishlist, {
        foreignKey: 'id_product',
        as: 'produk'
      });

      Product.hasMany(models.Transaction, {
        foreignKey: 'id_product',
        as: 'product'
      });

    }
  }
  Product.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      publish: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
