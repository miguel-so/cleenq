import { Router } from "express";
import authRouter from "../modules/auth/auth.router";
import bookingsRouter from "../modules/bookings/bookings.router";
import cleanersRouter from "../modules/cleaners/cleaners.router";
import customersRouter from "../modules/customers/customers.router";
import membershipsRouter from "../modules/memberships/memberships.router";
import rewardsRouter from "../modules/rewards/rewards.router";
import servicesRouter from "../modules/services/services.router";
import analyticsRouter from "../modules/analytics/analytics.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/services", servicesRouter);
router.use("/memberships", membershipsRouter);
router.use("/rewards", rewardsRouter);
router.use("/bookings", bookingsRouter);
router.use("/cleaners", cleanersRouter);
router.use("/customers", customersRouter);
router.use("/analytics", analyticsRouter);

export default router;

