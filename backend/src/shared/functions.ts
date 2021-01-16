import { NextFunction, Request, Response } from "express";
import APIError from "src/shared/Error";
import { User } from "src/models/User";
import { DocumentType } from "@typegoose/typegoose";
import logger from "./Logger";
import { StatusCodes } from "http-status-codes";

export const pErr = (err: Error) => {
  if (err) {
    logger.err(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export function completedRegistration(
  userType: "recruiter" | "applicant" | "any"
) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const user = req.user as DocumentType<User>;

    if (user.userType === "unknown") {
      res
        .status(StatusCodes.TEMPORARY_REDIRECT)
        .json({ redirect_to: "/choose" });
    } else {
      if (userType !== "any" && userType !== user.userType) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: `Not allowed for user of type ${user.userType}` });
      } else {
        next();
      }
    }
  };
}
