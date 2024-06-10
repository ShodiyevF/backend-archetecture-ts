import { Request, Response, NextFunction } from "express";

import internalErrorCatcher from "@shared/logger/logger.internal";
import { returnResponse } from "@lib/express.function";
import Validation from "@shared/validation/validation";
import { Errors } from "@lib/httpException";

interface CustomRequest extends Request {
    [key: string]: any;
}

export default function validationMiddleware(dto: Validation.DTO, value: string ) {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const validatorResponse = Validation.validator(dto, req[value]);
            if (validatorResponse.status == 200) {
                return next();
            } else {
                return returnResponse(res, 403, validatorResponse.error || 'error', Errors.VALIDATION_ERROR);
            }
        } catch (error) {
            internalErrorCatcher(error)
        }
    };
}
