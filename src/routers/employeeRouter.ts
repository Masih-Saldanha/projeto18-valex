import { Router } from "express";

import employeeSchema from "../schemas/employeeSchema.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { blockCard, buy, unblockCard, viewCardData } from "../controllers/employeeController.js";

const employeeRouter = Router();

employeeRouter.post("/buy", validateSchema(employeeSchema.paymentSchema), buy);
employeeRouter.get("/view-card/:cardId", viewCardData);
employeeRouter.put("/block-card", validateSchema(employeeSchema.blockSchema), blockCard);
employeeRouter.put("/unblock-card", validateSchema(employeeSchema.blockSchema), unblockCard);

export default employeeRouter;