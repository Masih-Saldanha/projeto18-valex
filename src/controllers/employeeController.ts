import { Request, Response } from "express";

import employeeService from "../services/employeeService.js";

export async function buy(req: Request, res: Response) {
    const { cardId, password, amount, businessId } = req.body;

    await employeeService.buyWithCard(cardId, password, amount, businessId);

    res.sendStatus(201);
};

export async function viewCardData(req: Request, res: Response) {
    const { cardId } = req.params;
    const cardIdInt = parseInt(cardId);

    const cardData = await employeeService.cardData(cardIdInt);

    res.status(200).send(cardData);
};

export async function blockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;
    const cardIdInt = parseInt(cardId);

    await employeeService.blockCard(cardIdInt, password);

    res.sendStatus(200);
};