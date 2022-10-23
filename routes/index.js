import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { getJobs, getJobById } from "../controllers/Bkk.js";
import {
  getPosts,
  getOnePost,
  getImgPerPost,
  getCategoryPerPost,
  getPostSecond,
} from "../controllers/Post.js";
import { uploadImg, showImg } from "../controllers/ImageUpload.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import multer from "multer";

// Multer Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/users/", verifyToken, getUsers);
// router.post("/users/", Register);
router.get("/jobs/", getJobs);
router.get("/jobs/:company_id", getJobById);
router.post("/login/", Login);
router.get("/token/", refreshToken);
router.delete("/logout/", Logout);
// router.get("/posts/", getPosts);
router.get("/posts/", getPostSecond);
router.get("/posts/imgpost/:imgpostid", getImgPerPost);
router.get("/posts/:postid", getOnePost);
router.get("/posts/category/:categorypostid", getCategoryPerPost);

router.post("/imgpost", upload.single("imgpost_dir"), uploadImg);
router.get("/imgpost", showImg);

export default router;
