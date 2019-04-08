const {
  createLogger,
  format,
  transports
} = require('winston');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'log.json');

exports.getLogger = function (label) {
 let log = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.label({ label: label }),
      format.json()
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.printf(
            info => `${info.timestamp} ${info.level} ${label}: ${info.message}`
          )
        )
      })
    ]
  });

  return log;
}


      // new transports.File({
      //   filename:filename,
      //   })