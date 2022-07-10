import { Router } from "express";

import { activateCard, createCard, rechargeCard, viewCard } from "../controllers/cardController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import cardSchema from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post("/create-card", validateSchema(cardSchema.createCardSchema), createCard);
cardRouter.put("/activate-card", validateSchema(cardSchema.activateCardSchema), activateCard);
// FIXME: TERMINAR QUANDO FIZER ROTA DE RECARGA E COMPRAS
cardRouter.get("/view-card/:cardId", viewCard);
cardRouter.post("/recharge-card/", validateSchema(cardSchema.rechargeCardSchema), rechargeCard);

export default cardRouter;