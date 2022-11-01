import Jobs from "../models/BKKModel.js";
import { validationResult } from "express-validator";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";

// Get all job for listing
export const getJobs = async (req, res) => {
  try {
    const jobs = await Jobs.findAll({
      attributes: [
        "company_id",
        "company_logo",
        "company_name",
        "company_address",
        "company_city",
        "job_title",
        "job_status",
        "job_short_desc",
        "job_desc",
        "job_requirement",
      ],
    });
    res.json(jobs);
  } catch (error) {
    console.log(error);
  }
};

// Get single job by id
export const getJobById = async (req, res) => {
  try {
    const response = await Jobs.findOne({
      where: {
        company_id: req.params.company_id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Insert Job
export const insertJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let job = await Jobs.create({
      company_logo: req.file.path,
      company_id: req.body.jobCode,
      company_name: req.body.companyName,
      company_address: req.body.companyAddress,
      company_city: req.body.companyCity,
      job_title: req.body.jobTitle,
      job_status: req.body.jobStatus,
      job_requirement: req.body.jobRequirement,
      job_desc: req.body.description,
      job_short_desc: req.body.shortDesc,
    });
    res.status(200).json({ message: "server received the data" });
  } catch (error) {
    console.log(error);
  }
};

// Get last id of job
export const getJobId = async (req, res) => {
  try {
    const [result, metadata] = await db.query(
      "SELECT company_id FROM jobs_bkk ORDER BY company_id DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
  console.log(res);
};

// Listing jobs for dashboard
export const listingJobDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;
    // var postType = req.query.post_type || "";
    var jobStatus = req.query.job_status || "";

    if (jobStatus === "") {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM jobs_bkk WHERE job_title LIKE :search OR company_name LIKE :search",
        {
          replacements: { search: "%" + search + "%" },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT company_id, company_name, job_title, job_status, job_short_desc, CAST(createdAt AS DATE) AS createdAt FROM jobs_bkk WHERE company_name LIKE :search OR job_title LIKE :search GROUP BY company_id  ORDER BY jobs_bkk.createdAt ASC LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
          },
          type: QueryTypes.SELECT,
        }
      );
    } else {
      var totalRows = await db.query(
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM jobs_bkk WHERE job_title LIKE :search OR company_name LIKE :search AND job_status LIKE :jobStatus",
        {
          replacements: { search: "%" + search + "%" },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
          jobStatus: jobStatus,
        }
      );
      var result = await db.query(
        "SELECT company_id, company_name, job_title, job_status, job_short_desc, CAST(createdAt AS DATE) AS createdAt FROM jobs_bkk WHERE company_name LIKE :search OR job_title LIKE :search AND job_status = :jobStatus GROUP BY company_id  ORDER BY jobs_bkk.createdAt ASC LIMIT :limit OFFSET :offset",
        {
          replacements: {
            search: "%" + search + "%",
            limit: limit,
            offset: offset,
            jobStatus: jobStatus,
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
