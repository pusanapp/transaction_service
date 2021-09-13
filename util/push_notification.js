const axios = require('axios')

const pushNotification = async (data, external_user_id) => {
    const pushData = {
        app_id: "dd00fb9e-3873-413f-b527-9438490500ce",
        include_external_user_ids: [`${external_user_id}`],
        data: {"foo": "bar"},
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

module.exports = {
    pushNotification
}
