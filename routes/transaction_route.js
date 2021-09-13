const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transaction_controller')

router.post('/create/order', transactionController.createTransaction)
router.post('/update/:invoice', transactionController.updateTransactionPaymentStatus)
router.get('/all/:customer_id', transactionController.getAllTransactionByUser)
router.post('/test', transactionController.testNotif)

module.exports = router;
