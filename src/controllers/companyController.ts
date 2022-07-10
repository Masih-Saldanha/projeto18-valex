import { Request, Response } from "express";

import { TransactionTypes } from "../repositories/cardRepository.js";
import cardService from "../services/cardService.js";


export async function createCard(req: Request, res: Response) {
    const apiKey = req.headers["x-api-key"].toString();
    const { employeeId, type }: { employeeId: number, type: TransactionTypes } = req.body;

    await cardService.createCard(apiKey, employeeId, type);

    res.sendStatus(201);
};

export async function rechargeCard(req: Request, res: Response) {
    const { id, rechargeValue } = req.body;

    await cardService.rechargeCardById(id, rechargeValue);

    res.sendStatus(200);
};