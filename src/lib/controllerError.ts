import express from "express"

import returnResponse from "./express.function"
import Exception from "./httpException"

export function controllerError(res: express.Response, error: any) {
    if (process.env.MODE == 'DEV' && !error.status) {
        console.log(error)
        return returnResponse(res, 500, `INTERNAL ERROR: ${error}`, Exception.Errors.INTERNAL_SERVER_ERROR)
    } else {
        return returnResponse(res, error.status, error.message, error.error)
    }
}