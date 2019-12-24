import mapsRoutes from '../maps/routes';
import bodyParser from 'body-parser';
import cors from 'cors';

const setup = (app) => {
    app.use(bodyParser.json({limit: '20mb'}), bodyParser.urlencoded({extended: true, limit: '20mb'}));
    app.use(cors());
    app.use('/api', mapsRoutes);
};

export default {setup};