import passport from "passport";
import StatusCodes from "http-status-codes";
import { Strategy as localStrategy } from "passport-local";

import UserModel from "../models/User";
import APIError from "../shared/Error";

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      (async () => {
        try {
          // Check if user with given E-Mail exists
          let user = await UserModel.findOne({ email });
          if (user) {
            const message = "User with the given E-Mail already exists.";
            const error = new APIError(message);
            error.statusCode = StatusCodes.CONFLICT;
            return done(error);
          }

          // If not create one
          user = await UserModel.create({
            email,
            password,
            userType: "unknown",
            name: req.body.name,
          });
          return done(null, user, {
            message: "Signed up succesfully. Login to continue.",
          });
        } catch (err) {
          return done(err);
        }
      })();
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      (async () => {
        try {
          const user = await UserModel.findOne({ email });

          const message = "Invalid credentials.";
          if (!user) {
            const error = new APIError(message);
            error.statusCode = StatusCodes.NOT_FOUND;
            return done(error, false);
          }

          const valid = await user.isPasswordValid(password);

          if (!valid) {
            const error = new APIError(message);
            error.statusCode = StatusCodes.UNAUTHORIZED;
            return done(error, false);
          }

          return done(null, user, { message: "Logged in Successfully." });
        } catch (err) {
          const error = new APIError(err.message);
          error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
          return done(error);
        }
      })();
    }
  )
);
