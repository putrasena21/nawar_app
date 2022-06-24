'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.User, {
        foreignKey: "id_user",
        as: "user"
      });

      Wishlist.belongsTo(models.Product, {
        foreignKey: 'id_product',
        as : 'product'
      })
    }
  }
  Wishlist.init({
    id_user: DataTypes.BIGINT,
    id_product: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};