import { Request, Response } from "express";

import cardService from "../services/cardService.js";
import employeeService from "../services/employeeService.js";

export async function activateCard(req: Request, res: Response) {
    const { id, securityCode, password }: { id: number, securityCode: string, password: string } = req.body;

    await cardService.activateCard(id, securityCode, password);

    res.sendStatus(200);
};

export async function buy(req: Request, res: Response) {
    const { cardId, password, amount, businessId } : { cardId : number, password : string, amount : number, businessId : number } = req.body;

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
    const { cardId, password } : { cardId : number, password : string } = req.body;

    await employeeService.blockCard(cardId, password);

    res.sendStatus(200);
};

export async function unblockCard(req: Request, res: Response) {
    const { cardId, password } : { cardId : number, password : string } = req.body;

    await employeeService.unblockCard(cardId, password);

    res.sendStatus(200);
};