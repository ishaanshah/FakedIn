import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";

import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import BaseRouter from "./routes";
import logger from "./shared/Logger";

const app = express();

import { mongoose } from "@typegoose/typegoose";

import * as config from "./config.json";
import APIError from "./shared/Error";

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

// Setup passport strategies
require("./auth/Auth");

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

// Print API errors
app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  logger.err(err, true);
  return res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message,
  });
});

/************************************************************************************
 *                                   Connect to MongoDB
 ***********************************************************************************/
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  logger.info("MongoDB database connection established successfully!", true);
});

// Export express instance
export default app;
