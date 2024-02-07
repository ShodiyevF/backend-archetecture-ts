import { loggerCron } from '@logger/logger.config';
import { internalErrorCatcher } from '@logger/logger.internal';

export function runConfigCronJobs() {
    loggerCron();
}