import { getCurrentDateFormatted, getCurrentTimeFormatted } from "@sharedLib/helper";
import { internalErrorCatcher } from "./logger.internal";
import { randomUUID } from "crypto";
import path from 'path'
import fs from 'fs'

export function logCronJob(jobName: string) {
    try {
        const nowDate = getCurrentDateFormatted();
        const nowTime = getCurrentTimeFormatted();

        let newLog = {
            log_id: randomUUID(),
            log_name: jobName,
            log_time: nowTime,
            log_date: nowDate,
        };

        let readFile = fs.readFileSync(path.join(process.cwd(), `/log/cronJob/${nowDate}.json`), { encoding: 'utf-8' });
        let parsedFileData = JSON.parse(readFile);

        parsedFileData.push(newLog);

        fs.writeFileSync(path.join(process.cwd(), `/log/cronJob/${nowDate}.json`), JSON.stringify(parsedFileData));
    } catch (error) {
        internalErrorCatcher(error);
    }
}