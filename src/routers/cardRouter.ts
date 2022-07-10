import { Router } from "express";

import { createCard } from "../controllers/cardController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import cardSchema from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post("/create-card", validateSchema(cardSchema.createCardSchema), createCard);

export default cardRouter;