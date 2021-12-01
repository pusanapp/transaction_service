const express = require('express');
const router = express.Router();

const waybillController = require('../controller/waybill_controller')

router.get('/track/:courier/:waybill', waybillController.trackingOrder)
module.exports = router;
