import { json, pgEnum, pgTable, smallint, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Table } from "drizzle-orm";

export const requestLogsRlTypeEnum = pgEnum('request_logs_rl_type_enum', [ "SUCCESS", "ERROR" ]);

export const requestsLOGSTable = pgTable('requests_logs', {
    rlId: uuid('rl_id').defaultRandom().primaryKey(),
    rlType: requestLogsRlTypeEnum('rl_type').notNull(),
    rlMethod: varchar('rl_method', { length: 32 }).notNull(),
    rlRoute: text('rl_route').notNull(),
    rlHost: text('rl_host').notNull(),
    rlUserAgent: text('rl_user_agent').notNull(),
    rlBody: json('rl_body').notNull(),
    rlResponseStatus: smallint('rl_response_status').notNull(),
    rlResponseBody: text('rl_response_body').notNull(),
    rlCreatedAt: timestamp('rl_created_at').notNull().defaultNow(),
})

export const internalErrorsLOGSTable = pgTable('internal_errors_logs', {
    ielId: uuid('iel_id').defaultRandom().primaryKey(),
    ielDescription: text('iel_description').notNull(),
    ielStack: text('iel_stack').notNull(),
    ielCreatedAt: timestamp('iel_created_at').notNull().defaultNow(),
})

export const cronJobsLOGSTable = pgTable('cron_jobs_logs', {
    cjlId: uuid('cjl_id').defaultRandom().primaryKey(),
    cjlName: text('cjl_name').notNull(),
    cjlCreatedAt: timestamp('cjl_created_at').notNull().defaultNow(),
})

export const databaseStatTable = pgTable('database_stat', {
    dsId: uuid('ds_id').defaultRandom().primaryKey(),
    dsInsert: text('ds_insert').notNull(),
    dsUpdate: text('ds_update').notNull(),
    dsDelete: text('ds_delete').notNull(),
    dsUpdatedAt: timestamp('ds_updated_at').notNull().defaultNow(),
    dsCreatedAt: timestamp('ds_created_at').notNull().defaultNow(),
})

namespace UtilityDbTableSchema {
    export const requestsLOGS = requestsLOGSTable
    export const internalErrorsLOGS = internalErrorsLOGSTable
    export const cronJobsLOGS = cronJobsLOGSTable
    export const databaseStat = databaseStatTable

    export const requestLogsRlTypeEnumList = requestLogsRlTypeEnum.enumValues
    
    export type TRequestLogsRlTypeEnum = typeof requestLogsRlTypeEnum.enumValues[number]
}

export default UtilityDbTableSchema