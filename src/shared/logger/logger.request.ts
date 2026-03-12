import UtilityDbTableSchema from "@database/utility_schema.database";
import { utilityDb } from "@database/utility_pg.database";
import internalErrorCatcher from "./logger.internal";

export async function logWriter(statusCode: number, host: string, method: string, url: string, userAgent: string | undefined, body: object, res: string) {
    try {
        const logType = statusCode >= 200 && statusCode <= 299 ? 'SUCCESS' : 'ERROR';
    
        await utilityDb.insert(UtilityDbTableSchema.requestsLOGS)
        .values({
            rlMethod: method,
            rlBody: body,
            rlHost: host,
            rlRoute: url,
            rlResponseBody: res,
            rlResponseStatus: statusCode,
            rlType: logType,
            rlUserAgent: userAgent || '',
        })

    } catch (error) {
        internalErrorCatcher(error);
    }
}