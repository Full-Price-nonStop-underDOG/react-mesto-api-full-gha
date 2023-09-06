const winston = require('winston');

const { createLogger, transports, format } = winston;
const { combine, timestamp, printf } = format;

// формат для вывода логов
const logFormat = printf(({ level, message, meta }) => JSON.stringify({
  timestamp,
  level,
  message,
  ...meta,
}));

// Создайте и настройте логгер
const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat), // Формат логов
  transports: [
    new transports.Console(), // Логи в консоль
    new transports.File({ filename: 'request.log', level: 'info' }), // Логи запросов
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: logFormat,
    }), // Логи ошибок
  ],
});

module.exports = logger;
