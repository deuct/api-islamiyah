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
  // console.log("==========CATEGORY POST===========");
  // console.log(req.body);
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryPostFor = req.body.data.postCode;

    const deleteCategoryDb = await db.query(
      "DELETE FROM categorypost WHERE categorypost_for = :categoryPostFor",
      {
        replacements: { categoryPostFor: categoryPostFor },
        type: QueryTypes.DELETE,
      }
    );
    res.status(201).json({
      message: "success delete category",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryName = req.body.data.postCategory;

    const insertCategoryDb = await Category.create({
      categorypost_name: req.body.data.postCategory,
      categorypost_for: req.body.data.postCode,
    });

    res.status(201).json({
      message: "success added new category",
    });
  } catch (error) {
    console.log(error);
  }
};
