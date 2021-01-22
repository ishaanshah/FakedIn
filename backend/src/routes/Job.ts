import { DocumentType } from "@typegoose/typegoose";
import { Router } from "express";
import StatusCodes from "http-status-codes";
import includes from "lodash/includes";
import JobModel, { Job } from "src/models/Job";
import ApplicationModel from "src/models/Application";
import { User } from "src/models/User";
import { completedRegistration } from "src/shared/functions";

const router = Router();

router.get("/", completedRegistration("any"), function (req, res, next) {
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
        return;
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

router.get(
  "/get_job_info/:jobId",
  completedRegistration("any"),
  function (req, res, next) {
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
  }
);

router.post(
  "/post_job",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const body = req.body;

      try {
        await JobModel.create({
          title: body.title,
          postedBy: user._id,
          maxApplicants: body.maxApplicants,
          positions: body.positions,
          deadline: new Date(body.deadline),
          skillsRequired: body.skillsRequired,
          jobType: body.jobType,
          duration: body.duration,
          salary: body.salary,
        });

        res.status(StatusCodes.OK).json({ message: "Job created succesfully" });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.post(
  "/edit_job",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const { jobId, deadline, maxApplicants, positions } = req.body;

      try {
        const job = await JobModel.findById(jobId);
        if (!job) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "No job with the given jobId found",
          });
          return;
        }

        if (!job.isActive) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Cannot edit an inactive job",
          });
        }

        if (String(job.postedBy) !== String(user._id)) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Not authorized to edit the job",
          });
          return;
        }

        await job.populate("applicationCount").execPopulate();
        if ((job.applicationCount as number) > maxApplicants) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: `Max application count should be more than or equal
             to current number of applications`,
          });
          return;
        }

        const accepted = await ApplicationModel.find({
          job: job._id,
          status: "accepted",
        }).count();
        if (accepted > positions) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: `Positions should be more than or equal to
             current number of accepted applications`,
          });
          return;
        }

        if (job.deadline > new Date(deadline)) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Updated deadline should be after previous deadline",
          });
          return;
        }

        // Mark job as inactive because all positions have been filled
        if (accepted === positions) {
          job.isActive = false;
        }

        job.deadline = new Date(deadline);
        job.positions = positions;
        job.maxApplicants = maxApplicants;

        await job.save({ validateBeforeSave: true });
        res.status(StatusCodes.OK).json({ message: "Job edited succesfully" });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.post(
  "/delete_job",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const { jobId } = req.body;

      try {
        const job = await JobModel.findById(jobId);
        if (!job) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "No job with the given jobId found",
          });
          return;
        }

        if (!job.isActive) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Cannot delete an inactive job",
          });
        }

        if (String(job.postedBy) !== String(user._id)) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Not authorized to delete the job",
          });
          return;
        }

        await ApplicationModel.deleteMany({ job: jobId });
        await JobModel.deleteOne({ _id: jobId });
        res.status(StatusCodes.OK).json({
          message: "Job deleted succesfully",
        });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.post(
  "/apply/:jobId",
  completedRegistration("applicant"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const { jobId } = req.params;
      const { sop } = req.body;

      try {
        // Check if active applications are less than 10
        const activeApplications = await user.getActiveApplicationsCount();
        if (activeApplications !== undefined && activeApplications > 10) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "You're allowed to have at max 10 active applications",
          });
          return;
        }

        // Check if already has been accepted in any other job
        if (await user.isAccepted()) {
          res.status(StatusCodes.FORBIDDEN).json({
            message:
              "Can't apply to new jobs as you have already been accepted into one",
          });
          return;
        }

        // Check if job max applications have been
        // reached or deadline has been crossed
        const job = await JobModel.findById(jobId);
        if (!job) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "No job with the given jobId found",
          });
          return;
        }
        if ((await job.isFull()) || job.deadline < new Date()) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "This job is not accepting any new applications",
          });
          return;
        }

        await ApplicationModel.create({
          applicant: user._id,
          job: jobId,
          sop,
        });

        res.status(StatusCodes.OK).json({ message: "Application received" });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.get("/test/:jobId", function (req, res, next) {
  (async function () {
    const user = req.user as DocumentType<User>;
    const { jobId } = req.params;
    const job = await JobModel.findById(jobId);

    res.status(200).json({ hey: await job?.isFull() });
  })();
});

export default router;
