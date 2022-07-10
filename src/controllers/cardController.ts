import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";

import cardService from "../services/cardService.js";


export async function createCard(req: Request, res: Response) {
    const apiKey = req.headers["x-api-key"].toString();
    const { employeeId, type }: { employeeId: number, type: TransactionTypes } = req.body;

    // *FIXME: isVirtual tem que ser false e só ser true no bônus
    // *FIXME: originalCardId tem que ser null e só ser true no bônus

    await cardService.createCard(apiKey, employeeId, type);

    res.sendStatus(201);
};

export async function activateCard(req: Request, res: Response) {
    const { id, securityCode, password }: { id: number, securityCode: string, password: string } = req.body;

    await cardService.activateCard(id, securityCode, password);

    res.sendStatus(200);
};

// FIXME: TERMINAR QUANDO FIZER ROTA DE RECARGA E COMPRAS
export async function viewCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const cardIdInt = parseInt(cardId);

    const cardDetails = await cardService.viewCard(cardIdInt);
    console.log(cardDetails);

    res.sendStatus(200);
};

export async function rechargeCard(req: Request, res: Response) {
    const { id, rechargeValue } = req.body;

    await cardService.rechargeCardById(id, rechargeValue);

    res.sendStatus(200);
};