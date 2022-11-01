import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import {
  getJobs,
  getJobById,
  insertJob,
  getJobId,
  listingJobDashboard,
} from "../controllers/Bkk.js";
import {
  getOnePost,
  getImgPerPost,
  getCategoryPerPost,
  getPostSecond,
  getIdPost,
  insertPost,
  listingPostDashboard,
} from "../controllers/Post.js";
import { uploadImg, showImg } from "../controllers/ImageUpload.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { validate } from "../middleware/ValidatorJobs.js";
import multer from "multer";
import { insertCategory } from "../controllers/Category.js";

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

// API Get
router.get("/users/", verifyToken, getUsers);
router.get("/jobs/", getJobs);
router.get("/jobs/:company_id", getJobById);
router.post("/login/", Login);
router.get("/token/", refreshToken);
router.delete("/logout/", Logout);
router.get("/posts/", getPostSecond);
router.get("/posts/imgpost/:imgpostid", getImgPerPost);
router.get("/posts/:postid", getOnePost);
router.get("/posts/category/:categorypostid", getCategoryPerPost);
router.get("/dash-listingpost/", listingPostDashboard); // pakein verifytoken
router.get("/imgpost", showImg);
// Get id bkk
router.get("/bkk/getid/getidbkk/", verifyToken, getJobId);
// Get id posting
router.get("/posts/getid/getidpost/", verifyToken, getIdPost);
// Listing job dashboard
router.get("/dash-listingbkk", listingJobDashboard);
// API Insert
router.post("/posts/newpost", verifyToken, insertPost);
router.post("/imgpost", verifyToken, upload.single("imgpost_dir"), uploadImg);
router.post("/posts/categorypost", verifyToken, insertCategory);
router.post(
  "/bkk/newbkk",
  verifyToken,
  upload.single("companyLogo"),
  insertJob
);

export default router;
