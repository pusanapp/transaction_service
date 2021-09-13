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
        shipping_status: 'Dikemas',
        payment_status: 'Dibayar',
        status: 'Barang Sedang Dikemas',
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

const testNotif = async (req,res)=>{
    await pushNotification({total_amount: 500000},6)
    res.send({
        ok: 'ok'
    })
}
module.exports = {
    createTransaction,
    updateTransactionPaymentStatus,
    testNotif
}
