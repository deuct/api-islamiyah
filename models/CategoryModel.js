import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Category = db.define(
  "categorypost",
  {
    categorypost_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
    },
    categorypost_name: { type: DataTypes.STRING },
    categorypost_for: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Category;

(async () => {
  await db.sync();
})();
