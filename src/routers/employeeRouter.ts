import { Router } from "express";

import employeeSchema from "../schemas/employeeSchema.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { blockCard, buy, viewCardData } from "../controllers/employeeController.js";

const employeeRouter = Router();

employeeRouter.post("/buy", validateSchema(employeeSchema.paymentSchema), buy);
employeeRouter.get("/view-card/:cardId", viewCardData);
employeeRouter.put("/block-card/", validateSchema(employeeSchema.blockSchema), blockCard);

export default employeeRouter;