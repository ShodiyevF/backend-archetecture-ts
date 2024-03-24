import { getCurrentDateFormatted } from './../lib/helper';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

function logFolderCreator() {
    const checkLogFolderIsExists = fs.existsSync(path.join(process.cwd(), `/log/`));
    if (!checkLogFolderIsExists) {
        fs.mkdirSync(path.join(process.cwd(), `/log/`));
    }

    const checkInternalErrorFolderIsExists = fs.existsSync(path.join(process.cwd(), `/log/internalError`));
    if (!checkInternalErrorFolderIsExists) {
        fs.mkdirSync(path.join(process.cwd(), `/log/internalError`));
    }

    const checkNotFoundFolderIsExists = fs.existsSync(path.join(process.cwd(), `/log/request`));
    if (!checkNotFoundFolderIsExists) {
        fs.mkdirSync(path.join(process.cwd(), `/log/request`));
    }

    const checkCronFolderIsExists = fs.existsSync(path.join(process.cwd(), `/log/cronJob`));
    if (!checkCronFolderIsExists) {
        fs.mkdirSync(path.join(process.cwd(), `/log/cronJob`));
    }
}

function logFileCreator() {
    const nowDate = getCurrentDateFormatted();

    const logModule = fs.readdirSync(path.join(process.cwd(), '/log'));
    for (const module of logModule) {
        const checkIfFileExists = fs.existsSync(path.join(process.cwd(), `/log/${module}/${nowDate}.json`));
        if (!checkIfFileExists) {
            fs.writeFileSync(path.join(process.cwd(), `/log/${module}/${nowDate}.json`), JSON.stringify([]));
        }
    }
}

function loggerCron() {
    cron.schedule('0 0 0 * * *', () => {
        logFileCreator();
    });
}

export {
    logFolderCreator,
    logFileCreator,
    loggerCron,
};
