import { Router } from "express";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "src/models/User";
import StatusCodes from "http-status-codes";
import ApplicationModel from "src/models/Application";
import { completedRegistration } from "src/shared/functions";

const router = Router();

router.get(
  "/get_application_info/:appId",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const { appId } = req.params;

      try {
        const application = await ApplicationModel.findById(appId);

        if (!application) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "No application with the given appId found",
          });
          return;
        }

        const jobDetails = await application.getJobDetails();
        if (String(jobDetails?.postedBy) !== String(user._id)) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Not authorised to view applicants for the given job",
          });
          return;
        }

        res.status(StatusCodes.OK).json({
          sop: application.sop,
          appliedOn: application.appliedOn,
          applicant: await application.getApplicantDetails(),
          status: application.status,
        });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.get(
  "/shortlist/:appId",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const { appId } = req.params;

      try {
        const application = await ApplicationModel.findById(appId);

        if (!application) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "No application with the given appId found",
          });
          return;
        }

        const jobDetails = await application.getJobDetails();
        if (String(jobDetails?.postedBy) !== String(user._id)) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Not authorised to shortlist applicants for the given job",
          });
          return;
        }

        if (application.status !== "applied") {
          res.status(StatusCodes.FORBIDDEN).json({
            message: `Cannot shortlist ${
              application.status as string
            } applicants`,
          });
          return;
        }

        application.status = "shortlisted";
        await application.save({ validateBeforeSave: true });

        res
          .status(StatusCodes.OK)
          .json({ message: "Applicant shortlisted successfully" });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.get(
  "/reject/:appId",
  completedRegistration("recruiter"),
  function (req, res, next) {
    (async function () {
      const user = req.user as DocumentType<User>;
      const { appId } = req.params;

      try {
        const application = await ApplicationModel.findById(appId);

        if (!application) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "No application with the given appId found",
          });
          return;
        }

        const jobDetails = await application.getJobDetails();
        if (String(jobDetails?.postedBy) !== String(user._id)) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Not authorised to rejected applicants for the given job",
          });
          return;
        }

        if (
          application.status !== "applied" &&
          application.status !== "shortlisted"
        ) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: `Cannot reject ${application.status as string} applicants`,
          });
          return;
        }

        application.status = "rejected";
        await application.save({ validateBeforeSave: true });

        res
          .status(StatusCodes.OK)
          .json({ message: "Applicant rejected successfully" });
      } catch (error) {
        next(error);
      }
    })();
  }
);

export default router;
