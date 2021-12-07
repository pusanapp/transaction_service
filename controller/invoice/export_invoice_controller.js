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
    html = html.replace('[invoice_number2]', transaction.invoice_number)
    html = html.replace('[tanggal_pembelian2]', moment(transaction.createdAt).format('llll'))
    html = html.replace('[nama]', transaction.customer_name)

    html = html.replace('[no_hp]', transaction.phone_number)
    html = html.replace('[alamat]', transaction.address)

    html = html.replace('[weight2]', transaction.shipping_weight + ' gram')
    html = html.replace('[payment_method]', transaction.payment_method)
    html = html.replace('[payment_method]', transaction.payment_method)
    html = html.replace('[amount]', convertRupiah.convert(transaction.total_amount))
    let htmlItem = ''
    let subTotal = 0;
    transaction.transaction_product.map(product => {
        subTotal += (product.product_price * product.product_qty)
        console.log('sub_total, ',subTotal)
        htmlItem = htmlItem+`<tr class="item">
            <td colspan="1">${product.product_name}</td>
            <td style="text-align: center">${product.product_qty}</td>
            <td style="text-align: right">${convertRupiah.convert(product.product_price)}</td>
        </tr>`
    })
    html = html.replace('[item_product]', htmlItem)
    html = html.replace('[sub_total]', convertRupiah.convert(subTotal))
    html = html.replace('[shipping_cost]', convertRupiah.convert(transaction.shipping_cost))
    html = html.replace('[administrative_cost]', convertRupiah.convert(transaction.administrative_cost))
    html = html.replace('[total]', convertRupiah.convert(transaction.total_amount))
    html = html.replace('[nama1]', transaction.customer_name)
    html = html.replace('[hp1]', transaction.phone_number)
    html = html.replace('[alamat1]', transaction.address)
    html = html.replace('[shipping_method2]', transaction.shipping_expedition_service)
    html = html.replace('[no_resi2]', transaction.shipping_number? transaction.shipping_number: 'not Ready')
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