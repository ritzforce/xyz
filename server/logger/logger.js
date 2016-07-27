'use strict';

var winston = require('winston');
var path = require('path');
var logger = new winston.Logger();

//winston.handleExceptions(new winston.transports.File({ filename: './logs/exception.log' }))



logger.configureForApp = function(config){
	var pathToFolder = path.join(__dirname,'./../logs');
	console.log(pathToFolder);

    logger.configure({
        level : config.log.level,
        transports : [
			new (winston.transports.Console)({
				level: 'debug',
				colorize: true,
				timestamp: false,
				stringify: true,
			}),
			new (winston.transports.File)({
				name: 'debug-file',
				filename: path.join(pathToFolder,'debug.log'),
				maxsize: 5242880,
				maxFiles: 3,
				json: false,
				prettyPrint: true,
				humanReadableUnhandledException : true,
				tailable: true,
				colorize: true,
				stringify: true,
				level: 'debug',
				timestamp: function(){
					return new Date().toISOString();	
				},
				formatter: function(options) {
        			// Return string will be passed to logger.
        			return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
          				(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
     		    },
			}),
			new (winston.transports.File)({
				name: 'error-file',
				filename: path.join(pathToFolder,'error.log'),
				maxsize: 5242880,
				maxFiles: 3,
				humanReadableUnhandledException : true,
				tailable: true,
				colorize: true,
				level: 'error'
			})
  		]
    });
}


module.exports = logger;
