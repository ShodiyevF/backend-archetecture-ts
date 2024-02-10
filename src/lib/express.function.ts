import { Errors } from "./httpException";
import { Response } from "express";

export function returnResponse(res: Response, status: number, message: string, error: Errors) {
    return res.status(status).json({
        status,
        message,
        error,
    });
}