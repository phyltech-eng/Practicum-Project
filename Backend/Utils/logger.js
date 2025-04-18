const winston = require('winston');
const path = require('path');

// Create a custom logger with multiple transports
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'club-management-service' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    
    // File transport for errors
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    
    // File transport for combined logs
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ]
});

// Logging middleware for requests
const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip
  });
  next();
};

module.exports = {
  logger,
  requestLogger
};
