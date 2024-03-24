import dotnev from 'dotenv'
dotnev.config({ path: `.env` });

import { logger, notFoundLogger } from '@middleware/logger.middleware';
import { runConfigCronJobs } from '@config/cronjobs.config';
import { initDefaultFolders } from '@config/defaultfiles';
import expressFileupload from 'express-fileupload'
import express, { Application } from 'express'
import CORS_OPTIONS from '@config/cors';
import cors from 'cors'

export default function app(routes: []) {
    const app: Application = express();
    const port: string = process.env.PORT || '3000';

    function listener() {
        app.listen(port, () => {
            console.info('=================================');
            console.info(`======== ENV: production ========`);
            console.info(`🚀 App listening on the port ${port}`);
            console.info('=================================');
        });
    }

    function initMiddlewares() {
        app.use(logger);
        app.use(cors(CORS_OPTIONS));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(expressFileupload());        
    }

    function notFoundLogs() {
        app.use(notFoundLogger);        
    }

    function initCronjobs() {
        runConfigCronJobs();
    }

    function defaultFiles() {
        initDefaultFolders();
    }

    function initRoutes(routes: []) {
        routes.forEach(route => {
            app.use(route);
        });
    }

    async function runner() {
        defaultFiles();
        initCronjobs();
        initMiddlewares();
        initRoutes(routes);
        notFoundLogs()
        listener();
    }

    runner();
}
