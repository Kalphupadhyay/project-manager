import { NextFunction, Request, Response } from "express";


export const asyncHandler = (requesthandler: Function) => {

    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requesthandler(req, res, next)).catch((error) => next(error));
    }


}