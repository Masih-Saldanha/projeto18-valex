import { NextFunction, Request, Response } from "express";

import errorType from "../services/errorType.js";

export function errorHandler(error, req: Request, res: Response, next: NextFunction) {
    console.error(error);

    const errorThrow = errorType.type(error);

    return res.status(errorThrow.status).send(errorThrow.message);
}