import winston from 'winston';

// Create a logger with two transports: one for console output, and one for file output
// export logger to use it all around the app as a single place for all logging operations
 export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

