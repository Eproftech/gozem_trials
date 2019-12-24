let getDistanceAndTime = {
    type: 'object',
    properties: {
        start: {
            type: 'object',
            properties: {
                lat: {type: 'number'},
                lng: {type: 'number'}
            },
            additionalProperties: false,
            required: ['lat', 'lng']
        },
        end: {
            type: 'object',
            properties: {
                lat: {type: 'number'},
                lng: {type: 'number'}
            },
            additionalProperties: false,
            required: ['lat', 'lng']
        },
        units: {type: 'string', enum: ['metric', 'imperial']}
    },
    additionalProperties: false,
    required: ['start', 'end', 'units']
};

export default {
    getDistanceAndTime
};