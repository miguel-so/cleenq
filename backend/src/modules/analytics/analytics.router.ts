import { Router } from "express";
import { requireAdmin } from "../../middlewares/require-admin";
import { getOverviewHandler } from "./analytics.controller";

const router = Router();

router.get("/overview", requireAdmin(), getOverviewHandler);

export default router;

