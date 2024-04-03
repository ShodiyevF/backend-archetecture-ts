import { internalErrorCatcher } from "@logger/logger.internal";
import { Request, Response, NextFunction } from "express";
import { logWriter } from "@logger/logger.request";
import { Errors } from "@lib/httpException";

function writeLog(res: Response, req: Request, body: any) {
    logWriter(
        res.statusCode,
        req.hostname,
        req.method,
        req.url,
        req.headers['user-agent'],
        req.body,
        body
    )
}

export async function logger(req: Request, res: Response, next: NextFunction) {
    try {
        const originalSend = res.send;
        
        res.send = function (body): any {
            try {
                const parsedBody = JSON.parse(body);
                writeLog(res, req, parsedBody)
            } catch (error) {
                const parsedBody = body
                writeLog(res, req, parsedBody)
            }
        
            originalSend.call(this, body);
        };

        next();
    } catch (error) {
        internalErrorCatcher(error)
        return res.status(500).json({
            status: 500,
            message: `Syntax error`,
            error: Errors.INTERNAL_SERVER_ERROR,
        });
    }

}

export async function notFoundLogger(req: Request, res: Response, next: NextFunction){
    try {
        res.status(404)

        logWriter(
            res.statusCode,
            req.hostname,
            req.method,
            req.url,
            req.headers['user-agent'],
            req.body,
            `Cannot ${req.method} ${req.url}`
        )

        next()
    } catch (error) {
        next(error);
    }
}