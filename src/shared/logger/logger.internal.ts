import UtilityDbTableSchema from '@database/utility_schema.database';
import BuildInSharedHelper from '@shared/helper/build_in.helper';
import { utilityDb } from '@database/utility_pg.database';

async function internalErrorCatcher(error: any): Promise<void>{
    const errorFile = BuildInSharedHelper.getErrorLine(error);
    
    await utilityDb.insert(UtilityDbTableSchema.internalErrorsLOGS)
    .values({
        ielDescription: error instanceof Error ? errorFile : error,
        ielStack: error.stack
    })
}

export default internalErrorCatcher