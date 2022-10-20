import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Posts = db.define(
  "post",
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    post_name: {
      type: DataTypes.STRING,
    },
    post_type: {
      type: DataTypes.STRING,
    },
    post_shortdesc: {
      type: DataTypes.STRING,
    },
    post_desc: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Posts;

(async () => {
  await db.sync();
})();
