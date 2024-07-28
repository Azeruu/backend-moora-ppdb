import { Sequelize } from "sequelize";
import User from "./UserModel.js";
// import Jalur from "./JalurModel.js";
// import NilaiAlternatifModel from "./NilaiAlternatifModel.js";
import db from "../config/Database.js";
// import Hasil from "./HasilModel.js";

const { DataTypes } = Sequelize;

const AlternatifModel = db.define(
  "alternatif",
  {
    kode_alternatif: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama_alternatif: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama_jalur: {
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
//   await db.sync();
// })();
// AlternatifModel.hasMany(NilaiAlternatifModel);
// AlternatifModel.hasOne(Hasil);
AlternatifModel.belongsTo(User,{foreignKey:"userId"});
// AlternatifModel.belongsTo(Jalur);


export default AlternatifModel;