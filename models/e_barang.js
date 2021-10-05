'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class e_barang extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.app_product, {
                foreignKey: 'barang_id',
                as: 'app_product'
            })
        }
    };
    e_barang.init({
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        kode_barang: DataTypes.STRING,
        nama_barang: DataTypes.STRING,
        merk: DataTypes.STRING,
        jenis_barang: DataTypes.STRING,
        kategori_barang: DataTypes.STRING,
        harga_pokok: DataTypes.STRING,
        harga_jual_umum: DataTypes.STRING,
        harga_jual_reseller: DataTypes.STRING,
        harga_jual_grosir: DataTypes.STRING,
        harga_spesial: DataTypes.STRING,
        grosir: DataTypes.INTEGER,
        stock: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        company: DataTypes.STRING,
        deskripsi: DataTypes.STRING,
        spesifikasi: DataTypes.STRING,
        weight: DataTypes.FLOAT,
        keyword: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
    }, {
        sequelize,
        createdAt: false,
        updatedAt: false,
        modelName: 'e_barang',
        tableName: 'e_barang'
    });
    return e_barang;
};
