import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json()); //to make express can use JSON format
const port = 5000;
app.use(router);
app.use("/images", express.static("images"));

try {
  await db.authenticate();
  console.log("Database connected");
  //   await Users.sync();
} catch (error) {
  console.log(error);
}

app.listen(port, () => console.log(`Server up and running in port${port}`));
