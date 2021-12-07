const model = require('../models/index')
const Transaction = model.app_transaction;
const TProduct = model.transaction_product;
const Barang = model.e_barang;
const Product = model.app_product;
const TrcConfirmation = model.trc_done_confirmation;
const axios = require('axios')
const paymentUrl = require('../util/payment_url').paymentUrl
const {pushNotification, pushNotificationWeb, pushNotificationDone} = require('../util/push_notification')
const createTransaction = async (req, res) => {
    const data = req.body.data
    const products = req.body.products

    await Transaction.create(data).then(async (result) => {
        products.map(async (product) => {
            product.transaction_id = result.id
            product.invoice_number = result.invoice_number
            console.log(product)
            await TProduct.create(product).then(async (tp) => {
                const currentProduct = await Product.findOne({
                    where: {
                        id: tp.product_id
                    }
                })
                console.log(currentProduct.barang_id)
                await Barang.increment('stock', {by: -(tp.product_qty), where: {pid: currentProduct.barang_id}})

            })
        })
        const paymentPayload = {
            "transaction_id": result.id,
            "order_id": result.invoice_number,
            "payment_method": data.payment_method.toLowerCase(),
            "name": data.customer_name,
            "amount": data.total_amount
        }
        try {
            console.log(paymentPayload)
            const {data: response} = await axios.post(`${paymentUrl.paymentService}/api/v1/midtrans/create/charge/transaction`, paymentPayload)
            console.log(response)
            res.send({
                status: true,
                message: 'transaction created',
                data: response.data
            })
        } catch (e) {
            res.send({err: 'Create VA err, ' + e.message})

        }
        res.send({
            ok: 'ok'
        })
    }).catch(err => {
        res.send({err: 'Transaction err, ' + err.message})
    })

}

const updateTransactionPaymentStatus = async (req, res) => {
    const invoice = req.params.invoice
    await Transaction.update({
        shipping_status: 'Menunggu Konfirmasi',
        payment_status: 'DIBAYAR',
        status: 'PAID ORDER',
        payment_date: new Date()
    }, {
        where: {
            invoice_number: invoice
        }
    }).then(async (rowUpdate) => {
        if (rowUpdate > 0) {
            const finalTransaction = await Transaction.findOne({
                where: {
                    invoice_number: invoice
                }
            })
            await pushNotification(finalTransaction, finalTransaction.customer_id)
            await pushNotificationWeb(finalTransaction)
            return res.send({
                status: true,
                message: 'transaction Updated Success'
            })
        }
        res.send({
            status: true,
            message: 'transaction Updated Failed'
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllTransactionByUser = async (req, res) => {
    const customerId = req.params.customer_id;
    await Transaction.findAll({
        where: {
            customer_id: customerId
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By User',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllTransaction = async (req, res) => {
    await Transaction.findAll({
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllOnProcessTransaction = async (req, res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'ON PROCESS'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllNewTransaction = async (req, res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'NEW ORDER'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllDoneTransaction = async (req, res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'DONE'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllPaidTransaction = async (req, res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'PAID ORDER'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By payment status',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllOnDeliveryOrder = async (req, res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'ON DELIVERY'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By payment status',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const getAllDoneTransactionByUser = async (req, res) => {
    const customerId = req.params.customer_id;
    await Transaction.findAll({
        where: {
            status: 'DONE',
            customer_id: customerId
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(data => {
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const testNotif = async (req, res) => {
    await pushNotification({total_amount: 500000}, 6)
    res.send({
        ok: 'ok'
    })
}

const confirmOrder = async (req, res) => {
    const data = {
        shipping_status: 'Barang Sedang Dikemas',
        status: 'ON PROCESS'
    }
    const id = req.params.id;
    await Transaction.update(data, {
        where: {
            id: id
        }
    }).then((row) => {
        if (row > 0) {
            res.send({
                status: true,
                message: 'confirm order Success'
            })
        } else {
            res.send({
                status: false,
                message: 'confirm order Failed'
            })
        }
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}
const cancelOrder = async (req, res) => {
    const data = {
        shipping_status: null,
        status: 'CANCEL'
    }
    const id = req.params.id;
    const tProduct = await TProduct.findAll({
        where: {
            transaction_id: id
        }
    })
    await Transaction.update(data, {
        where: {
            id: id
        }
    }).then(async (row) => {
        if (row > 0) {
            tProduct.map(async (tp) => {
                await Product.findOne({
                    where: {
                        id: tp.product_id
                    }
                }).then(async (product) => {
                    await Barang.increment('stock', {by: +(tp.product_qty), where: {pid: product.barang_id}})
                })
            })
            await res.send({
                status: true,
                message: 'Cancel order Success'
            })
        } else {
            res.send({
                status: false,
                message: 'Cancel order Failed'
            })
        }
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const inputShippingNumber = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    data.shipping_status = 'Barang Dalam Pengiriman'
    data.status = 'ON DELIVERY'
    await Transaction.update(data, {
        where: {
            id: id
        }
    }).then(async (row) => {
        if (row > 0) {
            await res.send({
                status: true,
                message: 'Input Shipping Number Success'
            })
        } else {
            res.send({
                status: false,
                message: 'Input Shipping Number Failed'
            })
        }
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

const doneConfirmationOrder = async (req, res) => {
    const {status, user} = req.body;
    const {id} = req.params;
    const trx = await Transaction.findOne({
        where: {
            id: id
        }
    })
    let count = await TrcConfirmation.count({
        where: {
            transaction_id: id
        }
    })

    const data = {
        transaction_id: trx.id,
        invoice: trx.invoice_number,
        status: status ? status : 'complete',
        remark: status ? status : 'complete',
        user: user
    }
    console.log(data)
    if (count < 2) {
        // res.send(
        //     {
        //         ok: 'ok',
        //         count: count
        //     }
        // )
        await TrcConfirmation.create(data).then(async (result) => {
            count = await TrcConfirmation.count({
                where: {
                    transaction_id: id
                }
            })
            console.log(count)
            if(count===2){
                const doneData = {
                    shipping_status: 'Pesanan Selesai',
                    status: 'DONE'
                }
                const id = req.params.id;
                await Transaction.update(doneData, {
                    where: {
                        id: id
                    }
                })
                return res.send({
                    status: false,
                    count: 'confirmation done'
                })
            }
            return res.send({
                status: false,
                count: 'confirmation ok'
            })
        })
    } else {
        return res.send({
            status: false,
            message: 'failed, you has confirm this order'
        })
    }


}
const completeOrder = async (req, res) => {
    const data = {
        shipping_status: 'Pesanan Selesai',
        status: 'DONE'
    }
    const id = req.params.id;
    await Transaction.update(data, {
        where: {
            id: id
        }
    }).then(async (row) => {
        if (row > 0) {
            // const finalTransaction = await Transaction.findOne({
            //     where: {
            //         id: id
            //     }
            // })
            // await pushNotificationDone(finalTransaction, finalTransaction.customer_id)
            //update sold product
            res.send({
                status: true,
                message: 'complete order Success'
            })
        } else {
            res.send({
                status: false,
                message: 'complete order Failed'
            })
        }
    }).catch(err => {
        res.send({err: 'Update err, ' + err.message})
    })
}

module.exports = {
    createTransaction,
    updateTransactionPaymentStatus,
    testNotif,
    getAllTransactionByUser,
    getAllTransaction,
    getAllOnProcessTransaction,
    getAllDoneTransaction,
    getAllNewTransaction,
    getAllPaidTransaction,
    getAllOnDeliveryOrder,
    getAllDoneTransactionByUser,
    confirmOrder,
    cancelOrder,
    inputShippingNumber,
    completeOrder,
    doneConfirmationOrder
}
