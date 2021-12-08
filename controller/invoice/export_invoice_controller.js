const pdf = require("pdf-creator-node");
const fs = require("fs");
const model = require('../../models/index')
const moment = require("moment");
const Transaction = model.app_transaction;
const TProduct = model.transaction_product;
const Barang = model.e_barang;
const Product = model.app_product;
const convertRupiah = require("rupiah-format");
const exportInvoice = async (req, res) => {
    const {invoice} = req.params
    const transaction = await Transaction.findOne({
        where: {
            invoice_number: invoice
        },
        include: [
            {
                model: TProduct,
                as: 'transaction_product'
            },
            'app_payment'
        ],
    })
    console.log(transaction)
    let html = fs.readFileSync(__dirname +"/template.html", "utf8");
    let bitmap = fs.readFileSync(__dirname+"/logo_pusan12.png")
    const logo = bitmap.toString('base64')

    let htmlItem = ''
    let subTotal = 0;
    let specialPrice = 0;
    let total = 0;
    let type = '';
    transaction.transaction_product.map(product => {
        console.log(product)
        if(product.discount_price){
            total = product.product_qty*product.discount_price
            subTotal += total
            specialPrice = product.discount_price
            type = '(Diskon)'
        }else if(product.combo_price){
            total = product.product_qty*product.combo_price
            subTotal += total
            specialPrice = product.combo_price
            type = '(Combo)'

        }else if(product.grosir_price){
            total = product.product_qty*product.grosir_price
            subTotal += total
            specialPrice = product.grosir_price
            type = '(Grosir)'
        }else {
            total = product.product_qty * product.product_price
            subTotal += total
            specialPrice = 0
            type = ''
        }
        console.log('sub_total, ',subTotal)
        htmlItem = htmlItem+`<tr class="item">
            <td colspan="1">${product.product_name}</td>
            <td style="text-align: center">${product.product_qty}</td>
            <td style="text-align: center">${convertRupiah.convert(product.product_price)}</td>
            <td style="text-align: center">${type} ${convertRupiah.convert(specialPrice)}</td>
            <td style="text-align: right">${convertRupiah.convert(total)}</td>
        </tr>`
    })
    html = html.replace('[item_product]', htmlItem)

    const options = {
        format: "A4",
        orientation: "portrait",
        marginTop: "100mm",
        header: {
            height: "15mm",
        },
        footer: {
            height: "15mm",
        },
    };
    const document = {
        html: html,
        data: {
            users: [],
            logo: logo,
            customer_name: transaction.customer_name,
            phone_number: transaction.phone_number,
            invoice: invoice,
            address: transaction.address,
            date: moment(transaction.createdAt).format('llll'),
            payment_method: transaction.payment_method,
            amount: convertRupiah.convert(transaction.total_amount),
            sub_total: convertRupiah.convert(subTotal),
            shipping_cost: convertRupiah.convert(transaction.shipping_cost),
            administrative_cost: convertRupiah.convert(transaction.administrative_cost),
            total: convertRupiah.convert(transaction.total_amount),
            weight: transaction.shipping_weight,
            shipping_expedition: transaction.shipping_expedition_service
        },
        path: "./output.pdf",
        type: "buffer",
    };

    await pdf.create(document, options)
        .then((response) => {
            res.setHeader(
                "Content-disposition",
                `inline; filename="${invoice}.pdf"`
            );
            res.setHeader("Content-type", "application/pdf");
            return res.send(response);
        })
        .catch((error) => {
            console.error(error);
        });
}
module.exports = {
    exportInvoice
}