import { getCurrentDateFormatted, getCurrentTimeFormatted } from './../lib/helper';
import { internalErrorCatcher } from "./logger.internal";
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

export function logWriter(statusCode: number, host: string, method: string, url: string, userAgent: string | undefined, body: object, res: string) {
    try {

        const logType = statusCode >= 200 && statusCode <= 299 ? 'success' : 'error';
        
        const nowDate = getCurrentDateFormatted();
        const nowTime = getCurrentTimeFormatted();

        let newLog = {
            log_id: randomUUID(),
            log_type: logType,
            log_time: nowTime,
            log_date: nowDate,
            log_request_method: method,
            log_request_route: url,
            log_request_host: host,
            log_request_user_agent: userAgent,
            log_request_body: body,
            log_response_status: statusCode,
            log_response_body: res,
        };

        const readFile = fs.readFileSync(path.join(process.cwd(), `/log/request/${nowDate}.json`), {encoding: 'utf-8'});

        const parsedReadFile = JSON.parse(readFile);
        
        parsedReadFile.push(newLog);
        
        fs.writeFileSync(path.join(process.cwd(), `/log/request/${nowDate}.json`), JSON.stringify(parsedReadFile));

    } catch (error) {
        internalErrorCatcher(error);
    }
}