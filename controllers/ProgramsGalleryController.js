import ProgramGallery from "../models/ProgramsGalleryModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// insert program gallery
export const insertProgramGallery = async (req, res) => {
  try {
    let programGallery = await ProgramGallery.create({
      jg_img_dir: req.file.path,
      jg_img_for: req.body.galleryFor,
    });

    res.status(200).json({ message: "success send data to server" });
  } catch (error) {
    console.log(error);
  }
};
// End insert program gallery

// get single program gallery
export const getSingleProgramGallery = async (req, res) => {
  try {
    const jgFor = req.params.idjurusan;
    let programGallery = await db.query(
      "SELECT * FROM jurusan_gallery WHERE jg_img_for = :jgFor",
      {
        type: QueryTypes.SELECT,
        replacements: {
          jgFor: jgFor,
        },
      }
    );
    res.json(programGallery);
  } catch (error) {
    console.log(error);
  }
};
// End get single program gallery

export const programGalleryDelete = async (req, res) => {
  try {
    const imgId = req.body.body.imgId;
    const imgFor = req.body.body.imgFor;
    let imgDir = req.body.body.imgDir;

    imgDir = imgDir.replace("http://localhost:5000/", "");
    imgDir = imgDir.replace(/\//g, "\\");

    fs.unlink(imgDir, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const imageDelete = await db.query(
      "DELETE FROM jurusan_gallery WHERE jg_id = :imgId AND jg_img_for = :imgFor",
      {
        type: QueryTypes.DELETE,
        replacements: {
          imgId: imgId,
          imgFor: imgFor,
        },
      }
    );

    res.status(200).json({ message: "successfully send data to server" });
  } catch (error) {
    console.log(error);
  }
};
