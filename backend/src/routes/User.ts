import { DocumentType } from "@typegoose/typegoose";
import { Router } from "express";
import StatusCodes from "http-status-codes";
import ApplicationModel from "src/models/Application";
import { User } from "src/models/User";
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

export default router;
