import Posts from "../models/PostModel.js";
import { Sequelize, QueryTypes, json } from "sequelize";
import db from "../config/Database.js";
import * as fs from "fs";

// Get id post
export const getIdPost = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT post_id FROM post ORDER BY createdAt DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

// Get all post
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
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM post WHERE post_name LIKE :search AND post_status = 'posted'",
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
        "SELECT post.post_id, post.post_name, post.post_type, post.post_shortdesc, post.post_desc, post.createdAt,imgpost.imgpost_for, imgpost.imgpost_dir FROM post LEFT JOIN imgpost ON imgpost.imgpost_for = post.post_id WHERE post.post_name LIKE :search AND post.post_status = 'posted' GROUP BY post.post_id ORDER BY post.createdAt LIMIT :limit OFFSET :offset",
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
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM post WHERE post_name LIKE :search AND post_type = :postType AND post_status = 'posted'",
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
        "SELECT post.post_id, post.post_name, post.post_type, post.post_shortdesc, post.post_desc, post.createdAt,imgpost.imgpost_for, imgpost.imgpost_dir FROM post LEFT JOIN imgpost ON imgpost.imgpost_for = post.post_id WHERE post.post_name LIKE :search AND post.post_type = :postType AND post.post_status = 'posted' GROUP BY post.post_id ORDER BY post.createdAt LIMIT :limit OFFSET :offset",
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

// Get single post
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

// get img every post
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

// get category every post
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

// Listing post for dashboard
export const listingPostDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;
    var postType = req.query.post_type || "";

    if (postType === "") {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM post WHERE post_name LIKE :search",
        {
          replacements: { search: "%" + search + "%" },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT post_id, post_name, post_status, post_type, post_shortdesc, CAST(createdAt AS DATE) AS createdAt FROM post WHERE post_name like :search GROUP BY post_id  ORDER BY post.createdAt ASC LIMIT :limit OFFSET :offset",
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
    } else {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM post WHERE post_name LIKE :search AND post_type LIKE :postType",
        {
          replacements: { search: "%" + search + "%", postType: postType },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT post_id, post_name, post_status, post_type, post_shortdesc, CAST(createdAt AS DATE) AS createdAt FROM post WHERE post_name like :search AND post_type = :postType GROUP BY post_id  ORDER BY post.createdAt ASC LIMIT :limit OFFSET :offset",
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
    }

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

// Insert post
export const insertPost = async (req, res) => {
  try {
    let post = await Posts.create({
      post_id: req.body.data.postCode,
      post_name: req.body.data.postTitle,
      post_status: req.body.data.postStatus,
      post_type: req.body.data.postType,
      post_shortdesc: req.body.data.postShortDesc,
      post_desc: req.body.data.postDesc,
      createdAt: req.body.data.postDate,
    });
    res.status(201).json({
      message: "success added new post",
      data: post,
    });
  } catch (error) {
    console.log(error);
  }
  console.log(req.body.data);
  console.log(req.body.data.postCode);
};

// Delete Single Post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postid;

    const result = await db.query("DELETE FROM post WHERE post_id = :postId", {
      replacements: { postId: postId },
      type: QueryTypes.DELETE,
    });

    const resultCategory = await db.query(
      "DELETE FROM categorypost WHERE categorypost_for = :postId",
      {
        replacements: {
          postId: postId,
        },
        type: QueryTypes.DELETE,
      }
    );
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Delete Img Single Post
export const deleteImgPost = async (req, res) => {
  try {
    const idImg = req.params.imgpostfor_id;
    const getImgDelete = await db.query(
      "SELECT imgpost_dir FROM imgpost WHERE imgpost_for = :idImg",
      {
        replacements: {
          idImg: idImg,
        },
        type: QueryTypes.SELECT,
      }
    );
    getImgDelete.map((imgdir) => {
      console.log(imgdir.imgpost_dir);
      fs.unlink(imgdir.imgpost_dir, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
    res.status(201).json({
      message: "success deleted image post",
    });
  } catch (error) {
    console.log(error);
  }
};
