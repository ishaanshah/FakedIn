import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";
import { User } from "src/models/User";
import { DocumentType } from "@typegoose/typegoose";

const router = Router();

router.get("/get_user_info", function (req, res, next) {
  const user = req.user as DocumentType<User>;
  res.status(StatusCodes.OK).json(user.toJSON());
});

export default router;
