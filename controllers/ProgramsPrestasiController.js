import ProgramPrestasi from "../models/ProgramsPrestasiModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// Insert prestasi
export const insertPrestasi = async (req, res) => {
  try {
    let programPrestasi = await ProgramPrestasi.create({
      jp_name: req.body.prestasiName,
      jp_year: req.body.prestasiTahun,
      jp_position: req.body.prestasiPosisi,
      jp_for: req.body.prestasiFor,
      jp_img_dir: req.file.path,
    });

    res.status(200).json({ message: "success send data to server" });
  } catch (error) {
    console.log(error);
  }
};
// End insert prestasi

// Get single program prestasi
export const getSingleProgramPrestasi = async (req, res) => {
  try {
    const jpFor = req.params.idjurusan;
    let programPrestasi = await db.query(
      "SELECT * FROM jurusan_prestasi WHERE jp_for = :jpFor",
      { type: QueryTypes.SELECT, replacements: { jpFor: jpFor } }
    );

    res.json(programPrestasi);
  } catch (error) {
    console.log(error);
  }
};
// End get single program prestasi

// Delete program prestasi
export const deleteProgramPrestasi = async (req, res) => {
  try {
    const jpId = req.body.body.prestasiId;
    let jpImg = req.body.body.prestasiImg;
    const jpFor = req.body.body.prestasiFor;

    jpImg = jpImg.replace("http://localhost:5000/", "");
    jpImg = jpImg.replace(/\//g, "\\");
    // jpImg = jpImg.replace(/\//g, "ForwardSlash");

    console.log(jpId, jpImg, jpFor);

    const deleteimage = await db.query(
      "DELETE FROM jurusan_prestasi WHERE jp_id = :jpId AND jp_for = :jpFor",
      {
        type: QueryTypes.DELETE,
        replacements: {
          jpId: jpId,
          jpFor: jpFor,
        },
      }
    );

    fs.unlink(jpImg, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// End delete program prestasi
