import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Staffs = db.define(
  "staff",
  {
    staff_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    staff_photo_dir: {
      type: DataTypes.STRING,
    },
    staff_name: {
      type: DataTypes.STRING,
    },
    staff_department: {
      type: DataTypes.STRING,
    },
    staff_status: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Staffs;

(async () => {
  await db.sync();
})();
