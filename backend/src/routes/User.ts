import { DocumentType } from "@typegoose/typegoose";
import includes from "lodash/includes";
import { Router } from "express";
import StatusCodes from "http-status-codes";
import ApplicationModel from "src/models/Application";
import UserModel, { User } from "src/models/User";
import { completedRegistration } from "src/shared/functions";

const router = Router();

router.get("/get_user_info", function (req, res) {
  const user = req.user as DocumentType<User>;
  let data = {};
  if (user.userType === "recruiter") {
    data = {
      bio: user.bio,
      contact: user.contact,
    };
  } else if (user.userType === "applicant") {
    data = {
      skills: user.skills,
      education: user.education,
    };
  }

  res.status(StatusCodes.OK).json({
    ...data,
    name: user.name,
    email: user.email,
    userType: user.userType,
  });
});

router.post("/update_user_info", function (req, res, next) {
  (async function () {
    const user = req.user as DocumentType<User>;
    const body = req.body;

    try {
      if (user.userType === "unknown") {
        if (body.userType === "recruiter" || body.userType === "applicant") {
          user.userType = body.userType;
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "userType not provided or invalid." });
          return;
        }
      }
      user.name = body.name;

      if (user.userType === "applicant") {
        user.education = body.education;
        user.skills = body.skills;
      }

      if (user.userType === "recruiter") {
        user.contact = body.contact;
        user.bio = body.bio;
      }

      await user.save({ validateBeforeSave: true });
      res
        .status(StatusCodes.OK)
        .json({ message: "Information saved succesfully." });
    } catch (error) {
      next(error);
    }
  })();
});

router.get(
  "/get_jobs_posted",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;

      let { limit = 25, offset = 0 } = req.query;
      try {
        limit = Number(limit);
        offset = Number(offset);
        if (isNaN(limit) || isNaN(offset)) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request" });
          return;
        }

        const jobsPosted = await user.getJobsPosted(limit, offset);
        res.status(StatusCodes.OK).json(jobsPosted);
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.get(
  "/get_applications",
  completedRegistration("applicant"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;

      let { limit = 25, offset = 0 } = req.query;
      try {
        limit = Number(limit);
        offset = Number(offset);
        if (isNaN(limit) || isNaN(offset)) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request" });
          return;
        }

        const applications = await ApplicationModel.find({
          applicant: user._id,
        })
          .populate({
            path: "job",
            select: "title salary",
            populate: {
              path: "postedBy",
              select: "name",
            },
          })
          .sort({ appliedOn: "desc" });
        res.status(StatusCodes.OK).json(applications);
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.get(
  "/get_accepted",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      let { offset = 0, limit = 10, sortBy = "joinedOn" } = req.query;
      const { sortOrder = "desc" } = req.query;

      try {
        offset = Number(offset);
        limit = Number(limit);

        if (
          isNaN(offset) ||
          isNaN(limit) ||
          !includes(["title", "name", "joinedOn", "rating"], sortBy) ||
          !includes(["asc", "desc"], sortOrder)
        ) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request" });
          return;
        }

        if (sortBy === "title") {
          sortBy = "job.title";
        } else if (sortBy === "rating" || sortBy === "name") {
          sortBy = `applicant.${sortBy}`;
        }

        const accepted = await ApplicationModel.aggregate([
          {
            $match: {
              status: "accepted",
            },
          },
          {
            $lookup: {
              from: "jobs",
              localField: "job",
              foreignField: "_id",
              as: "job",
            },
          },
          {
            $unwind: "$job",
          },
          {
            $match: {
              "job.postedBy": user._id,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "applicant",
              foreignField: "_id",
              as: "applicant",
            },
          },
          {
            $unwind: "$applicant",
          },
          {
            $project: {
              joinedOn: true,
              "job.title": true,
              "applicant._id": true,
              "applicant.name": true,
              "applicant.rating": true,
            },
          },
        ])
          .sort({ [sortBy as string]: sortOrder })
          .limit(limit)
          .skip(offset);

        res.status(StatusCodes.OK).json(accepted);
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.post(
  "/rate/:userId",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const { userId } = req.params;
      let { rating } = req.body;

      try {
        rating = Number(rating);
        if (isNaN(rating) || rating < 0 || rating > 5) {
          res.status(StatusCodes.FORBIDDEN).json({ message: "Bad request" });
          return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "No user with given userId found." });
          return;
        }

        if (user.userType !== "applicant") {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: `Cannot rate user of type ${user.userType}` });
        }

        user.rating =
          (user.ratingCount! * user.rating! + rating) / (user.ratingCount! + 1);
        user.ratingCount! += 1;

        await user.save({ validateBeforeSave: true });
        res
          .status(StatusCodes.OK)
          .json({ message: "Rating submitted succesfully" });
      } catch (error) {
        next(error);
      }
    })();
  }
);

export default router;
