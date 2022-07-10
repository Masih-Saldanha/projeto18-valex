import { Router } from "express";

import cardRouter from "./cardRouter.js";
import employeeRouter from "./employeeRouter.js";

const router = Router();

router.use(cardRouter);
router.use(employeeRouter);

export default router;