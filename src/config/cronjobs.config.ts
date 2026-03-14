import DatabaseBackup from "@database/backup.database"
import newCronJob from "@lib/cronjob.lib"

function runConfigCronJobs() {
    newCronJob('get_backup', '* * * * *', DatabaseBackup.getBackup)
}

export default runConfigCronJobs