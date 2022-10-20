import Posts from "../models/PostModel.js";
import { Sequelize, QueryTypes, json } from "sequelize";
import db from "../config/Database.js";
import User from "../models/UserModel.js";

export const getPosts = async (req, res) => {
  try {
    // const posts = await db.query("SELECT * FROM post ", {
    //   type: QueryTypes.SELECT,
    // });
    // const posts = await db.query(
    //   "SELECT distinct post.post_name, imgpost.imgpost_dir FROM post RIGHT JOIN imgpost ON imgpost_for = post_id"
    // );
    const [result, metadata] = await db.query(
      "SELECT post.post_id, post.post_name, post.post_type, post.post_shortdesc, post.post_desc, post.createdAt,imgpost.imgpost_for, imgpost.imgpost_dir FROM post JOIN imgpost ON imgpost.imgpost_for = post.post_id GROUP BY post.post_id ORDER BY post.createdAt "
    );
    res.json(result);
    // res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const getPostSecond = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;
    var postType = req.query.post_type || "";
    postType = postType.replace(/[^\w\s]/gi, "");

    if (postType === "") {
      const totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM post WHERE post_name LIKE :search",
        {
          replacements: { search: "%" + search + "%" },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );

      var totalRowsRes = JSON.parse(JSON.stringify(totalRows));
      totalRowsRes = totalRowsRes["totalRows"];

      const totalPage = Math.ceil(totalRowsRes / limit);

      const result = await db.query(
        "SELECT post.post_id, post.post_name, post.post_type, post.post_shortdesc, post.post_desc, post.createdAt,imgpost.imgpost_for, imgpost.imgpost_dir FROM post JOIN imgpost ON imgpost.imgpost_for = post.post_id WHERE post.post_name LIKE :search GROUP BY post.post_id ORDER BY post.createdAt LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
          },
          type: QueryTypes.SELECT,
        }
      );
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRowsRes,
        totalPage: totalPage,
      });
    } else {
      const totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM post WHERE post_name LIKE :search AND post_type = :postType",
        {
          replacements: { search: "%" + search + "%", postType: postType },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );

      var totalRowsRes = JSON.parse(JSON.stringify(totalRows));
      totalRowsRes = totalRowsRes["totalRows"];

      const totalPage = Math.ceil(totalRowsRes / limit);

      const result = await db.query(
        "SELECT post.post_id, post.post_name, post.post_type, post.post_shortdesc, post.post_desc, post.createdAt,imgpost.imgpost_for, imgpost.imgpost_dir FROM post JOIN imgpost ON imgpost.imgpost_for = post.post_id WHERE post.post_name LIKE :search AND post.post_type = :postType GROUP BY post.post_id ORDER BY post.createdAt LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
            postType: postType,
          },
          type: QueryTypes.SELECT,
        }
      );
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRowsRes,
        totalPage: totalPage,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getOnePost = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT * FROM post WHERE post_id = (:postid)",
      {
        replacements: { postid: req.params.postid },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getImgPerPost = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT * FROM imgpost WHERE imgpost_for = (:imgpostid)",
      {
        replacements: { imgpostid: req.params.imgpostid },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryPerPost = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT * FROM categorypost WHERE categorypost_for = (:categorypostid)",
      {
        replacements: { categorypostid: req.params.categorypostid },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};