import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Alumni = db.define(
  "alumni",
  {
    alumni_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    alumni_photo_dir: {
      type: DataTypes.STRING,
    },
    alumni_nama: {
      type: DataTypes.STRING,
    },
    alumni_profesi: {
      type: DataTypes.STRING,
    },
    alumni_testi: {
      type: DataTypes.STRING,
    },
    isIndex: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Alumni;

(async () => {
  await db.sync();
})();
