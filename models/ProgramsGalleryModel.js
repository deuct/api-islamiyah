import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProgramGallery = db.define(
  "jurusan_gallery",
  {
    jg_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
    },
    jg_name: {
      type: DataTypes.STRING,
    },
    jg_img_dir: {
      type: DataTypes.STRING,
    },
    jg_img_for: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ProgramGallery;

(async () => {
  await db.sync();
})();
