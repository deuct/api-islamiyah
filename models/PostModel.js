import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Posts = db.define(
  "post",
  {
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    post_name: {
      type: DataTypes.STRING,
    },
    post_status: {
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
    post_slug: {
      type: DataTypes.STRING,
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
