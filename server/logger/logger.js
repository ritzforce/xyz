'use strict';

var winston = require('winston');
var path = require('path');
var logger = new winston.Logger();

logger.configureForApp = function(config){
	var pathToFolder = path.join(__dirname,'./../logs');
	
    logger.configure({
        level : config.log.logLevel,
        transports : [
			new (winston.transports.Console)({
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
