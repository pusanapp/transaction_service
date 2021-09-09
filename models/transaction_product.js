'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transaction_product.init({
    transaction_id: DataTypes.INTEGER,
    invoice_number: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_code:DataTypes.STRING,
    product_price:DataTypes.INTEGER,
    product_qty:DataTypes.INTEGER,
    total:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction_product',
  });
  return transaction_product;
};