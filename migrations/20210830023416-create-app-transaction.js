'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('app_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_number: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      customer_name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      payment_method: {
        type: Sequelize.STRING
      },
      shipping_cost: {
        type: Sequelize.INTEGER
      },
      administrative_cost: {
        type: Sequelize.INTEGER
      },
      total_amount: {
        type: Sequelize.INTEGER
      },
      shipping_expedition: {
        type: Sequelize.STRING
      },
      shipping_weight: {
        type: Sequelize.FLOAT
      },
      shipping_number: {
        type: Sequelize.STRING
      },
      shipping_status: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.TEXT
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('app_transactions');
  }
};
