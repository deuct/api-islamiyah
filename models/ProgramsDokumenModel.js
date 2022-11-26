import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProgramDokumen = db.define(
  "jurusan_document",
  {
    jd_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
    },
    jd_name: {
      type: DataTypes.STRING,
    },
    jd_document_dir: {
      type: DataTypes.STRING,
    },
    jd_for: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default ProgramDokumen;

(async () => {
  await db.sync();
})();
