import { DocumentType } from "@typegoose/typegoose";
import { NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import * as config from "../config.json";
import { User } from "../models/User";
import APIError from "../shared/Error";

const router = Router();

router.get("/", (_, res) => {
  res.json({ message: "hey, wassup" });
});

router.post(
  "/signup",
  passport.authenticate("signup", { failWithError: true, session: false }),
  function (req, res, next) {
    res
      .status(200)
      .json({ message: "Signed up succesfully. Login to continue." });
  },
  function (error: APIError, req: any, res: any, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
);

router.post(
  "/login",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate("login", {
    failWithError: true,
    session: false,
  }),
  function (req, res, next) {
    const user = req.user as DocumentType<User>;

    const payload = {
      userId: user._id,
      email: user.email,
    };
    const token = {
      token: jwt.sign(payload, config.JWT_SECRET),
      message: "Logged in succesfully",
    };

    res.status(200).json(token);
  },
  function (error: APIError, req: any, res: any, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
);

export default router;
