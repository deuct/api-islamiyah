import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Image = db.define(
  "imgpost",
  {
    imgpost_id: { type: DataTypes.STRING, primaryKey: true, allowNull: true },
    imgpost_dir: { type: DataTypes.STRING },
    imgpost_name: { type: DataTypes.STRING },
    imgpost_for: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Image;

(async () => {
  await db.sync();
})();
