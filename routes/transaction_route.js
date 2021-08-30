const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transaction_controller')

router.post('/create/order', transactionController.createTransaction)
router.post('/update/:invoice', transactionController.updateTransactionPaymentStatus)

module.exports = router;
