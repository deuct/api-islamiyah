import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Programs = db.define(
  "jurusan",
  {
    jurusan_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    jurusan_slug: {
      type: DataTypes.STRING,
    },
    jurusan_name: {
      type: DataTypes.STRING,
    },
    jurusan_kaprog_id: {
      type: DataTypes.STRING,
    },
    jurusan_about: {
      type: DataTypes.STRING,
    },
    jurusan_visi: {
      type: DataTypes.STRING,
    },
    jurusan_misi: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Programs;

(async () => {
  await db.sync();
})();
