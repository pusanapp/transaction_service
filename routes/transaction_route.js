const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transaction_controller')

router.post('/create/order', transactionController.createTransaction)
router.post('/update/:invoice', transactionController.updateTransactionPaymentStatus)
router.get('/all/customer/:customer_id', transactionController.getAllTransactionByUser)
router.get('/new/all', transactionController.getAllNewTransaction)
router.get('/done/all', transactionController.getAllDoneTransaction)
router.get('/on-process/all', transactionController.getAllOnProcessTransaction)
router.get('/all', transactionController.getAllTransaction)
router.post('/test', transactionController.testNotif)

module.exports = router;
