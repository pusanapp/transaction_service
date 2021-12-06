const axios = require('axios')
const {response} = require("express");
const {wsApiLocal} = require("./globalUrl");

const pushNotification = async (data, external_user_id) => {
    const pushData = {
        app_id: "dd00fb9e-3873-413f-b527-9438490500ce",
        include_external_user_ids: [`${external_user_id}`],
        data: {
            type: 'payment'
        },
        headings: {"en": "Pembayaran Berhasil"},
        contents: {"en": `Transaksi Pembayaran Sebesar ${data.total_amount} Pusan Anda Berhasil`}
    }
    await axios.post(`https://onesignal.com/api/v1/notifications`, pushData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic MzJjZmM2NGYtNzVkNi00ZWYyLWFjODEtODc1MTU1MTk4ZWI1'
        }
    }).then(({data: response})=>{
        console.log(response)
    }).catch(err=>{
        console.log(err.response)
    })
}

const pushNotificationDone = async (external_user_id) => {
    const pushData = {
        app_id: "dd00fb9e-3873-413f-b527-9438490500ce",
        include_external_user_ids: [`${external_user_id}`],
        data: {
            type: 'confirmation',
        },
        headings: {"en": "Konfirmasi Pesanan Telah Sampai"},
        contents: {"en": `Silahkan Cek Terlebih Dahulu dan Konfirmasi.`}
    }
    await axios.post(`https://onesignal.com/api/v1/notifications`, pushData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic MzJjZmM2NGYtNzVkNi00ZWYyLWFjODEtODc1MTU1MTk4ZWI1'
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
