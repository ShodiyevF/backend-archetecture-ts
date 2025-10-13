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

export const testTable = pgTable('test', {
    testId: uuid('test_id').defaultRandom().primaryKey(),
    testName: text('test_name').notNull(),
    testCreatedAt: timestamp('test_created_at').notNull().defaultNow(),
})

namespace DbTableSchema {
    export const requestsLOGS = requestsLOGSTable
    export const internalErrorsLOGS = internalErrorsLOGSTable
    export const cronJobsLOGS = cronJobsLOGSTable
    export const test = testTable

    export const requestLogsRlTypeEnumList = requestLogsRlTypeEnum.enumValues
    
    export type TRequestLogsRlTypeEnum = typeof requestLogsRlTypeEnum.enumValues[number]

    export type InferSelectType<T extends Table, P extends boolean | null = null> = P extends true ? Partial<T['_']['inferSelect']> : T['_']['inferSelect'];
    export type InferInsertType<T extends Table> = T['_']['inferInsert'];
    export type InferUpdateType<T extends Table> = Partial<InferInsertType<T>>;
}

export default DbTableSchema