import { Sequelize } from "sequelize";
import AlternatifModel from "./AlternatifModel.js";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const JalurModel = db.define(
  "jalur",
  {
    nama_jalur: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    persentase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jumlah_kuota: {
      type: DataTypes.INTEGER,
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
JalurModel.hasMany(AlternatifModel);

export default JalurModel;