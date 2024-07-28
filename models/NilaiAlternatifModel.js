import { Sequelize } from "sequelize";
import Alternatif from "../models/AlternatifModel.js";
import db from "../config/Database.js";
import User from "./UserModel.js";
import JalurModel from "./JalurModel.js";
// import KriteriaModel from "./KriteriaModel.js";

const { DataTypes } = Sequelize;

const NilaiAlternatifModel = db.define(
  "nilai_alternatif",
  {
    nama_alternatif: {
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
    nama_kriteria: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nilai_real: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nilai_fuzzy: {
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

// NilaiAlternatifModel.belongsTo(KriteriaModel)
NilaiAlternatifModel.belongsTo(Alternatif)
NilaiAlternatifModel.belongsTo(User)
NilaiAlternatifModel.belongsTo(JalurModel)


export default NilaiAlternatifModel;