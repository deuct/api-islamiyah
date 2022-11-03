// Express Need
import express from "express";
// Controller
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import {
  getJobs,
  getJobById,
  insertJob,
  getJobId,
  listingJobDashboard,
  deleteJob,
} from "../controllers/Bkk.js";
import {
  getOnePost,
  getImgPerPost,
  getCategoryPerPost,
  getPostSecond,
  getIdPost,
  insertPost,
  listingPostDashboard,
  deleteImgPost,
  deletePost,
} from "../controllers/Post.js";
import { uploadImg, showImg } from "../controllers/ImageUpload.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { insertCategory } from "../controllers/Category.js";
import {
  deleteTeacher,
  getTeacher,
  getTeacherId,
  insertTeacher,
  listingTeacherDashboard,
} from "../controllers/TeacherController.js";
import {
  deleteStaff,
  getStaff,
  getStaffId,
  insertStaff,
  listingStaffDashboard,
} from "../controllers/StaffController.js";
// Middleware
import { verifyToken } from "../middleware/VerifyToken.js";
import { validate } from "../middleware/ValidatorJobs.js";
// Function library
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
// End Multer

// Users, Authorization
router.get("/users/", verifyToken, getUsers);
router.post("/login/", Login);
router.delete("/logout/", Logout);
router.get("/token/", refreshToken);
// Jobs
router.get("/jobs/", getJobs);
router.get("/jobs/:company_id", getJobById);
router.get("/bkk/getid/getidbkk/", verifyToken, getJobId);
router.get("/dash-listingbkk", listingJobDashboard);
// Post
router.get("/posts/", getPostSecond);
router.get("/posts/imgpost/:imgpostid", getImgPerPost);
router.get("/posts/:postid", getOnePost);
router.get("/posts/category/:categorypostid", getCategoryPerPost);
router.get("/dash-listingpost/", listingPostDashboard); // pakein verifytoken
router.get("/imgpost", showImg);
router.get("/posts/getid/getidpost/", verifyToken, getIdPost);
// Teacher
router.get("/teachers/", getTeacher);
router.get("/teachers/getid/getidteacher", verifyToken, getTeacherId);
router.get("/dash-listingteacher", listingTeacherDashboard);
// Staff
router.get("/staffs/", getStaff);
router.get("/staffs/getid/getidstaff", verifyToken, getStaffId);
router.get("/dash-listingstaff", listingStaffDashboard);

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
router.post(
  "/teachers/newteacher",
  verifyToken,
  upload.single("teacherPhoto"),
  insertTeacher
);

router.post(
  "/staffs/newstaff",
  verifyToken,
  upload.single("staffPhoto"),
  insertStaff
);

// API Delete
router.post("/staff/delete/", verifyToken, deleteStaff);
router.post("/teacher/delete/", verifyToken, deleteTeacher);
router.post("/job/delete/", verifyToken, deleteJob);
router.post("/post/imgdelete/:imgpostfor_id", verifyToken, deleteImgPost);
router.post("/post/postdelete/:postid", verifyToken, deletePost);

export default router;
