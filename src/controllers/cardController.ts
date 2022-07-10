import { Request, Response } from "express";

import cardService from "../services/cardService.js";


export async function createCard(req: Request, res: Response) {
    const apiKey = req.headers["x-api-key"].toString();
    const { employeeId, type }: { employeeId: number, type: string } = req.body;

    if (
        (type !== "groceries") &&
        (type !== "restaurant") &&
        (type !== "transport") &&
        (type !== "education") &&
        (type !== "health")
    ) {
        throw {
            type: "Not Acceptable",
            message: "Invalid Card Type"
        };
    }

    // FIXME: password tem que ser null e só ser gerado na ativação
    // FIXME: isBlocked tem que ser false
    // *FIXME: isVirtual tem que ser false e só ser true no bônus
    // *FIXME: originalCardId tem que ser null e só ser true no bônus

    await cardService.createCard(apiKey, employeeId, type);

    res.sendStatus(200);
}