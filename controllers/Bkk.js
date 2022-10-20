// import User from "../models/UserModel.js";
import Jobs from "../models/BKKModel.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Jobs.findAll({
      attributes: [
        "company_id",
        "company_logo",
        "company_name",
        "company_address",
        "company_city",
        "job_category",
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
