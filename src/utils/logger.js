import winston from 'winston';

let options = {
    consoleOpt: {
        level: 'debug',
        prettyPrint: true,
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

let logger = new winston.Logger({
    transports: [
        new winston.transports.Console(options.consoleOpt)
    ]
});

export default {
    debug: function(message, data) {
        if(!data) {
            data = '';
        }
        logger.debug(message, data);
    },
    error: function(message, data) {
        if(!data) {
            data = '';
        }
        logger.error(message, data);
    },
    info: function(message, data) {
        if(!data) {
            data = '';
        }
        logger.info(message, data);
    }
};