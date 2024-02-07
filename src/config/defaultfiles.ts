import { logFolderCreator, logFileCreator } from '@logger/logger.config';
import path from 'path'
import fs from 'fs'

function initDefaultFolders() {
    const UPLOAD_FOLDER: boolean = fs.existsSync(path.join(process.cwd(), '/upload'));
    if (!UPLOAD_FOLDER) {
        fs.mkdirSync(path.join(process.cwd(), '/upload'));
    }

    logFolderCreator()
    logFileCreator()
}

export {
    initDefaultFolders,
};
