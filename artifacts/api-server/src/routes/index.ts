import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import reportsRouter from "./reports";
import alertsRouter from "./alerts";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(reportsRouter);
router.use(alertsRouter);
router.use(statsRouter);

export default router;
