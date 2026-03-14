import UtilityDbTableSchema from "@database/utility_schema.database";
import { utilityDb } from "@database/utility_pg.database";
import internalErrorCatcher from "./logger.internal";

async function logCronJob(jobName: string) {
    try {
        await utilityDb.insert(UtilityDbTableSchema.cronJobsLOGS)
        .values({
            cjlName: jobName
        })
    } catch (error) {
        internalErrorCatcher(error);
    }
}

export default logCronJob