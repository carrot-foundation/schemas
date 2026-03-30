/**
 * Shared helpers for example content emitters.
 *
 * Provides date formatting utilities and non-production markers
 * used across all schema example generators.
 */

/** Format a Date as an ISO 8601 date-time string (UTC). */
export function formatDateTime(date: Date): string {
  return date.toISOString();
}

/** Format a Date as an ISO 8601 date-only string (YYYY-MM-DD). */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('formatDate requires a valid Date instance');
  }
  return date.toISOString().split('T')[0];
}

/** Convert a Date to a Unix timestamp in milliseconds. */
export function formatUnixMilliseconds(date: Date): number {
  return date.getTime();
}

/** Non-production environment marker applied to all example data. */
export const NON_PRODUCTION_MARKER = {
  blockchain_network: 'testnet',
  deployment: 'development',
  data_set_name: 'TEST',
} as const;
