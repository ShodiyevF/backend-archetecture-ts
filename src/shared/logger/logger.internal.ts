import { getErrorLine, getCurrentDateFormatted, getCurrentTimeFormatted } from '@sharedLib/helper';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

export function internalErrorCatcher(error: any){
    const nowDate = getCurrentDateFormatted();
    const nowTime = getCurrentTimeFormatted();
    
    const errorFile = getErrorLine(error);

    const checkIfFileExistsError = fs.existsSync(path.join(process.cwd(), `/log/internalError/${nowDate}.json`));
    if (!checkIfFileExistsError) {
        fs.writeFileSync(path.join(process.cwd(), `/log/internalError/${nowDate}.json`), JSON.stringify([]));
    }

    let newLog = {
        log_id: randomUUID(),
        log_type: 'error',
        log_module: 'internalError',
        log_time: nowTime,
        log_date: nowDate,
        log_error_description: error instanceof Error ? errorFile : error,
        log_error_stack: error.stack,
    };

    let readFile: string = fs.readFileSync(path.join(process.cwd(), `/log/internalError/${nowDate}.json`), { encoding: 'utf-8' });
    
    let parsedReadFile = JSON.parse(readFile)
    
    parsedReadFile.push(newLog);
    
    fs.writeFileSync(path.join(process.cwd(), `/log/internalError/${nowDate}.json`), JSON.stringify(parsedReadFile));
}