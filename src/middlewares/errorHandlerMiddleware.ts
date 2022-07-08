import { NextFunction, Request, Response } from "express";

export function errorHandler(error, req: Request, res: Response, next: NextFunction) {
    console.error(error);

    // FIXME: AJUSTAR CASOS DE ERROR POR TYPE:

    // if (error.type === "Unprocessable Entity") {
    //     return res.status(422).send(error.message);
    // }
    // if (error.type === "Not Found") {
    //     return res.status(404).send(error.message);
    // }

    return res.status(500).send(error);
}