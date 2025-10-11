import express from "express";

import internalErrorCatcher from "@shared/logger/logger.internal";
import Validation from "@shared/validation/validation";
import ExpressFunctions from "@lib/express_functions.lib";
import Exception from "@lib/http_exception.lib";

interface CustomRequest extends express.Request {
    [key: string]: any;
}

export default function validationMiddleware(dto: Validation.DTO, value: string ) {
    return (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
        try {
            const validatorResponse = Validation.validator(dto, req[value]);
            if (validatorResponse.status == 200) {
                return next();
            } else {
                return ExpressFunctions.returnResponse(res, 403, validatorResponse.error || 'error', Exception.Errors.VALIDATION_ERROR);
            }
        } catch (error) {
            internalErrorCatcher(error)
        }
    };
}
