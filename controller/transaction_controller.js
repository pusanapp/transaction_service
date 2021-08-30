const model = require('../models/index')
const Transaction = model.app_transaction;
const TProduct = model.transaction_product;
const axios = require('axios')
const paymentUrl = require('../util/payment_url').paymentUrl
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
        const paymentPayload = (data.payment_method !== 'ALFAMART' || data.payment_method !== 'INDOMARET' )?{
            "transaction_id": result.id,
            "external_id": result.invoice_number,
            "bank_code": data.payment_method,
            "name": data.customer_name,
            "amount": data.total_amount
        } : {

        }
        try {
            console.log(paymentPayload)
            const url = paymentUrl[data.payment_method]
            const {data: response} = await axios.post(url,paymentPayload)
            console.log(response)
            res.send({
                status: true,
                message: 'transaction created',
                data: response.data
            })
        }catch (e) {
            res.send({err: 'Create VA err, '+e.message})

        }
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
    }).then(rowUpdate=>{
        if(rowUpdate>0){
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

module.exports = {
    createTransaction,
    updateTransactionPaymentStatus
}
