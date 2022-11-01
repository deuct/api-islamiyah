import Category from "../models/CategoryModel.js";
import { Sequelize, QueryTypes, json } from "sequelize";
import db from "../config/Database.js";

export const insertCategory = async (req, res) => {
  try {
    const category = await Category.create({
      categorypost_name: req.body.data.postCategory,
      categorypost_for: req.body.data.postCode,
    });
    res.status(201).json({
      message: "success added new category",
      data: category,
    });
  } catch (error) {
    console.log(error);
  }
  console.log("==========CATEGORY POST===========");
  console.log(req.body);
};

// export const getCategory = async (req, res) => {
//   try {
//     const postCode = req.body.data.postCode;
//     const [result, metadata] = await db.query(
//       "SELECT categorypost_name FROM categorypost WHERE categorypost_for = :postcode",
//       {
//         replacements: { postCode: postCode },
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
