import { Sequelize } from "sequelize";

const db = new Sequelize("db_smkislamiyah", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
