import { Router } from "express";
import AuthRouter from "./Auth";
import UserRouter from "./User";
import JobsRouter from "./Job";
import passport from "passport";

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

// Export the base-router
export default router;
