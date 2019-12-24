import schemas from './schemas';
import { Promise } from 'bluebird';
import { validate } from '../utils/validations';
import logger from '../utils/logger';
import gMaps from '@google/maps';
import configs from '../core/configs';

const gMapsClient = gMaps.createClient({
    key: configs.googleMapsApiKey
});

const getDistanceAndTime = async(data) => {
        let schema = schemas.getDistanceAndTime;
        let status = validate(schema, data);

        if(!status.isValid) {
            let error = new Error('Invalid Parameters passed to request');
                error.status = 400;
                error.code = 'INVALID_PARAMS';
                error.errors = status.err.errors;
        }
        
        try {
            let startCodes = `${data.start.lat},${data.start.lng}`;
            let endCodes = `${data.end.lat},${data.end.lng}`;
            let startCountry = await getCountryName(startCodes);
            let endCountry = await getCountryName(endCodes);
            let startZone = await getCountryTimeZone(startCodes);
            let endZone = await getCountryTimeZone(endCodes);
            let distanceDiff = await getDistance(startCodes, endCodes, data.units);
            logger.debug(distanceDiff);

            let startTimeZoneFromGmt = `GMT+${startZone}`;
            if(startZone < 0) {
                startTimeZoneFromGmt = `GMT${startZone}`;
            }

            let endTimeZoneFromGmt = `GMT+${endZone}`;
            if(endZone < 0) {
                endTimeZoneFromGmt = `GMT${endZone}`;
            }

            let unitsDict = {
                imperial: 'mi',
                metric: 'km'
            }

            let returnResponse = {
                start: {
                    country: startCountry,
                    timezone: startTimeZoneFromGmt,
                    location: data.start
                },
                end:  {
                    country: endCountry,
                    timezone: endTimeZoneFromGmt,
                    location: data.end
                },
                distance: {
                    value: distanceDiff,
                    units: unitsDict[data.units]
                },
                time_diff: {
                    value: endZone - startZone,
                    units: 'hours'
                }
            };
            return ({
                status: 200,
                code: 'SUCCESS',
                data: returnResponse
            });
        } catch (error){
            // throw error;
        }
};

const getCountryName = (geoCoordinates) => {
    return new Promise((resolve, reject) => {
        gMapsClient.geocode({
            address: geoCoordinates
        }, (err, geoResponse) => {
            if(err) {
                return reject({
                    status: 500,
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'There was an error while fetching country name in getCountryName()'
                });
            }
            let countryName = '';
            geoResponse.json.results[0].address_components.map(eachComponent => {
                if(eachComponent.types && eachComponent.types.indexOf('country') !== -1) {
                    countryName = eachComponent.long_name;
                    
                }
            });
            
            return resolve(countryName);
        });
    });
};

const getCountryTimeZone = (geoCoordinates) => {
    return new Promise((resolve, reject) => {
        gMapsClient.timezone({
            location: geoCoordinates,
            timestamp: 1458000000
        }, (err, timezoneResponse) => {
            if(err) {
                return reject({
                    status: 500,
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'There was an error while fetching country timezone in getCountryTimeZone()'
                });
            }
            let offset = timezoneResponse.json.rawOffset;
            let timeZoneInHours = offset/3600;
            
            return resolve(timeZoneInHours);
        });
    });
};

const getDistance = (startPoint, endPoint, units) => {
    return new Promise((resolve, reject) => {
        gMapsClient.distanceMatrix({
            origins: startPoint,
            destinations: endPoint,
            units
        }, (err, distanceResponse) => {
            if(err) {
                return reject({
                    status: 500,
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'There was an error while fetching distance info in getDistance()'
                });
            }
            let distanceObject = distanceResponse.json.rows[0].elements[0];
            let valueToReturn;
            if(distanceObject.status !== 'OK') {
                valueToReturn = 'COULD_NOT_CALCULATE_DISTANCE';
            } else {
                valueToReturn = distanceObject.distance.value;
            }
            return resolve(valueToReturn);
        });
    });
};

export default {
    getDistanceAndTime
};