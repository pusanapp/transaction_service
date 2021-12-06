const axios = require('axios')
const {response} = require("express");
const {wsApiLocal} = require("./globalUrl");
require('dotenv').config()

const pushNotification = async (data, external_user_id) => {
    const pushData = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        include_external_user_ids: [`${external_user_id}`],
        data: {
            type: 'payment',
            transaction_id: data.id
        },
        headings: {"en": "Pembayaran Berhasil"},
        contents: {"en": `Transaksi Pembayaran Sebesar ${data.total_amount} Pusan Anda Berhasil`}
    }
    await axios.post(`https://onesignal.com/api/v1/notifications`, pushData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${process.env.ONE_SIGNAL_KEY}`
        }
    }).then(({data: response})=>{
        console.log(response)
    }).catch(err=>{
        console.log(err.response)
    })
}

const pushNotificationDone = async (data, external_user_id) => {
    const pushData = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        include_external_user_ids: [`${external_user_id}`],
        data: {
            type: 'confirmation',
            transaction_id: data.id
        },
        headings: {"en": "Konfirmasi Pesanan Telah Sampai"},
        contents: {"en": `Silahkan Cek Terlebih Dahulu dan Konfirmasi.`}
    }
    await axios.post(`https://onesignal.com/api/v1/notifications`, pushData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${process.env.ONE_SIGNAL_KEY}`
        }
    }).then(({data: response})=>{
        console.log(response)
    }).catch(err=>{
        console.log(err.response)
    })
}
const pushNotificationWeb = async (data) => {
    const postData = {
        from: data.customer_name,
        payment_amount: data.total_amount,
        method: data.payment_method
    }
    await axios.post(`${wsApiLocal}/paid-order`, postData).then(({data: response}) => {
        console.log(response)
    })
}

module.exports = {
    pushNotification,
    pushNotificationWeb,
    pushNotificationDone
}
