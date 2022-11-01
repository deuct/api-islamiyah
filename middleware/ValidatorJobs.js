import { body } from "express-validator";

export const validate = (method) => {
  switch (method) {
    case "handleJob": {
      return [
        body("jobCode")
          .not()
          .isEmpty()
          .withMessage("job code is required")
          .trim()
          .escape(),
        body("companyName")
          .not.isEmpty()
          .withMessage("name is required")
          .trim()
          .escape(),
        body("jobTitle")
          .not.isEmpty()
          .withMessage("job title is required")
          .trim()
          .escape(),
        body("jobStatus")
          .not.isEmpty()
          .withMessage("job status is required")
          .trim()
          .escape(),
        body("companyCity")
          .not.isEmpty()
          .withMessage("company city is required")
          .trim()
          .escape(),
        body("companyAddress")
          .not.isEmpty()
          .withMessage("company address is required")
          .trim()
          .escape(),
        body("jobRequirement")
          .not.isEmpty()
          .withMessage("job requirement is required")
          .trim()
          .escape(),
        body("description")
          .not.isEmpty()
          .withMessage("description is required")
          .trim()
          .escape(),
      ];
    }
  }
};
