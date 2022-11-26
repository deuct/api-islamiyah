import Programs from "../models/ProgramsModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// Get last id programs
export const getProgramsId = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT jurusan_id FROM jurusan ORDER BY createdAt DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
// End get last id programs

// Get all jurusan
export const getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;

    var totalRows = await db.query(
      "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM jurusan WHERE jurusan_name LIKE :search",
      {
        replacements: { search: "%" + search + "%" },
        type: QueryTypes.SELECT,
        raw: true,
        plain: true,
        nest: true,
      }
    );

    const result = await db.query(
      "SELECT jr.*, tc.teacher_name as teachername, jg.jg_img_dir FROM jurusan jr INNER JOIN teachers tc ON tc.teacher_id = jr.jurusan_kaprog_id INNER JOIN jurusan_gallery jg ON jg_img_for = jr.jurusan_id WHERE jurusan_name LIKE :search GROUP BY jurusan_id ORDER BY createdAt ASC LIMIT :limit OFFSET :offset",
      {
        type: QueryTypes.SELECT,
        replacements: {
          search: "%" + search + "%",
          limit: limit,
          offset: offset,
        },
      }
    );

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
// End get all jurusan

// Insert programs
export const insertProgram = async (req, res) => {
  try {
    let program = await Programs.create({
      jurusan_id: req.body.body.jurusanId,
      jurusan_slug: req.body.body.jurusanSlug,
      jurusan_name: req.body.body.jurusanName,
      jurusan_kaprog_id: req.body.body.jurusanKaprogId,
      jurusan_about: req.body.body.jurusanAbout,
      jurusan_visi: req.body.body.jurusanVisi,
      jurusan_misi: req.body.body.jurusanMisi,
    });

    res.status(200).json({ message: "success send data to server" });
  } catch (err) {
    console.log(err);
  }
};
// End insert programs

// Update programs
export const updateProgram = async (req, res) => {
  try {
    const jurusanId = req.body.body.jurusanId;
    const jurusanSlug = req.body.body.jurusanSlug;
    const jurusanName = req.body.body.jurusanName;
    const jurusanKaprogId = req.body.body.jurusanKaprogId;
    const jurusanAbout = req.body.body.jurusanAbout;
    const jurusanVisi = req.body.body.jurusanVisi;
    const jurusanMisi = req.body.body.jurusanMisi;

    console.log(jurusanSlug);
    // console.log(req.body);

    // console.log(req.body);
    const programme = await db.query(
      "UPDATE jurusan SET jurusan_name = :jurusanName, jurusan_slug = :jurusanSlug, jurusan_kaprog_id = :jurusanKaprogId, jurusan_about = :jurusanAbout, jurusan_visi = :jurusanVisi, jurusan_misi = :jurusanMisi WHERE jurusan_id = :jurusanId",
      {
        replacements: {
          jurusanId: jurusanId,
          jurusanSlug: jurusanSlug,
          jurusanName: jurusanName,
          jurusanKaprogId: jurusanKaprogId,
          jurusanAbout: jurusanAbout,
          jurusanVisi: jurusanVisi,
          jurusanMisi: jurusanMisi,
        },
        type: QueryTypes.UPDATE,
      }
    );
    console.log(jurusanName);

    res.status(200).json({ message: "success send data to server" });
  } catch (error) {
    console.log(error);
  }
};
// End update programs

// Get program by id
export const getSingleProgram = async (req, res) => {
  try {
    const jurusanId = req.params.idjurusan;
    let program = await db.query(
      "SELECT jr.*, tc.teacher_name, tc.teacher_photo_dir FROM jurusan jr INNER JOIN teachers tc ON tc.teacher_id = jr.jurusan_kaprog_id WHERE jurusan_id = :jurusanId",
      {
        type: QueryTypes.SELECT,
        replacements: {
          jurusanId: jurusanId,
        },
      }
    );
    res.json(program);
  } catch (error) {
    console.log(error);
  }
};
// End get program by id

// Get id jurusan by slug
export const getIdJurusanBySlug = async (req, res) => {
  try {
    console.log(req);
    console.log("running function");
    const slug = req.body.programSlug;

    const result = await db.query(
      "SELECT jurusan_id from jurusan WHERE jurusan_slug = :slug",
      {
        type: QueryTypes.SELECT,
        replacements: {
          slug: slug,
        },
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
// End get id jurusan by slug

// // Get visim
// export const publicJurusan = async (req,res) => {
//   try {
//     const idJurusan = req.body
//   } catch (error) {
//     console.log(error);
//   }
// }
// // End get jurusan by id for public view
