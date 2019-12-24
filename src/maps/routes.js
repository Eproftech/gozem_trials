import express from 'express';
import mapsCtrl from './controllers';

let router = express.Router();

router.post('/get_distance_and_time', mapsCtrl.getDistanceAndTime);
export default router;