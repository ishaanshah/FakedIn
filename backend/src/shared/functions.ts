import { NextFunction, Request, Response } from "express";
import { User } from "src/models/User";
import { DocumentType } from "@typegoose/typegoose";
import logger from "./Logger";
import { StatusCodes } from "http-status-codes";

export function completedRegistration(
  userType: "recruiter" | "applicant" | "any"
) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const user = req.user as DocumentType<User>;

    if (user.userType === "unknown") {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Registration incomplete." });
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
