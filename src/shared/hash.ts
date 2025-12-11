import { createHash } from 'node:crypto';
import canonicalize from 'canonicalize';

/**
 * Produce an RFC 8785 canonical JSON string suitable for hashing.
 * Throws if the value cannot be serialized (non-finite numbers, functions, etc.).
 */
export function canonicalizeForHash(value: unknown): string {
  const canonical = canonicalize(value);
  if (canonical === undefined) {
    throw new TypeError('Value is not serializable to canonical JSON');
  }
  return canonical;
}

/**
 * Compute a SHA-256 hex digest for already-canonical JSON text.
 */
export function hashCanonicalJson(canonicalJson: string): string {
  return createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

/**
 * Canonicalize a value to JSON and return its SHA-256 hex digest.
 */
export function hashObject(value: unknown): string {
  const canonical = canonicalizeForHash(value);
  return hashCanonicalJson(canonical);
}
