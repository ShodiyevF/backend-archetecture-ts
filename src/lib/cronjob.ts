
import { logCronJob } from '@logger/logger.cronjob'
import cron, { ScheduledTask } from 'node-cron'

export function newCronJob(jobName: string, schedule: string, job: Function): ScheduledTask {
    return cron.schedule(schedule, () => {
        logCronJob(jobName)
        job()
    })
}