/**
 * @fileoverview Centralized logging utility.
 * Provides structured, environment-aware logging with severity levels.
 * Non-error logs are silenced in production builds.
 */

/** Log severity levels. */
type LogLevel = 'info' | 'warn' | 'error';

/**
 * Logs a message with structured severity and source context.
 * Non-error messages are silenced in production builds.
 * @param level - Severity level of the log message.
 * @param message - Human-readable log message.
 * @param context - Optional additional data for debugging.
 */
export function log(level: LogLevel, message: string, context?: unknown): void {
  const isProduction = import.meta.env.PROD;
  if (isProduction && level !== 'error') return;
  const timestamp = new Date().toISOString();
  const prefix = `[CTM:${level.toUpperCase()}] ${timestamp}`;
  if (level === 'error') {
    console.error(prefix, message, context ?? '');
  } else if (level === 'warn') {
    console.warn(prefix, message, context ?? '');
  } else {
    console.log(prefix, message, context ?? '');
  }
}
