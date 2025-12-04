/**
 * @file logger.js
 * @description
 * A lightweight custom logging utility that wraps the native console methods
 * and provides support for log levels, timestamps, and centralized control
 * over application logging behavior.
 *
 * Usage:
 *   import { Logger } from "@/utils/logger";
 *   Logger.info("User logged in", user);
 *   Logger.error("Failed to fetch data", error);
 */

/**
 * @enum {number}
 * Defines available log levels in increasing order of severity.
 */
const LOG_LEVELS = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};

/**
 * Current logging level.
 * Logs below this level will not be printed.
 * Can be configured dynamically or via environment settings.
 * @type {number}
 */
let currentLevel = LOG_LEVELS.DEBUG;

/**
 * Internal helper to format and output logs based on log level.
 *
 * @param {"DEBUG" | "INFO" | "WARN" | "ERROR"} level - The log level.
 * @param {...any} args - Items to log (strings, objects, etc.).
 */
const log = (level, ...args) => {
  if (LOG_LEVELS[level] >= currentLevel) {
    const timestamp = new Date().toISOString();
    const method = level.toLowerCase();

    if (console[method]) {
      console[method](`[${timestamp}] [${level}]`, ...args);
    } else {
      console.log(`[${timestamp}] [${level}]`, ...args);
    }
  }
};

/**
 * Logger utility that exposes standardized log methods.
 *
 * @namespace Logger
 */
export const Logger = {
  /**
   * Logs verbose debug information.
   * Useful during development.
   *
   * @function
   * @param {...any} args - Debug values to log.
   */
  debug: (...args) => log("DEBUG", ...args),

  /**
   * Logs general informational messages.
   *
   * @function
   * @param {...any} args - Info values to log.
   */
  info: (...args) => log("INFO", ...args),

  /**
   * Logs warning messages (non-breaking issues).
   *
   * @function
   * @param {...any} args - Warning values to log.
   */
  warn: (...args) => log("WARN", ...args),

  /**
   * Logs error messages.
   * Should be used for caught exceptions and critical failures.
   *
   * @function
   * @param {...any} args - Error details to log.
   */
  error: (...args) => log("ERROR", ...args),
};

/**
 * Updates the global log level.
 *
 * @param {"DEBUG" | "INFO" | "WARN" | "ERROR"} level - The desired log level.
 */
export const setLogLevel = (level) => {
  if (LOG_LEVELS[level]) {
    currentLevel = LOG_LEVELS[level];
  } else {
    console.warn(`Invalid log level: ${level}`);
  }
};
