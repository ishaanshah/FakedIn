import { Router } from "express";
import passport from "passport";
import ApplicationRouter from "./Application";
import AuthRouter from "./Auth";
import JobsRouter from "./Job";
import UserRouter from "./User";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/auth", AuthRouter);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  UserRouter
);
router.use(
  "/jobs",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  JobsRouter
);
router.use(
  "/applications",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  ApplicationRouter
);

// Export the base-router
export default router;
