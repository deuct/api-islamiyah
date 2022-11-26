import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProgramPrestasi = db.define(
  "jurusan_prestasi",
  {
    jp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
    },
    jp_name: {
      type: DataTypes.STRING,
    },
    jp_year: {
      type: DataTypes.STRING,
    },
    jp_position: {
      type: DataTypes.STRING,
    },
    jp_for: {
      type: DataTypes.STRING,
    },
    jp_img_dir: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ProgramPrestasi;

(async () => {
  await db.sync();
})();
