import { Sequelize } from "sequelize";
import Kriteria from "./KriteriaModel.js";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const SubKriteriaModel = db.define(
    "sub_kriteria",
    {
        nama_kriteria: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        jalur_pendaftaran: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        sub_kriteria: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        tipe_sub: {
            type: DataTypes.ENUM('range', 'satuan'),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        bobot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        keterangan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },   
    },

    {
        freezeTableName: true,
    }
);

// (async()=>{
//   await db.sync({alter:true});
// })();
Kriteria.hasMany(SubKriteriaModel);

export default SubKriteriaModel;
