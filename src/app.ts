import expressFileupload from 'express-fileupload'
import express from 'express'
import cors from 'cors'

import LoggerMiddleware from '@middleware/logger.middleware';
import ExpressFunctions from '@lib/express_functions.lib';
import runConfigCronJobs from '@config/cronjobs.config';
import CORS_OPTIONS from '@config/cors.config';
import FS from '@config/fs.config';
import EnvLib from '@lib/env.lib';

export default function app(routes: express.Router[]) {
    const app: express.Application = express();
    const port: string = process.env.PORT || '3000';

    function initListener() {
        app.listen(port, () => {
            console.info('=================================');
            console.info(`======== ENV: production ========`);
            console.info(`🚀 App listening on the port ${port}`);
            console.info('=================================');
        });
    }

    function initMiddlewares() {
        app.use(LoggerMiddleware.logger);
        app.use(cors(CORS_OPTIONS));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(expressFileupload());        
    }

    function initBadJsonHandler() {
        ExpressFunctions.badJsonFormatHandler(app)
    }

    function initNotFoundLogs() {
        app.use(LoggerMiddleware.notFoundLogger);        
    }

    function initCronjobs() {
        runConfigCronJobs();
    }

    function initDefaultFiles() {
        FS.runner()
    }

    function initEnvConfig() {
        EnvLib.checkExists();
        EnvLib.checkVariables();
    }

    function initRoutes(routes: express.Router[]) {
        routes.forEach(route => {
            app.use(route);
        });
    }

    async function runner() {
        initEnvConfig();
        initDefaultFiles();
        initCronjobs();
        initMiddlewares();
        initBadJsonHandler();
        initRoutes(routes);
        initNotFoundLogs();
        initListener();
    }

    runner();
}
