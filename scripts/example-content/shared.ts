/**
 * Shared helpers for example content emitters.
 *
 * Provides date formatting utilities and non-production markers
 * used across all schema example generators.
 */

import { createHash } from 'node:crypto';

/** Deterministic, structurally valid CIDv1 placeholder for an illustrative asset. */
export function exampleIpfsUri(label: string): string {
  const digest = createHash('sha256')
    .update(`schemas-example:${label}`)
    .digest();
  const bytes = Buffer.concat([Buffer.from([1, 0x70, 0x12, 0x20]), digest]);
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
  let bits = 0;
  let carry = 0;
  let encoded = '';
  for (const byte of bytes) {
    carry = (carry << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      encoded += alphabet[(carry >> bits) & 31];
    }
    carry &= (1 << bits) - 1;
  }
  if (bits > 0) encoded += alphabet[(carry << (5 - bits)) & 31];
  return `ipfs://b${encoded}`;
}

/** Format a Date as an ISO 8601 date-time string (UTC). */
export function formatDateTime(date: Date): string {
  return date.toISOString();
}

/** Format a Date as an ISO 8601 date-only string (YYYY-MM-DD). */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('formatDate requires a valid Date instance');
  }
  return date.toISOString().split('T')[0];
}

/** Convert a Date to a Unix timestamp in milliseconds. */
export function formatUnixMilliseconds(date: Date): number {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('formatUnixMilliseconds requires a valid Date instance');
  }
  return date.getTime();
}

/** Non-production environment marker applied to all example data. */
export const NON_PRODUCTION_MARKER = {
  blockchain_network: 'testnet',
  deployment: 'development',
  data_set_name: 'TEST',
} as const;
