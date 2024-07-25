import { Sequelize } from "sequelize";
// import AlternatifModel from "./AlternatifModel.js";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Quota = db.define(
"quota",
{
total_quota: {
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

// (async () => {
//   await db.sync();
// })();
// User.hasMany(AlternatifModel);
export default Quota;