import express from "express";

import Exception from "./httpException";

function returnResponse(res: express.Response, status: number, message: string, error: Exception.Errors) {
    return res.status(status).json({
        status,
        message,
        error,
    });
}

export default returnResponse