// utils/logger.js
const AuditLog = require('../models/Logs');

const SAFE_LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

class Logger {
  static log({ functionName, level = 'INFO', message, context = {}, req, error }) {
    // 🔒 HARD GUARD
    if (typeof functionName !== 'string') {
      console.error('Logger misuse: functionName must be string');
      return;
    }

    if (!SAFE_LEVELS.includes(level)) {
      level = 'INFO';
    }

    const logPayload = {
      functionName,
      level,
      message: String(message),
      context
    };

    if (req) {
      logPayload.ipAddress =
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.socket?.remoteAddress;

      logPayload.userAgent = req.headers['user-agent'];
    }

    if (error) {
      logPayload.stackTrace = error.stack;
      logPayload.message = error.message || message;
    }

    // 🚀 FIRE & FORGET (NO AWAIT)
    AuditLog.create(logPayload).catch(err => {
      console.error('AuditLog failed:', err.message);
    });

    // 🧠 Console mirror (optional)
    console.log(
      `[${new Date().toISOString()}] ${level} | ${functionName} → ${message}`
    );
  }

  static info(fn, msg, options = {}) {
    this.log({ functionName: fn, level: 'INFO', message: msg, ...options });
  }

  static warn(fn, msg, options = {}) {
    this.log({ functionName: fn, level: 'WARN', message: msg, ...options });
  }

  static error(fn, msg, options = {}) {
    this.log({ functionName: fn, level: 'ERROR', message: msg, ...options });
  }

  static debug(fn, msg, options = {}) {
    this.log({ functionName: fn, level: 'DEBUG', message: msg, ...options });
  }
}

module.exports = Logger;
