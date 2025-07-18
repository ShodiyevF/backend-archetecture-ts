import express from "express"

import ExpressFunctions from "./express-functions.lib"
import Exception from "./http-exception.lib"

function controllerError(res: express.Response, error: any) {
    if (process.env.MODE == 'DEV' && !error.status) {
        console.log(error)
        return ExpressFunctions.returnResponse(res, 500, `INTERNAL ERROR: ${error}`, Exception.Errors.INTERNAL_SERVER_ERROR)
    } else {
        return ExpressFunctions.returnResponse(res, error.status, error.message, error.error)
    }
}

export default controllerError