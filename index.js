import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
// import User from "./models/UserModel.js";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";

// import { createRequire } from "module";
// import multer, { diskStorage } from "multer";

dotenv.config();

// import cors from "cors";
// import UserRoute from "./routes/UserRoute.js";
// const require = createRequire(import.meta.url);

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
// app.use(cors()); //to allow cross origin so the API can be access outside domain
app.use(express.json()); //to make express can use JSON format
// app.use(multer);
const port = 5000;
app.use(router);

// Image Upload
// const multer = require(multer);

// app.use(bodyParser.urlencoded({ extended: true })); di command

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use("/static", express.static("public"));
// app.use('/images', (req, res, next) => {

// })
app.use("/images", express.static("images"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       path.parse(file.originalname).name +
//         "-" +
//         Date.now() +
//         path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/image", upload.single("file"), function (req, res) {
//   res.json({});
// });
// End image upload

// app.post("/api/upload", upload.single.apply("photo"), (req, res) => {
//   let finalImageURL =
//     req.protocol + "://" + req.get("host") + "/images" + req.file.filename;
//   res.json({ status: "success", image: finalImageURL });
// });

try {
  await db.authenticate();
  console.log("Database connected");
  //   await Users.sync();
} catch (error) {
  console.log(error);
}

app.listen(port, () => console.log(`Server up and running in port${port}`));
