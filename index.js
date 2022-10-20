import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
import User from "./models/UserModel.js";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

// import cors from "cors";
// import UserRoute from "./routes/UserRoute.js";

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
// app.use(cors()); //to allow cross origin so the API can be access outside domain
app.use(express.json()); //to make express can use JSON format
app.use(router);

try {
  await db.authenticate();
  console.log("Database connected");
  //   await Users.sync();
} catch (error) {
  console.log(error);
}

app.listen(5000, () => console.log("Server up and running in port"));
