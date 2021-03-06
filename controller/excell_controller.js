const excel = require("exceljs");
const model = require('../models')
const Transaction = model.app_transaction;
const TProduct = model.transaction_product;
const Barang = model.e_barang;
const Product = model.app_product;
const path = require('path');
const {Op} = require('sequelize')
const moment = require('moment')
require('moment/locale/id')
const testExcell = async (req,res) => {
    const{startDate, endDate} = req.query;
    Transaction.findAll({
        where: {
            createdAt: {
                // -1 hari
                // new Date(new Date() - 24 * 60 * 60 * 1000)
                [Op.lte]: moment(endDate).add(2,'days'),
                [Op.gte]: moment(startDate).add(1, 'days')
            }
        }
    }).then((objs) => {
        // res.send(objs)
        // console.log(objs)
        let tutorials = [];

        objs.map((obj,index) => {
            tutorials.push({
                number: index +1,
                invoice_number: obj.invoice_number,
                customer_name: obj.customer_name,
                payment_method: obj.payment_method,
                total_amount: obj.total_amount,
                date: obj.createdAt
            });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Tutorials");

        worksheet.columns = [
            { header: "No", key: "number", width: 5 },
            { header: "Invoice Number", key: "invoice_number", width: 30 },
            { header: "Customer Name", key: "customer_name", width: 25 },
            { header: "Payment Method", key: "payment_method", width: 25 },
            { header: "Total Payment", key: "total_amount", width: 20 },
            { header: "Date", key: "date", width: 20 },
        ];

        // Add Array Rows
        worksheet.addRows(tutorials);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + `export-TRANSACTION-${Date.now()}.xlsx`
        );
        // console.log(path.join(__dirname, `../public/xls/333.xlsx`))
        // workbook.xlsx.writeFile(path.join(__dirname, `../public/xls/333.xlsx`))
        // res.send(
        //     {
        //         status: true,
        //         file_xls: `http://127.0.0.1:4005/xls/333.xlsx`
        //     }
        // )
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }).catch(err=>{
        console.log(err.message)
    })
}

module.exports = {
    testExcell
}
