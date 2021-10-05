const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transaction_controller')

router.post('/create/order', transactionController.createTransaction)
router.post('/update/:invoice', transactionController.updateTransactionPaymentStatus)
router.get('/all/customer/:customer_id', transactionController.getAllTransactionByUser)
router.get('/new/all', transactionController.getAllNewTransaction)
router.get('/done/all', transactionController.getAllDoneTransaction)
router.get('/done/all/customer/:customer_id', transactionController.getAllDoneTransactionByUser)
router.get('/on-process/all', transactionController.getAllOnProcessTransaction)
router.get('/on-delivery/all', transactionController.getAllOnDeliveryOrder)
router.get('/paid/all', transactionController.getAllPaidTransaction)
router.get('/all', transactionController.getAllTransaction)
router.post('/test', transactionController.testNotif)

router.post('/cancel/order/:id', transactionController.cancelOrder)
router.post('/confirm/order/:id', transactionController.confirmOrder)
router.post('/complete/order/:id', transactionController.completeOrder)
router.post('/input-resi/order/:id', transactionController.inputShippingNumber)

module.exports = router;
