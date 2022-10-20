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
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

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

export default router;
