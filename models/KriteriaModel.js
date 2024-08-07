import { Sequelize } from "sequelize";
import NilaiAlternatifModel from "./NilaiAlternatifModel.js";
import JalurModel from "./JalurModel.js";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const KriteriaModel = db.define(
  "kriteria",
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
    bobot_kriteria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        min:0,
        max:100
      },
    },
    tipe_data: {
      type: DataTypes.ENUM('benefit', 'cost'),
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
KriteriaModel.hasMany(NilaiAlternatifModel);
JalurModel.hasMany(KriteriaModel);
export default KriteriaModel;
