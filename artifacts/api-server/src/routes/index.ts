import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import eventsRouter from "./events.js";
import usersRouter from "./users.js";
import organizersRouter from "./organizers.js";
import notificationsRouter from "./notifications.js";
import adminRouter from "./admin.js";
import referralsRouter from "./referrals.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/users", usersRouter);
router.use("/organizers", organizersRouter);
router.use("/notifications", notificationsRouter);
router.use("/admin", adminRouter);
router.use("/referrals", referralsRouter);

export default router;
