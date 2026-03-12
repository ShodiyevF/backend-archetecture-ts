import childProcess from 'child_process'
import { sql } from 'drizzle-orm'
import fs from 'fs'

import DatabaseInterface from '@interface/database.interface'
import UtilityDbTableSchema from './utility_schema.database'
import { utilityDb } from './utility_pg.database'
import FS from '@config/fs.config'
import { db } from './pg.database'
import EnvLib from '@lib/env.lib'

namespace DatabaseBackup {

    const dbName = EnvLib.getVariable('DB_NAME')
    const dbPassword = EnvLib.getVariable('DB_PASSWORD')
    const dbUser = EnvLib.getVariable('DB_USER')
    const dbPort = EnvLib.getVariable('DB_PORT')
    const dbHost = EnvLib.getVariable('DB_HOST')
    const telegramBotToken = EnvLib.getVariable('BACKUP_TELEGRAM_BOT_TOKEN')
    const telegramGroupId = EnvLib.getVariable('BACKUP_TELEGRAM_GROUP_ID')
    const telegramGroupTopicId = EnvLib.getVariable('BACKUP_TELEGRAM_GROUP_TOPIC_ID')
    
    export function flushBackups() {
        const files = fs.readdirSync(FS.StaticPaths.backupFolder)
        for (const file of files) {
            if (!file.endsWith('.backup.sql')) {
                continue
            }

            fs.rmSync(FS.StaticPaths.backupFolder+'/'+file)
        }
    }

    async function checkDbStat(dbName: string): Promise<DatabaseInterface.ICheckDbStatReturn> {
        const getLatestDbStat = await db.execute(
            sql`select tup_inserted, tup_updated, tup_deleted from pg_stat_database where datname = ${dbName}`
        )
        .then(data => data.rows[0])
        
        const getOldDbStat = await utilityDb.select()
        .from(UtilityDbTableSchema.databaseStat)
        .then(data => data[0])
        if (!getOldDbStat) {
            await utilityDb.insert(UtilityDbTableSchema.databaseStat)
            .values({
                dsInsert: String(getLatestDbStat.tup_inserted),
                dsUpdate: String(getLatestDbStat.tup_updated),
                dsDelete: String(getLatestDbStat.tup_deleted),
                dsUpdatedAt: new Date()
            })

            return 'MODIFICATED'
        }

        if (
            getOldDbStat.dsInsert !== getLatestDbStat.tup_inserted ||
            getOldDbStat.dsUpdate !== getLatestDbStat.tup_updated ||
            getOldDbStat.dsDelete !== getLatestDbStat.tup_deleted
        ) {
            await utilityDb.update(UtilityDbTableSchema.databaseStat)
            .set({
                dsInsert: String(getLatestDbStat.tup_inserted),
                dsUpdate: String(getLatestDbStat.tup_updated),
                dsDelete: String(getLatestDbStat.tup_deleted),
                dsUpdatedAt: new Date()
            })

            return 'MODIFICATED'
        }

        return 'UNMODIFICATED'
    }
    
}

export default DatabaseBackup