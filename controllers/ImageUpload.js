import { QueryTypes } from "sequelize";
import db from "../config/Database.js";
import Image from "../models/ImgModel.js";

export const uploadImg = async (req, res) => {
  try {
    let img = await Image.create({
      imgpost_dir: req.file.path,
      imgpost_name: req.file.filename,
      imgpost_for: 4,
    });
    res.status(201).json({
      message: "success added photo",
      data: img,
    });
  } catch (error) {
    console.log(error);
  }
  console.log(req.file);
};

export const showImg = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT imgpost_dir, imgpost_name FROM imgpost WHERE imgpost_id = 16",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ result: result });
  } catch (error) {
    console.log(error);
  }
};
