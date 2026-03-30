/**
 * Shared helpers for example content emitters.
 *
 * Provides date formatting utilities and non-production markers
 * used across all schema example generators.
 */

/**
 * Format a Date as an ISO 8601 date-time string (UTC).
 *
 * @param {Date} date
 * @returns {string} ISO 8601 date-time string
 */
export function formatDateTime(date) {
  return date.toISOString();
}

/**
 * Format a Date as an ISO 8601 date-only string (YYYY-MM-DD).
 *
 * @param {Date} date
 * @returns {string} ISO 8601 date string
 */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Convert a Date to a Unix timestamp in milliseconds.
 *
 * @param {Date} date
 * @returns {number} Unix timestamp in milliseconds
 */
export function formatUnixMs(date) {
  return date.getTime();
}

/** Non-production environment marker applied to all example data. */
export const NON_PRODUCTION_MARKER = {
  blockchain_network: 'testnet',
  deployment: 'development',
  data_set_name: 'TEST',
};
