import passport from "passport";
import StatusCodes from "http-status-codes";
import { Strategy as localStrategy } from "passport-local";
import {
  Strategy as jwtStrategy,
  ExtractJwt,
  VerifiedCallback,
} from "passport-jwt";

import UserModel from "../models/User";
import APIError from "../shared/Error";
import * as config from "../config.json";

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
            const message = "User with the given E-Mail already exists";
            const error = new APIError(message);
            error.status = StatusCodes.CONFLICT;
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
            message: "Signed up succesfully. Login to continue",
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

          const message = "Invalid Email or Password";
          if (!user) {
            const error = new APIError(message);
            error.status = StatusCodes.UNAUTHORIZED;
            return done(error, false);
          }

          const valid = await user.isPasswordValid(password);

          if (!valid) {
            const error = new APIError(message);
            error.status = StatusCodes.UNAUTHORIZED;
            return done(error, false);
          }

          return done(null, user, { message: "Logged in Successfully." });
        } catch (err) {
          const error = new APIError(err.message);
          error.status = StatusCodes.INTERNAL_SERVER_ERROR;
          return done(error);
        }
      })();
    }
  )
);

passport.use(
  new jwtStrategy(
    {
      secretOrKey: config.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (payload: { userId: string; email: string }, done: VerifiedCallback) => {
      (async () => {
        try {
          const user = await UserModel.findOne({ _id: payload.userId });
          if (!user) {
            const error = new APIError("Invalid token provided.");
            error.status = StatusCodes.UNAUTHORIZED;
            return done(error, false);
          }

          return done(null, user);
        } catch (err) {
          const error = new APIError(err.message);
          error.status = StatusCodes.INTERNAL_SERVER_ERROR;
          return done(error);
        }
      })();
    }
  )
);
