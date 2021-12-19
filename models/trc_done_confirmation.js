'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trc_done_confirmation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.app_transaction, {
        foreignKey: 'transaction_id',
        as: 'app_transaction'
      })
    }
  };
  trc_done_confirmation.init({
    transaction_id: DataTypes.INTEGER,
    invoice: DataTypes.STRING,
    status: DataTypes.STRING,
    remark: DataTypes.STRING,
    user: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: 'trc_done_confirmation',
  });
  return trc_done_confirmation;
};