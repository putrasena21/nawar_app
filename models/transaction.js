'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey: 'id_user',
        as:'buyer'
      });

      Transaction.belongsTo(models.Product, {
        foreignKey: 'id_product',
        as: 'product'
      });
    }
  }
  Transaction.init({
    id_user: DataTypes.INTEGER,
    id_product: DataTypes.INTEGER,
    price: DataTypes.BIGINT,
    approved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};