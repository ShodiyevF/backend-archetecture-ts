import { migrate} from 'drizzle-orm/node-postgres/migrator'

import { utilityDb } from './utility_pg.database';
import { db } from './pg.database';
import EnvLib from "@lib/env.lib";

async function migration() {
    console.log('migration started...');
    if (EnvLib.getVariable('DB_MIGRATION_TYPE') === 'PRODUCTION') {
        await migrate(db, { migrationsFolder: './drizzle'})
    } else if (EnvLib.getVariable('DB_MIGRATION_TYPE') === 'UTILITY') {
        await migrate(utilityDb, { migrationsFolder: './drizzle_utility'})
    }
    console.log('migration ended...');
    process.exit(0);
}

migration().catch(err => {
    console.log(err);
})