import ProgramDokumen from "../models/ProgramsDokumenModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// insert dokumen
export const insertDokumen = async (req, res) => {
  try {
    let programDokumen = await ProgramDokumen.create({
      jd_name: req.body.dokumenName,
      jd_document_dir: req.file.path,
      jd_for: req.body.dokumenFor,
    });

    res.status(200).json({ message: "success send data to server" });
  } catch (error) {
    console.log(error);
  }
};
// End insert dokumen

// Get single dokumen
export const getSingleDokumen = async (req, res) => {
  try {
    const jdFor = req.params.idjurusan;
    let dokumen = await db.query(
      "SELECT * FROM jurusan_document WHERE jd_for = :jdFor",
      {
        type: QueryTypes.SELECT,
        replacements: {
          jdFor: jdFor,
        },
      }
    );
    res.json(dokumen);
  } catch (error) {
    console.log(error);
  }
};
// End get single dokumen

// Delete dokumen
export const deleteDokumen = async (req, res) => {
  try {
    const jdId = req.body.body.jdId;
    const dokumenFor = req.body.body.dokumenFor;

    const dokumen = await db.query(
      "SELECT jd_document_dir FROM jurusan_document WHERE jd_id = :jdId",
      { type: QueryTypes.SELECT, replacements: { jdId: jdId } }
    );
    let dokumenDir = dokumen[0].jd_document_dir;
    console.log(dokumenDir);

    // dokumenDir = dokumenDir.replace("http://localhost:5000/", "");
    // dokumenDir = dokumenDir.replace(/\//g, "\\");
    // dokumenDir = dokumenDir.replace(/\//g, "ForwardSlash");

    fs.unlink(dokumenDir, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const dokumenDelete = await db.query(
      "DELETE FROM jurusan_document WHERE jd_id = :jdId AND jd_for = :dokumenFor",
      {
        type: QueryTypes.DELETE,
        replacements: {
          jdId: jdId,
          dokumenFor: dokumenFor,
        },
      }
    );
    res.status(200).json({ message: "successfully send data to server" });
  } catch (error) {
    console.log(error);
  }
};
// End delete dokumen

// // Get dokumen by jurusan for
// export const getDokumenByJurusan = async (req, res) => {
//   try {
//     const jurusanFor = req.body.jurusanFor;

//     const resJurusan = await db.query(
//       "SELECT jd_name, jd_document_dir from jurusan_dokumen WHERE jd_for = :jurusanFor",
//       { type: QueryTypes.SELECT, replacements: { jurusanFor: jurusanFor } }
//     );

//     res.status(200).json(resJurusan);
//   } catch (error) {
//     console.log(error);
//   }
// };
// // End get dokumen by jurusan for
