import { internalErrorCatcher } from "@logger/logger.internal";
import { DTO, validator } from "@shared/validation/validation";
import { Request, Response, NextFunction } from "express";
import { returnResponse } from "@lib/express.function";
import { Errors } from "@lib/httpException";

interface CustomRequest extends Request {
    [key: string]: any;
}

export default function validationMiddleware(dto: DTO, value: string ) {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const validatorResponse = validator(dto, req[value]);
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
