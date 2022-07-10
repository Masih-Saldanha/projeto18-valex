import { Router } from "express";

import { activateCard, createCard } from "../controllers/cardController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import cardSchema from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post("/create-card", validateSchema(cardSchema.createCardSchema), createCard);
cardRouter.post("/activate-card", validateSchema(cardSchema.activateCardSchema), activateCard)

export default cardRouter;