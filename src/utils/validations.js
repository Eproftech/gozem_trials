import Ajv from 'ajv';
const ajv = new Ajv({allErrors: true, format: 'full'});

export const validate = (schema, data) => {
    let validate = ajv.compile(schema);
    let err = null;
    let isValid = validate(data);

    if(!isValid) {
        err = new Error('Invalid data for schema');
        Error.captureStackTrace(err, validate);
        err.errors = errors(validate);
    }

    let output = {err, isValid};
    return output;
};

const errors = (validate) => {
    let output = validate.errors.map(err => {
        if(err.keyword == 'additionalProperties') {
            return {
                field: err.params.additionalProperty,
                message: 'This is not a valid field, should not be part of request'
            };
        }
        if(err.keyword === 'required') {
            return {
                field: err.params.missingProperty,
                message: 'This is a required field. It is missing in request'
            };
        }

        return {
            field: err.dataPath,
            message: err.message,
            params: err.params
        };
    });
    
    return output;
};