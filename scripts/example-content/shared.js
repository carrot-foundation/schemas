/**
 * Shared helpers for example content emitters.
 *
 * Provides date/ID formatting utilities and non-production markers
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
 * Format a number as a Unix timestamp in milliseconds.
 *
 * @param {Date} date
 * @returns {number} Unix timestamp in milliseconds
 */
export function formatUnixMs(date) {
  return date.getTime();
}

/**
 * Build a deterministic prefixed identifier for example data.
 * Returns a simple human-readable string (NOT a UUID).
 * For fields requiring UUID format, use a fixed UUID constant in the reference story instead.
 *
 * @param {string} prefix - A human-readable prefix (e.g., 'mass-id', 'gas-id')
 * @param {string | number} index - A distinguishing index or key
 * @returns {string} A deterministic identifier string like 'example-mass-id-1'
 */
export function buildExampleId(prefix, index) {
  return `example-${prefix}-${index}`;
}

/** Non-production environment marker applied to all example data. */
export const NON_PRODUCTION_MARKER = {
  blockchain_network: 'testnet',
  deployment: 'development',
  data_set_name: 'TEST',
};
