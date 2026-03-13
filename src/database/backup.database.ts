import childProcess from 'child_process'
import { sql } from 'drizzle-orm'
import archiver from 'archiver'
import path from 'path'
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
    const telegramGroupTopicId = EnvLib.getVariable('BACKUP_TELEGRAM_GROUP_TOPIC_ID') === 'NULL' ? null : EnvLib.getVariable('BACKUP_TELEGRAM_GROUP_TOPIC_ID')
    
    namespace Utils {
        export function compressDb(dbName: string, fileName: string): Promise<string>{
            return new Promise( async (resolve, reject) => {
                try {
                    const output = fs.createWriteStream(`./backup/${dbName}.backup.zip`)
                    const archive = archiver('zip', {
                        zlib: { level: 9 }
                    });
                    
                    output.on('close', () => {
                        resolve(path.join(process.cwd(), `./backup/${dbName}.backup.zip`))
                    });
                    
                    archive.pipe(output);
                    
                    const picturesDirectory = path.join(process.cwd(), '/backup/', fileName)
                    archive.append(fs.createReadStream(picturesDirectory), { name: fileName });
                    archive.finalize();
                } catch (error) {
                    reject(error)
                }
            })
        }
        
        export function formatDate() {
            const now = new Date();
            
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;
            
            return formattedDate;
        }
    }
    
    export function flushBackups() {
        const files = fs.readdirSync(FS.StaticPaths.backupFolder)
        for (const file of files) {
            if (!file.endsWith('.backup.dump') && !file.endsWith('.backup.zip')) {
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
    
    export async function getBackup() {
        try {
            const dbChanges = await checkDbStat(dbName)
            if (dbChanges === 'UNMODIFICATED') {
                await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: telegramGroupId,
                        text: `<b>${dbName.toUpperCase()}</b> databazasida da o'zgarish bo'lmagan!`,
                        parse_mode: 'HTML',
                        message_thread_id: telegramGroupTopicId ? telegramGroupTopicId : null
                    })
                })
                return ''
            }
            
            const file_name = `${dbName}.backup.dump`;
            await childProcess.execSync(`PGPASSWORD='${dbPassword}' pg_dump -h ${dbHost} -U ${dbUser} -d ${dbName} -p ${dbPort} -Fc -f './backup/${file_name}'`)
            
            const compressed = await Utils.compressDb(dbName, file_name)
            
            const formData = new FormData()
            formData.append('chat_id', telegramGroupId)
            formData.append('document', new Blob([fs.readFileSync(compressed)]), `${dbName}.backup.zip`)
            formData.append('caption', `<b>${dbName}</b> ${Utils.formatDate()}`)
            formData.append('parse_mode', 'HTML')
            if (telegramGroupTopicId) {
                formData.append('message_thread_id', telegramGroupTopicId)
            }
            
            await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendDocument`, {
                method: 'POST',
                body: formData,
            })

            flushBackups()
            return ''
        } catch (error) {
            await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: telegramGroupId,
                    text: `<b>${dbName.toUpperCase()}</b> databazasida da ma'lutmot olishda xatolik yuz berdi iltimos tekshiring ❗️`,
                    parse_mode: 'HTML',
                    message_thread_id: telegramGroupTopicId ? telegramGroupTopicId : null
                })
            })
            return ''
        }
    }
    
}

export default DatabaseBackup