import { Router } from "express";
import AuthRouter from "./Auth";
import UserRouter from "./Users";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/auth", AuthRouter);
router.use("/users", UserRouter);

// Export the base-router
export default router;
