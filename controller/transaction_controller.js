const model = require('../models/index')
const Transaction = model.app_transaction;
const TProduct = model.transaction_product;
const axios = require('axios')
const paymentUrl = require('../util/payment_url').paymentUrl
const {pushNotification} = require('../util/push_notification')
const createTransaction = async (req, res) =>{
    const data = req.body.data
    const products = req.body.products

    await Transaction.create(data).then(async (result) => {
        products.map(async (product)=>{
            product.transaction_id = result.id
            product.invoice_number = result.invoice_number
            console.log(product)
            TProduct.create(product).catch(err=>{
                res.send({err: 'TProduct err, '+err.message})
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
            const {data: response} = await axios.post('http://127.0.0.1:4001/api/v1/midtrans/create/charge/transaction',paymentPayload)
            console.log(response)
            res.send({
                status: true,
                message: 'transaction created',
                data: response.data
            })
        }catch (e) {
            res.send({err: 'Create VA err, '+e.message})

        }
        res.send({
            ok: 'ok'
        })
    }).catch(err=>{
        res.send({err: 'Transaction err, '+err.message})
    })

}

const updateTransactionPaymentStatus = async (req, res) => {
    const invoice = req.params.invoice
    await Transaction.update({
        shipping_status: 'Barang Sedang Dikemas',
        payment_status: 'DIBAYAR',
        status: 'PAID ORDER',
    },{
        where: {
            invoice_number: invoice
        }
    }).then(async (rowUpdate)=>{
        if(rowUpdate>0){
            const finalTransaction = await Transaction.findOne({
                where: {
                    invoice_number: invoice
                }
            })
            await pushNotification(finalTransaction,finalTransaction.customer_id)
            res.send({
                status: true,
                message: 'transaction Updated Success'
            })
        }
        res.send({
            status: true,
            message: 'transaction Updated Failed'
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllTransactionByUser = async (req,res) => {
    const customerId = req.params.customer_id;
    await Transaction.findAll({
        where: {
            customer_id:customerId
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By User',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllTransaction = async (req,res) => {
    await Transaction.findAll({
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllOnProcessTransaction= async (req,res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'ON PROCESS'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllNewTransaction= async (req,res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'NEW ORDER'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllDoneTransaction = async (req,res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'DONE'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllPaidTransaction = async (req,res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'PAID ORDER'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By payment status',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllOnDeliveryOrder = async (req,res) => {
    const status = req.params.status;
    await Transaction.findAll({
        where: {
            status: 'ON DELIVERY'
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By payment status',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}

const getAllDoneTransactionByUser = async (req,res) => {
    const customerId = req.params.customer_id;
    await Transaction.findAll({
        where: {
            status: 'DONE',
            customer_id:customerId
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            }
        ]
    }).then(data=>{
        res.send({
            status: true,
            message: 'get All Transaction By Status',
            data: data,
        })
    }).catch(err=>{
        res.send({err: 'Update err, '+err.message})
    })
}



const testNotif = async (req,res)=>{
    await pushNotification({total_amount: 500000},6)
    res.send({
        ok: 'ok'
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
    getAllDoneTransactionByUser
}
