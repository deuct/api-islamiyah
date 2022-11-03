import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Teachers = db.define(
  "teachers",
  {
    teacher_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    teacher_photo_dir: {
      type: DataTypes.STRING,
    },
    teacher_name: {
      type: DataTypes.STRING,
    },
    teacher_matpel: {
      type: DataTypes.STRING,
    },
    teacher_status: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Teachers;

(async () => {
  await db.sync();
})();
