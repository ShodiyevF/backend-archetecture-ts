import { logPsqlWriter } from "@logger/logger.psql";

import Pg from 'pg'

const pool = new Pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: 5432,
});

export async function fetchPsql(query: string, ...arr: []) {
    try {
        const client = await pool.connect();
        const result = await client.query(query, arr);
        client.release();
        logPsqlWriter(200, result.command, query);
        return result.rows;
    } catch (error: any) {
        logPsqlWriter(400, 'unknown', query);
        return {
            status: 400,
            error: error.stack.split('at async')[error.stack.split('at async').length - 1],
            query,
        };
    }
}
