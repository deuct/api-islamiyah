import Alumni from "../models/AlumniModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// Get all alumni for listing
export const getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findAll({
      attributes: [
        "alumni_id",
        "alumni_photo_dir",
        "alumni_nama",
        "alumni_profesi",
        "alumni_test",
        "isIndex",
      ],
    });
    res.status(201).json(alumni);
  } catch (error) {
    console.log(error);
  }
};

// Get single alumni by id
export const getOneAlumni = async (req, res) => {
  try {
    const alumniId = req.params.alumniid;
    const alumni = await db.query(
      "SELECT * FROM alumni WHERE alumni_id = :alumniId",
      { replacements: { alumniId: alumniId }, type: QueryTypes.SELECT }
    );

    res.json({ result: alumni });
  } catch (error) {
    console.log(error);
  }
};

// Get last id of alumni
export const getAlumniId = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT alumni_id FROM alumni ORDER BY createdAt DESC LIMIT 1",
      { type: QueryTypes.SELECT }
    );

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Insert new alumni
export const insertAlumni = async (req, res) => {
  try {
    let alumni = await Alumni.create({
      alumni_id: req.body.alumniId,
      alumni_photo_dir: req.file.path,
      alumni_nama: req.body.alumniNama,
      alumni_profesi: req.body.alumniProfesi,
      alumni_testi: req.body.alumniTesti,
      isIndex: req.body.isIndex,
    });
    // console.log(req.file.path);
    // console.log(req.body);

    res.status(200).json({ message: "data has been sended to server" });
  } catch (error) {
    console.log(error);
  }
};

// Update alumni current
export const updateAlumni = async (req, res) => {
  try {
    const alumniId = req.body.alumniId;
    const alumniNama = req.body.alumniNama;
    const alumniProfesi = req.body.alumniProfesi;
    const alumniTesti = req.body.alumniTesti;
    const isIndex = req.body.isIndex;
    var alumniPhotoDir = "";

    if (req.body.isNewImage === "true") {
      alumniPhotoDir = req.file.path;
      const updateAlumniDb = await db.query(
        "UPDATE alumni SET alumni_nama = :alumniNama, alumni_photo_dir = :alumniPhotoDir, alumni_profesi = :alumniProfesi, alumni_testi = :alumniTesti, isIndex = :isIndex WHERE alumni_id = :alumniId",
        {
          replacements: {
            alumniId: alumniId,
            alumniNama: alumniNama,
            alumniPhotoDir: alumniPhotoDir,
            alumniProfesi: alumniProfesi,
            alumniTesti: alumniTesti,
            isIndex: isIndex,
          },
          type: QueryTypes.UPDATE,
        }
      );
    } else {
      alumniPhotoDir = "";
      const updateAlumniDb = await db.query(
        "UPDATE alumni SET alumni_nama = :alumniNama, alumni_profesi = :alumniProfesi, alumni_testi = :alumniTesti, isIndex = :isIndex WHERE alumni_id = :alumniId",
        {
          replacements: {
            alumniId: alumniId,
            alumniNama: alumniNama,
            alumniProfesi: alumniProfesi,
            alumniTesti: alumniTesti,
            isIndex: isIndex,
          },
          type: QueryTypes.UPDATE,
        }
      );
    }
    res.status(200).json({ message: "data success sended to server" });
  } catch (error) {
    console.log(error);
  }
};

// Listing alumni for dashboard
export const listingAlumniDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;

    var totalRows = await db.query(
      "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM alumni WHERE alumni_nama LIKE :search OR alumni_profesi LIKE :search OR isIndex LIKE :search",
      {
        replacements: { search: "%" + search + "%" },
        type: QueryTypes.SELECT,
        raw: true,
        plain: true,
        nest: true,
      }
    );
    var result = await db.query(
      "SELECT alumni_id, alumni_photo_dir, alumni_nama, alumni_profesi, alumni_testi, isIndex FROM alumni WHERE alumni_nama LIKE :search OR alumni_profesi LIKE :search OR isIndex LIKE :search GROUP BY alumni_id  ORDER BY alumni.createdAt ASC LIMIT :limit OFFSET :offset",
      {
        replacements: {
          search: "%" + search + "%",
          limit: limit,
          offset: offset,
        },
        type: QueryTypes.SELECT,
      }
    );

    var totalRowsRes = JSON.parse(JSON.stringify(totalRows));
    totalRowsRes = totalRowsRes["totalRows"];
    const totalPage = Math.ceil(totalRowsRes / limit);

    res.status(201).json({
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

// Delete Alumni
export const deleteAlumni = async (req, res) => {
  try {
    const alumniId = req.query.alumni_id;
    const alumniImg = req.query.alumni_img;

    // console.log("test");
    // console.log(alumniImg);

    if (alumniImg !== "") {
      fs.unlink(alumniImg, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const result = await db.query(
      "DELETE FROM alumni WHERE alumni_id = :alumniId",
      { replacements: { alumniId: alumniId }, type: QueryTypes.DELETE }
    );

    res.status(201).json({ message: "success delete data" });
  } catch (error) {
    console.log(error);
  }
};

// Delete current image
export const deleteCurrImgAlumni = async (req, res) => {
  try {
    const alumniId = req.query.alumni_id;
    const alumniImg = req.query.alumni_img;

    const deleteImgDb = await db.query(
      "UPDATE alumni SET alumni_photo_dir = '' WHERE alumni_id = :alumniId AND alumni_photo_dir = :alumniImg",
      {
        replacements: { alumniId: alumniId, alumniImg: alumniImg },
        type: QueryTypes.UPDATE,
      }
    );

    fs.unlink(alumniImg, (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.status(200).json({ message: "success delete image from server" });
  } catch (error) {
    console.log(error);
  }
};

// select alumni for home index
export const showAlumniIndex = async (req, res) => {
  try {
    const resultAlumni = await db.query(
      "SELECT * FROM alumni WHERE isIndex = 'yes'",
      { type: QueryTypes.SELECT }
    );

    res.json({ result: resultAlumni });
  } catch (error) {
    console.log(error);
  }
};
