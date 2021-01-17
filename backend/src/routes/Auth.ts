import { DocumentType } from "@typegoose/typegoose";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import * as config from "../config.json";
import { User } from "../models/User";

const router = Router();

router.post(
  "/signup",
  passport.authenticate("signup", { failWithError: true, session: false }),
  function (req, res) {
    res
      .status(StatusCodes.OK)
      .json({ message: "Signed up succesfully. Login to continue." });
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

    res.status(StatusCodes.OK).json(token);
  }
);

export default router;
