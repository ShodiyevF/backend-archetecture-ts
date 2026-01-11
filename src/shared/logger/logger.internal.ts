import BuildInSharedHelper from '@shared/helper/build_in.helper';
import DatabaseFunctions from '@database/functions.database';

async function internalErrorCatcher(error: any): Promise<void>{
    const errorFile = BuildInSharedHelper.getErrorLine(error);
    
    await DatabaseFunctions.insert({
        tableName: 'internalErrorsLOGS',
        data: {
            ielDescription: error instanceof Error ? errorFile : error,
            ielStack: error.stack
        }
    })
}

export default internalErrorCatcher