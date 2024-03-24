import { boolean, pgTable, smallint, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    userId: uuid('user_id').defaultRandom().primaryKey(),
    userName: varchar('user_name', { length: 36}).notNull(),
    userAge: smallint('user_age').notNull(),
    userGender: boolean('user_gender').default(true),
    userPhoneNumber: varchar('user_phone_number', { length: 13}).notNull().unique(),
    userCreatedAt: timestamp('user_created_at').notNull().defaultNow()
})