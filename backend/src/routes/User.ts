import { DocumentType } from "@typegoose/typegoose";
import { Router } from "express";
import StatusCodes from "http-status-codes";
import { User } from "src/models/User";
import APIError from "src/shared/Error";

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
          const error = new APIError("userType not provided.");
          error.status = 400;
          throw error;
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
      res.status(200).json({ message: "Information saved succesfully." });
    } catch (error) {
      next(error);
    }
  })();
});

export default router;
