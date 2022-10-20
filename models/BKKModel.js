import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Jobs = db.define(
  "jobs_bkk",
  {
    company_logo: {
      type: DataTypes.STRING,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
    },
    company_address: {
      type: DataTypes.STRING,
    },
    company_city: {
      type: DataTypes.STRING,
    },
    job_category: {
      type: DataTypes.STRING,
    },
    job_status: {
      type: DataTypes.STRING,
    },
    job_short_desc: {
      type: DataTypes.STRING,
    },
    job_desc: {
      type: DataTypes.STRING,
    },
    job_requirement: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Jobs;

(async () => {
  await db.sync();
})();
