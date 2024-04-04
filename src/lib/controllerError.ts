import { returnResponse } from "./express.function"
import { Errors } from "./httpException"
import { Response } from "express"

export function controllerError(res: Response, error: any) {
    if (process.env.MODE == 'DEV' && !error.status) {
        console.log(error)
        return returnResponse(res, 500, `INTERNAL ERROR: ${error}`, Errors.INTERNAL_SERVER_ERROR)
    } else {
        return returnResponse(res, error.status, error.message, error.error)
    }
}