import EnvLib from "@lib/env.lib";
import cors from "cors";

const allowlist: string = eval(EnvLib.getVariable('ORIGIN'))

const CORS_OPTIONS: cors.CorsOptions = {
    origin: allowlist,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: Boolean(EnvLib.getVariable('CREDENTIALS')),
    preflightContinue: true,
    optionsSuccessStatus: 200,
};

export default CORS_OPTIONS