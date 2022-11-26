import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Header = db.define(
  "header_content",
  {
    header_code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    header_title: {
      type: DataTypes.STRING,
    },
    header_desc: {
      type: DataTypes.STRING,
    },
    header_img_dir: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Header;

(async () => {
  await db.sync();
})();
