import { Router } from "express";

import employeeSchema from "../schemas/employeeSchema.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { buy, viewCardData } from "../controllers/employeeController.js";

const employeeRouter = Router();

employeeRouter.post("/buy", validateSchema(employeeSchema.paymentSchema), buy);
// FIXME: TERMINAR QUANDO FIZER ROTA DE RECARGA E COMPRAS
employeeRouter.get("/view-card/:cardId", viewCardData);

export default employeeRouter;