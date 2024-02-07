import { getCurrentDateFormatted, getCurrentTimeFormatted } from "@sharedLib/helper";
import { internalErrorCatcher } from "./logger.internal";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export function logPsqlWriter(statusCode: number, method: string, query: string) {
    try {
        const logType = statusCode === 200 ? 'success' : 'error';

        const nowDate = getCurrentDateFormatted();
        const nowTime = getCurrentTimeFormatted();

        let newLog = {
            log_id: randomUUID(),
            log_type: logType,
            log_time: nowTime,
            log_date: nowDate,
            log_request_method: method,
            log_request_query: query
        };

        let readFile = fs.readFileSync(path.join(process.cwd(), `/log/psql/${nowDate}.json`), { encoding: 'utf-8' });
        let parsedReadFile = JSON.parse(readFile)

        parsedReadFile.push(newLog);
        
        fs.writeFileSync(path.join(process.cwd(), `/log/psql/${nowDate}.json`), JSON.stringify(parsedReadFile));
    } catch (error) {
        internalErrorCatcher(error);
    }
}