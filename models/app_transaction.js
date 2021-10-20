'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class app_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.transaction_product,{
        foreignKey: 'transaction_id',
        as: 'transaction_product'
      })
      this.hasOne(models.app_payment, {
        foreignKey: 'transaction_id',
        as: 'app_payment'
      })
    }
  };
  app_transaction.init({
    invoice_number: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    customer_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.TEXT,
    payment_method: DataTypes.STRING,
    shipping_cost: DataTypes.INTEGER,
    administrative_cost: DataTypes.INTEGER,
    total_amount: DataTypes.INTEGER,
    shipping_expedition_service: DataTypes.STRING,
    shipping_expedition_code: DataTypes.STRING,
    shipping_number: DataTypes.STRING,
    shipping_weight: DataTypes.FLOAT,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    status: DataTypes.STRING,
    note: DataTypes.TEXT,
    payment_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'app_transaction',
  });
  return app_transaction;
};
