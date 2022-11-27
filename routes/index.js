// Express Need
import express from "express";
// Controller
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import {
  getJobs,
  insertJob,
  getJobId,
  listingJobDashboard,
  deleteJob,
  updateJob,
  getJobById,
  deleteCurrImgJob,
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
  delCurrImgPost,
  updatePost,
  getPostBySlug,
} from "../controllers/Post.js";
import { uploadImg, showImg } from "../controllers/ImageUpload.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import {
  deleteCategory,
  insertCategory,
  updateCategory,
} from "../controllers/Category.js";
import {
  deleteTeacher,
  getTeacher,
  getTeacherId,
  insertTeacher,
  listingTeacherDashboard,
  deleteCurrImgTeacher,
  updateTeacher,
  getOneTeacher,
} from "../controllers/TeacherController.js";
import {
  deleteCurrImg,
  deleteStaff,
  getOneStaff,
  getStaff,
  getStaffId,
  insertStaff,
  listingStaffDashboard,
  updateStaff,
} from "../controllers/StaffController.js";
import {
  updateHeader,
  getAllHeader,
  getSingleHeader,
  deleteCurrImgHeader,
} from "../controllers/HeaderController.js";
import {
  getAlumni,
  getOneAlumni,
  getAlumniId,
  insertAlumni,
  updateAlumni,
  listingAlumniDashboard,
  deleteAlumni,
  deleteCurrImgAlumni,
  showAlumniIndex,
} from "../controllers/AlumniController.js";
import {
  getAllPrograms,
  getIdJurusanBySlug,
  getProgramsId,
  getSingleProgram,
  insertProgram,
  updateProgram,
} from "../controllers/ProgramController.js";
// Middleware
import { verifyToken } from "../middleware/VerifyToken.js";
// Function library
import multer from "multer";
import {
  deleteProgramPrestasi,
  getSingleProgramPrestasi,
  insertPrestasi,
} from "../controllers/ProgramsPrestasiController.js";
import {
  deleteDokumen,
  getSingleDokumen,
  insertDokumen,
} from "../controllers/ProgramsDokumenController.js";
import {
  getSingleProgramGallery,
  insertProgramGallery,
  programGalleryDelete,
} from "../controllers/ProgramsGalleryController.js";

// Multer Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Post");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, ""));
  },
});

const storageStaff = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Staff");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.staffId + file.originalname.replace(/\s+/g, ""));
  },
});

const storageJob = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Job");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.jobCode + file.originalname.replace(/\s+/g, ""));
  },
});

const storageTeacher = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Teacher");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.teacherId + file.originalname.replace(/\s+/g, ""));
  },
});

const storageHeader = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Header");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.headerId + file.originalname.replace(/\s+/g, ""));
  },
});

const storageAlumni = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Alumni");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.alumniId + file.originalname.replace(/\s+/g, ""));
  },
});

const storageProgramGallery = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Program");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, ""));
  },
});

const storageProgramDokumen = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Program/Dokumen");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, ""));
  },
});

const storageProgramPrestasi = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/Program/Prestasi");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, ""));
  },
});

const upload = multer({ storage: storage });
const uploadPost = multer({ storage: storagePost });
const uploadHeader = multer({ storage: storageHeader });
const uploadTeacher = multer({ storage: storageTeacher });
const uploadStaff = multer({ storage: storageStaff });
const uploadJob = multer({ storage: storageJob });
const uploadAlumni = multer({ storage: storageAlumni });
const uploadProgramGallery = multer({ storage: storageProgramGallery });
const uploadProgramDokumen = multer({ storage: storageProgramDokumen });
const uploadProgramPrestasi = multer({ storage: storageProgramPrestasi });
// End Multer

const router = express.Router();

// Welcome
app.get("/welcome", (req, res) => {
  res.send("welcome!");
});

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
router.post("/posts/getpostbyslug", getPostBySlug);
// Teacher
router.get("/teachers/", getTeacher);
router.get("/teachers/:teacherid", getOneTeacher);
router.get("/teachers/getid/getidteacher", verifyToken, getTeacherId);
router.get("/dash-listingteacher", listingTeacherDashboard);
// Staff
router.get("/staffs/", getStaff);
router.get("/staffs/:staffid", getOneStaff);
router.get("/staffs/getid/getidstaff", verifyToken, getStaffId);
router.get("/dash-listingstaff", listingStaffDashboard);
// Header
router.get("/header/", getAllHeader);
router.get("/header/:headerid", getSingleHeader);
// Alumni
router.get("/alumnis/", getAlumni);
router.get("/alumnis/:alumniid", getOneAlumni);
router.get("/alumnis/getid/getidalumni", verifyToken, getAlumniId);
router.get("/dash-listingalumni", listingAlumniDashboard);
router.get("/alumnis/alumniindex/show", showAlumniIndex);
// Program (Jurusan)
router.get("/jurusan/getid/getidjurusan", getProgramsId);
router.get("/jurusan", getAllPrograms);
router.get("/jurusan/:idjurusan", getSingleProgram);
router.post("/jurusan/getjurusanbyslug", getIdJurusanBySlug);
router.get("/jurusan/dokumen/:idjurusan", getSingleDokumen);
// router.get("/jurusan/dokumen/:idjurusan", getSingleDokumen);
router.get("/jurusan/prestasi/:idjurusan", getSingleProgramPrestasi);
router.get("/jurusan/gallery/:idjurusan", getSingleProgramGallery);

// API Insert
router.post("/posts/newpost", verifyToken, insertPost);
router.post(
  "/imgpost",
  verifyToken,
  uploadPost.single("imgpost_dir"),
  uploadImg
);
router.post("/posts/categorypost", verifyToken, insertCategory);
router.post(
  "/bkk/newbkk",
  verifyToken,
  uploadJob.single("companyLogo"),
  insertJob
);
router.post(
  "/teachers/newteacher",
  verifyToken,
  uploadTeacher.single("teacherPhoto"),
  insertTeacher
);
router.post(
  "/staffs/newstaff",
  verifyToken,
  uploadStaff.single("staffPhoto"),
  insertStaff
);
router.post(
  "/alumnis/newalumni",
  verifyToken,
  uploadAlumni.single("alumniPhoto"),
  insertAlumni
);
router.post("/jurusan/newjurusan", verifyToken, insertProgram);
router.post(
  "/programprestasi/newprogramprestasi",
  verifyToken,
  uploadProgramPrestasi.single("prestasiImgData"),
  insertPrestasi
);
router.post(
  "/programdokumen/newprogramdokumen",
  verifyToken,
  uploadProgramDokumen.single("dokumenData"),
  insertDokumen
);
router.post(
  "/programgallery/newprogramgallery",
  verifyToken,
  uploadProgramGallery.single("imageData"),
  insertProgramGallery
);

// API Update
router.post(
  "/staffs/updatestaff",
  verifyToken,
  uploadStaff.single("staffPhoto"),
  updateStaff
);
router.post(
  "/teachers/updateteacher",
  verifyToken,
  uploadTeacher.single("teacherPhoto"),
  updateTeacher
);
router.post(
  "/jobs/updatejob",
  verifyToken,
  uploadJob.single("companyLogo"),
  updateJob
);
router.post("/posts/updatepost", verifyToken, updatePost);
router.post("/posts/updatecategory", verifyToken, updateCategory);
router.post("/posts/updatecategory/delete", verifyToken, deleteCategory);
router.post(
  "/header/updateheader",
  verifyToken,
  uploadHeader.single("headerImg"),
  updateHeader
);
router.post(
  "/alumnis/updatealumni",
  verifyToken,
  uploadAlumni.single("alumniPhoto"),
  updateAlumni
);
router.post("/jurusan/update/", verifyToken, updateProgram);

// API Delete
router.post("/staff/delete/", verifyToken, deleteStaff);
router.post("/staff/delete/img", verifyToken, deleteCurrImg);
router.post("/teacher/delete/", verifyToken, deleteTeacher);
router.post("/teacher/delete/img", verifyToken, deleteCurrImgTeacher);
router.post("/job/delete/", verifyToken, deleteJob);
router.post("/job/delete/img", verifyToken, deleteCurrImgJob);
router.post("/post/imgdelete/:imgpostfor_id", verifyToken, deleteImgPost);
router.post("/post/postdelete/:postid", verifyToken, deletePost);
router.post("/post/img/delete/", verifyToken, delCurrImgPost);
router.post("/header/img/delete", verifyToken, deleteCurrImgHeader);
router.post("/alumnis/delete/", verifyToken, deleteAlumni);
router.post("/alumnis/delete/img", verifyToken, deleteCurrImgAlumni);
router.post("/programprestasi/delete", verifyToken, deleteProgramPrestasi);
router.post("/programdokumen/delete", verifyToken, deleteDokumen);
router.post("/programgallery/delete", verifyToken, programGalleryDelete);

export default router;
