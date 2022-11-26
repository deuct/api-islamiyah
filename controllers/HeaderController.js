import Header from "../models/HeaderModel.js";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

// Get all header listing
export const getHeader = async (req, res) => {
  try {
    const header = await Header.findAll({
      attributes: [
        "header_id",
        "header_title",
        "header_desc",
        "header_img_dir",
      ],
    });
    res.json(header);
  } catch (error) {
    console.log(error);
  }
};

// Get single header
export const getSingleHeader = async (req, res) => {
  try {
    const headerId = req.params.headerid;

    const header = await db.query(
      "SELECT * FROM header_content WHERE header_id = :headerId",
      {
        replacements: {
          headerId: headerId,
        },
        type: QueryTypes.SELECT,
      }
    );

    res.json({ result: header });
  } catch (error) {
    console.log(error);
  }
};

// Update Header Current
export const updateHeader = async (req, res) => {
  try {
    const headerId = req.body.headerId;
    const headerTitle = req.body.headerTitle;
    const headerDesc = req.body.headerDesc;
    var headerImgDir = "";

    if (req.body.isNewImage === "true") {
      headerImgDir = req.file.path;
      const updateHeaderDb = await db.query(
        "UPDATE header_content SET header_title = :headerTitle, header_desc = :headerDesc, header_img_dir = :headerImgDir WHERE header_id = :headerId",
        {
          replacements: {
            headerTitle: headerTitle,
            headerDesc: headerDesc,
            headerImgDir: headerImgDir,
            headerId: headerId,
          },
          type: QueryTypes.UPDATE,
        }
      );
    } else {
      headerImgDir = "";
      const updateHeaderDb = await db.query(
        "UPDATE header_content SET header_title = :headerTitle, header_desc = :headerDesc WHERE header_id = :headerId",
        {
          replacements: {
            headerTitle: headerTitle,
            headerDesc: headerDesc,
            headerId: headerId,
          },
          type: QueryTypes.UPDATE,
        }
      );
    }

    res.status(200).json({ message: "success update header" });
  } catch (error) {
    console.log(error);
  }
};

// Listing Header
export const getAllHeader = async (req, res) => {
  try {
    const headerList = await db.query("SELECT * FROM header_content", {
      type: QueryTypes.SELECT,
    });

    res.json({ result: headerList });
  } catch (error) {
    console.log(error);
  }
};

// Delete current image
export const deleteCurrImgHeader = async (req, res) => {
  try {
    const headerImg = req.query.header_img;
    const headerId = req.query.header_id;

    const deleteImgDb = await db.query(
      "UPDATE header_content SET header_img_dir = '' WHERE header_id = :headerId AND header_img_dir = :headerImg ",
      {
        replacements: { headerImg: headerImg, headerId: headerId },
        type: QueryTypes.UPDATE,
      }
    );
    fs.unlink(headerImg, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(200).json({ message: "data success sended to server" });
  } catch (error) {
    console.log(error);
  }
};
