import Teachers from "../models/TeacherModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// Get all teacher for listing
export const getTeacher = async (req, res) => {
  try {
    const teachers = await Teachers.findAll({
      attributes: [
        "teacher_id",
        "teacher_name",
        "teacher_matpel",
        "teacher_status",
        "teacher_photo_dir",
      ],
    });
    res.json(teachers);
  } catch (error) {
    console.log(error);
  }
};

// Get last id of teacher
export const getTeacherId = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT teacher_id FROM teachers ORDER BY createdAt DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

// Insert new teacher
export const insertTeacher = async (req, res) => {
  try {
    let teacher = await Teachers.create({
      teacher_id: req.body.teacherId,
      teacher_name: req.body.teacherName,
      teacher_matpel: req.body.teacherMatpel,
      teacher_status: req.body.teacherStatus,
      teacher_photo_dir: req.file.path,
    });
    res.status(200).json({ message: "data success sended to server" });
  } catch (error) {
    console.log(error);
  }
  //   console.log(req.body);
  //   console.log(req.path);
};

// Listing teacher for dashboard
export const listingTeacherDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;
    // var postType = req.query.post_type || "";
    var teacherStatus = req.query.teacher_status || "";

    if (teacherStatus === "") {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM teachers WHERE teacher_name LIKE :search OR teacher_matpel LIKE :search",
        {
          replacements: { search: "%" + search + "%" },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT teacher_id, teacher_name, teacher_matpel, teacher_status, teacher_photo_dir, CAST(createdAt AS DATE) AS createdAt FROM teachers WHERE teacher_name LIKE :search OR teacher_matpel LIKE :search GROUP BY teacher_id  ORDER BY teachers.createdAt ASC LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
          },
          type: QueryTypes.SELECT,
        }
      );
    } else {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM teachers WHERE (teacher_name LIKE :search OR teacher_matpel LIKE :search) AND teacher_status = :teacherStatus",
        {
          replacements: {
            search: "%" + search + "%",
            teacherStatus: teacherStatus,
          },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT teacher_id, teacher_name, teacher_matpel, teacher_status, teacher_photo_dir, CAST(createdAt AS DATE) AS createdAt FROM teachers WHERE (teacher_name LIKE :search OR teacher_matpel LIKE :search) AND teacher_status = :teacherStatus GROUP BY teacher_id  ORDER BY teachers.createdAt ASC LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
            teacherStatus: teacherStatus,
          },
          type: QueryTypes.SELECT,
        }
      );
    }

    var totalRowsRes = JSON.parse(JSON.stringify(totalRows));
    totalRowsRes = totalRowsRes["totalRows"];
    const totalPage = Math.ceil(totalRowsRes / limit);

    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRowsRes,
      totalPage: totalPage,
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.query.teacher_id;
    const teacherImg = req.query.teacher_img;

    fs.unlink(teacherImg, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const [result, metadata] = await db.query(
      "DELETE FROM teachers WHERE teacher_id = :teacherId",
      {
        replacements: { teacherId: teacherId, type: QueryTypes.DELETE },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
