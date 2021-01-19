import StatusCodes from "http-status-codes";
import { Router } from "express";
import JobModel, { Job } from "src/models/Job";
import includes from "lodash/includes";
import UserModel from "src/models/User";

const router = Router();

router.get("/", function (req, res, next) {
  (async function () {
    let {
      offset = 0,
      limit = 10,
      minSalary = 1000,
      maxSalary = 10000,
      duration = 0,
    } = req.query;
    const {
      sortBy = "salary",
      sortOrder = "desc",
      jobType = "any",
    } = req.query;

    try {
      offset = Number(offset);
      limit = Number(limit);
      minSalary = Number(minSalary);
      maxSalary = Number(maxSalary);
      duration = Number(duration);

      if (
        isNaN(offset) ||
        isNaN(limit) ||
        isNaN(minSalary) ||
        isNaN(maxSalary) ||
        isNaN(duration) ||
        !includes(["salary", "duration", "rating"], sortBy) ||
        !includes(["asc", "desc"], sortOrder) ||
        !includes(["any", "home", "part", "full"], jobType)
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request" });
      }

      const findFilter: any = {
        salary: { $gte: minSalary, $lte: maxSalary },
        deadline: { $gte: new Date() },
      };
      if (jobType !== "any") {
        findFilter.jobType = jobType as Job["jobType"];
      }
      if (duration > 0) {
        findFilter.duration = { $lt: duration, $gt: 0 };
      }

      const jobs = await JobModel.find(findFilter)
        .select("_id")
        .sort({ [sortBy as string]: sortOrder })
        .skip(offset)
        .limit(limit);

      res.status(StatusCodes.OK).json(
        jobs.map((job) => {
          return {
            jobId: job._id,
          };
        })
      );
    } catch (error) {
      next(error);
    }
  })();
});

router.get("/get_job_info/:jobId", function (req, res, next) {
  (async function () {
    const jobId = req.params.jobId;

    try {
      const job = await JobModel.findById(jobId);

      if (!job) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "No job with given jobId found." });

        return;
      }

      res.status(StatusCodes.OK).json({
        jobId: job._id,
        title: job.title,
        postedBy: await job.getPosterDetails(),
        postedOn: job.postedOn,
        skillsRequired: job.skillsRequired,
        maxApplicants: job.maxApplicants,
        positions: job.positions,
        deadline: job.deadline,
        jobType: job.jobType,
        duration: job.duration,
        salary: job.salary,
        rating: job.rating,
      });
    } catch (error) {
      next(error);
    }
  })();
});

export default router;
