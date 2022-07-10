import { Router } from "express";

import { createCard, rechargeCard } from "../controllers/companyController.js";
import { validateSchema } from "../middlewares/schemaValidatorMiddleware.js";
import cardSchema from "../schemas/cardSchema.js";

const companyRouter = Router();

companyRouter.post("/create-card", validateSchema(cardSchema.createCardSchema), createCard);
companyRouter.post("/recharge-card", validateSchema(cardSchema.rechargeCardSchema), rechargeCard);

export default companyRouter;