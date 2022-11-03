import Staffs from "../models/StaffModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// Get all staff for listing
export const getStaff = async (req, res) => {
  try {
    const staff = await Staffs.findAll({
      attributes: [
        "staff_id",
        "staff_name",
        "staff_department",
        "staff_status",
        "staff_photo_dir",
      ],
    });
    res.json(staff);
  } catch (error) {
    console.log(error);
  }
};

// Get last id of staff
export const getStaffId = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT staff_id FROM staff ORDER BY createdAt DESC LIMIT 1",
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
export const insertStaff = async (req, res) => {
  try {
    let staff = await Staffs.create({
      staff_id: req.body.staffId,
      staff_name: req.body.staffName,
      staff_department: req.body.staffDepartment,
      staff_status: req.body.staffStatus,
      staff_photo_dir: req.file.path,
    });
    res.status(200).json({ message: "data success sended to server" });
  } catch (error) {
    console.log(error);
  }
  console.log(req.body);
  console.log(req.path);
};

// Listing teacher for dashboard
export const listingStaffDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;
    var staffStatus = req.query.staff_status || "";

    if (staffStatus === "") {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM staff WHERE staff_name LIKE :search OR staff_department LIKE :search",
        {
          replacements: { search: "%" + search + "%" },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT staff_id, staff_name, staff_department, staff_status, staff_photo_dir, CAST(createdAt AS DATE) AS createdAt FROM staff WHERE staff_name LIKE :search OR staff_department LIKE :search GROUP BY staff_id  ORDER BY staff.createdAt ASC LIMIT :limit OFFSET :offset",
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
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM staff WHERE (staff_name LIKE :search OR staff_department LIKE :search) AND staff_status = :staffStatus",
        {
          replacements: {
            search: "%" + search + "%",
            staffStatus: staffStatus,
          },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT staff_id, staff_name, staff_department, staff_status, staff_photo_dir, CAST(createdAt AS DATE) AS createdAt FROM staff WHERE (staff_name LIKE :search OR staff_department LIKE :search) AND staff_status = :staffStatus GROUP BY staff_id  ORDER BY staff.createdAt ASC LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
            staffStatus: staffStatus,
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

// Delete Staff
export const deleteStaff = async (req, res) => {
  try {
    const staffId = req.query.staff_id;
    const staffImg = req.query.staff_img;

    fs.unlink(staffImg, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const [result, metadata] = await db.query(
      "DELETE FROM staff WHERE staff_id = :staffId",
      {
        replacements: { staffId: staffId, type: QueryTypes.DELETE },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
