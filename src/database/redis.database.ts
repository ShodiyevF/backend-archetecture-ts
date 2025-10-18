import Redis from "ioredis";

import EnvLib from "@lib/env.lib";

const redis = new Redis({
    host: EnvLib.getVariable('REDIS_HOST'),
    port: +EnvLib.getVariable('REDIS_PORT'),
    username: EnvLib.getVariable('REDIS_USER'),
    password: EnvLib.getVariable('REDIS_PASSWORD'),
    db: +EnvLib.getVariable('REDIS_DB')
})

export default redis