const winston = require('winston')

const consoleLogger = new winston.transports.Console({
  name: 'log-console',
  prettyPrint: true,
  timestamp: true,
  colorize: true
})

const logger = new winston.Logger({
  transports: process.env.NODE_ENV === 'test' ? [] : [consoleLogger]
})

module.exports = logger
