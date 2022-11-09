import Jobs from "../models/BKKModel.js";
import { validationResult } from "express-validator";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import * as fs from "fs";

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
    // const response = await Jobs.findOne({
    //   where: {
    //     company_id: req.params.company_id,
    //   },
    // });
    const companyId = req.params.company_id;
    console.log(companyId);
    const response = await db.query(
      "SELECT * FROM jobs_bkk WHERE company_id = :companyId",
      { replacements: { companyId: companyId }, type: QueryTypes.SELECT }
    );
    res.json({ result: response });
    console.log("================");
    console.log(companyId);
    console.log("================");
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
      "SELECT company_id FROM jobs_bkk ORDER BY createdAt DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

// Listing jobs for dashboard
export const listingJobDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    var search = req.query.search_query || "";
    search = search.replace(/[^\w\s]/gi, "");
    const offset = limit * page;
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
        "SELECT company_id, company_logo, company_name, job_title, job_status, job_short_desc, CAST(createdAt AS DATE) AS createdAt FROM jobs_bkk WHERE company_name LIKE :search OR job_title LIKE :search GROUP BY company_id  ORDER BY jobs_bkk.createdAt ASC LIMIT :limit OFFSET :offset",
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
        "SELECT CONVERT(COUNT (*), CHAR) as totalRows FROM jobs_bkk WHERE (job_title LIKE :search OR company_name LIKE :search) AND job_status = :jobStatus",
        {
          replacements: { search: "%" + search + "%", jobStatus: jobStatus },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
          nest: true,
        }
      );
      var result = await db.query(
        "SELECT company_id, company_logo, company_name, job_title, job_status, job_short_desc, CAST(createdAt AS DATE) AS createdAt FROM jobs_bkk WHERE (company_name LIKE :search OR job_title LIKE :search) AND job_status = :jobStatus GROUP BY company_id  ORDER BY jobs_bkk.createdAt ASC LIMIT :limit OFFSET :offset",
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

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.query.job_id;
    const jobImg = req.query.job_img;

    fs.unlink(jobImg, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const [result, metadata] = await db.query(
      "DELETE FROM jobs_bkk WHERE company_id = :jobId",
      {
        replacements: { jobId: jobId, type: QueryTypes.DELETE },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

// Update job current
export const updateJob = async (req, res) => {
  try {
    const companyId = req.body.companyId;
    const companyName = req.body.companyName;
    const jobTitle = req.body.jobTitle;
    const jobStatus = req.body.jobStatus;
    const companyCity = req.body.companyCity;
    const companyAddress = req.body.companyAddress;
    const jobRequirement = req.body.jobRequirement;
    const jobShortDesc = req.body.shortDesc;
    const description = req.body.description;

    var companyLogo = "";
    if (req.body.isNewImage === "true") {
      console.log("true");
      companyLogo = req.file.path;
      const updCompanyDb = await db.query(
        "UPDATE jobs_bkk SET company_id = :companyId, company_name = :companyName, company_address = :companyAddress, company_city = :companyCity, job_title = :jobTitle, job_status = :jobStatus, job_short_desc = :jobShortDesc, job_desc = :description, job_requirement = :jobRequirement, company_logo = :companyLogo  WHERE company_id = :companyId",
        {
          replacements: {
            companyLogo: companyLogo,
            companyId: companyId,
            companyName: companyName,
            jobTitle: jobTitle,
            jobStatus: jobStatus,
            companyCity: companyCity,
            companyAddress: companyAddress,
            jobRequirement: jobRequirement,
            jobShortDesc: jobShortDesc,
            description: description,
          },
          type: QueryTypes.UPDATE,
        }
      );
    } else if (req.body.isNewImage === "false") {
      companyLogo = "";
      console.log("false");
      const updTeacherDb = await db.query(
        "UPDATE jobs_bkk SET company_id = :companyId, company_name = :companyName, company_address = :companyAddress, company_city = :companyCity, job_title = :jobTitle, job_status = :jobStatus, job_short_desc = :jobShortDesc, job_desc = :description, job_requirement = :jobRequirement WHERE company_id = :companyId",
        {
          replacements: {
            companyId: companyId,
            companyName: companyName,
            jobTitle: jobTitle,
            jobStatus: jobStatus,
            companyCity: companyCity,
            companyAddress: companyAddress,
            jobRequirement: jobRequirement,
            jobShortDesc: jobShortDesc,
            description: description,
          },
          type: QueryTypes.UPDATE,
        }
      );
    }
    res.status(200).json({ message: "data success sended to server" });
  } catch (error) {
    console.log(error);
  }
};

// Delete current image
export const deleteCurrImgJob = async (req, res) => {
  try {
    const companyLogo = req.query.company_logo;
    const companyId = req.query.company_id;

    const deleteImgDb = await db.query(
      "UPDATE jobs_bkk SET company_logo = '' WHERE company_id = :companyId AND company_logo = :companyLogo ",
      {
        replacements: { companyLogo: companyLogo, companyId: companyId },
        type: QueryTypes.UPDATE,
      }
    );
    fs.unlink(companyLogo, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(200).json({ message: "data success sended to server" });
  } catch (error) {
    console.log(error);
  }
};
