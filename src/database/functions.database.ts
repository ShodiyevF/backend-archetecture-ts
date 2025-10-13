import DrizzleOrm from "drizzle-orm";

import DatabaseInterface from "@interface/database.interface";
import DbTableSchema from "./schema.database";
import { db } from "./pg.database";

namespace DatabaseFunctions {
    
    export async function select<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.ISelectPayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>> {
        const {
            tableName,
            filter
        } = payloads
        
        const table = DbTableSchema[tableName]

        const conditions = Object.entries(filter).map(([key, value]) =>
            DrizzleOrm.eq((table as any)[key], value)
        )

        const result = await db.select()
        .from(table)
        .where(
            DrizzleOrm.and(...conditions)
        )

        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows[0]
    }
    
    export async function insert<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IInsertPayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>> {
        const {
            tableName,
            data
        } = payloads
        
        const table = DbTableSchema[tableName]
        const result = await db.insert(table)
        .values(data)
        .returning()
        
        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows[0]
    }

    export async function update<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IUpdatePayloads<T>): Promise<DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>> {
        const {
            tableName,
            targetColumn,
            targetValue,
            data,
        } = payloads
        
        const table = DbTableSchema[tableName] as any
        const result = await db
        .update(table)
        .set(data)
        .where(DrizzleOrm.eq(table[targetColumn], targetValue))
        .returning()

        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows[0]
    }

    export async function remove<T extends DatabaseInterface.TableNames>(payloads: DatabaseInterface.IRemovePayloads<T>) {
        const {
            tableName,
            targetColumn,
            targetValue
        } = payloads
        
        const table = DbTableSchema[tableName] as any
        const result = await db
        .delete(table)
        .where(DrizzleOrm.eq(table[targetColumn], targetValue))
        .returning()

        const rows = result as DbTableSchema.InferSelectType<(typeof DbTableSchema)[T]>[]
        return rows[0]
    }
    
}

export default DatabaseFunctions