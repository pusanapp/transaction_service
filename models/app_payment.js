'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class app_payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.app_transaction,{
        foreignKey: 'transaction_id',
        as: 'app_transaction'
      })
    }
  };
  app_payment.init({
    transaction_id: DataTypes.INTEGER,
    invoice_number: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_number: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    expiration_date: DataTypes.DATE,
    midtrans_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'app_payment',
  });
  return app_payment;
};
