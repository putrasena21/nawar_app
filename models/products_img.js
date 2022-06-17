'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products_Img extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products_Img.belongsTo(models.Products, {foreignKey: 'products_id', as: 'product'});
    }
  }
  Products_Img.init({
    products_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products_Img',
  });
  return Products_Img;
};