import express from 'express';
import routes from './core/routes';
import logger from './utils/logger';
import configs from './core/configs';
import jsonPackage from '../package.json';

const app = express();
let port = configs.apiPort;

routes.setup(app);

app.get('/status', (req, res) => {
    return res.send(({status: 'OK', version: jsonPackage.version}));
});

app.listen(port, () => {
    logger.info(`Map API initialized and running on port: ${port}`);
});