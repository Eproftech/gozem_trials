import service from './services';

const getDistanceAndTime = (req, res) => {
    let data = req.body;

    service.getDistanceAndTime(data)
    .then(results => {
        return res.status(results.status).json(results);
    }).catch(err => {
        return res.status(err.status).json(err);
    });
};

export default {
    getDistanceAndTime
};