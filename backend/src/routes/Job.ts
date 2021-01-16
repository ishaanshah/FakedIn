import StatusCodes from "http-status-codes";
import { Router } from "express";
import JobModel, { Job } from "src/models/Job";
import includes from "lodash/includes";

const router = Router();

router.get("/", function (req, res, next) {
  (async function () {
    let {
      offset = 0,
      limit = 25,
      minSalary = 1000,
      maxSalary = 10000,
      duration = 0,
    } = req.query;
    const { sortBy = "salary", order = "desc", jobType = "any" } = req.query;

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
        !includes(["asc", "desc"], order)
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request" });
      }

      const findFilter: any = {
        salary: { $gte: minSalary, $lte: maxSalary },
      };
      if (jobType !== "any") {
        findFilter.jobType = jobType as Job["jobType"];
      }
      if (duration > 0) {
        findFilter.duration = { $lt: duration, $gt: 0 };
      }

      const jobs = await JobModel.find(findFilter)
        .select("_id")
        .sort({ [sortBy as string]: order })
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

export default router;
