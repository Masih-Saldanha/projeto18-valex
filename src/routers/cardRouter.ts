import { Request, Response, Router } from "express";

const cardRouter = Router();

cardRouter.get("/", async (req: Request, res: Response) => {
    // throw {
    //     type: "Not Found",
    //     message: "Não achou"
    // };
    console.log("ok");
    res.sendStatus(200);
});

export default cardRouter;