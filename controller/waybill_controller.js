const axios = require('axios')
require('dotenv').config()
const trackingOrder = async (req, res) => {
    const {courier, waybill} = req.params;
    console.log(courier,waybill)
    await axios.post(`https://pro.rajaongkir.com/api/waybill`, {
        waybill: waybill,
        courier: courier
    }, {
        headers: {
            'key': process.env.RAJA_ONGKIR_KEY
        }
    }).then(({data: response})=>{
        console.log(response)
        res.send({
            status: true,
            message: 'tracking pesanan',
            data: response.rajaongkir.result
        })
    }).catch(err=>{
        console.log(err.response.data)
        res.send({
            status: false,
            message: err.message
        })
    })
}

module.exports = {
    trackingOrder
}