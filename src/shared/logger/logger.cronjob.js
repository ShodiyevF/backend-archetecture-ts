const { getCurrentDateFormatted, getCurrentTimeFormatted } = require('../lib/helper');
const { internalErrorCatcher } = require('./logger.internal');
const { randomUUID } = require('crypto');
const path = require('path');
const fs = require('fs');

function logNotFoundWriter(module, statusCode, host, method, url, userAgent, body, res) {
    try {
        const logType = statusCode >= 200 && statusCode <= 299 ? 'success' : 'error';

        const nowDate = getCurrentDateFormatted();
        const nowTime = getCurrentTimeFormatted();

        let newLog = {
            log_id: randomUUID(),
            log_type: logType,
            log_module: module,
            log_time: nowTime,
            log_date: nowDate,
            log_request_method: method,
            log_response_status: statusCode,
            log_request_route: url,
            log_request_host: host,
            log_request_user_agent: userAgent,
            log_request_body: body,
            log_response_body: res,
        };

        let readFile = fs.readFileSync(path.join(process.cwd(), `/log/${module}/${nowDate}.json`));
        readFile = JSON.parse(readFile);
        readFile.push(newLog);
        fs.writeFileSync(path.join(process.cwd(), `/log/${module}/${nowDate}.json`), JSON.stringify(readFile));
    } catch (error) {
        internalErrorCatcher(error);
    }
}

module.exports = {
    logNotFoundWriter,
};
