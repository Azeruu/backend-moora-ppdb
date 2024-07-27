import { Sequelize } from "sequelize";
import Alternatif from "./AlternatifModel.js";
import User from "./UserModel.js";
import Jalur from "./JalurModel.js";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const HasilModel = db.define(
  "hasil",
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
    poin: {
      type: DataTypes.FLOAT,
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
HasilModel.belongsTo(Alternatif)
HasilModel.belongsTo(User)
HasilModel.belongsTo(Jalur)
export default HasilModel;