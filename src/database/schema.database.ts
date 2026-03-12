import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Table } from "drizzle-orm";

export const testTable = pgTable('test', {
    testId: uuid('test_id').defaultRandom().primaryKey(),
    testName: text('test_name').notNull(),
    testCreatedAt: timestamp('test_created_at').notNull().defaultNow(),
})

namespace DbTableSchema {
    export const test = testTable

    export type InferSelectType<T extends Table, P extends boolean | null = null> = P extends true ? Partial<T['_']['inferSelect']> : T['_']['inferSelect'];
    export type InferInsertType<T extends Table> = T['_']['inferInsert'];
    export type InferUpdateType<T extends Table> = Partial<InferInsertType<T>>;
}

export default DbTableSchema