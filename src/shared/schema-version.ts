export const SCHEMA_BASE_URL = `https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/${getSchemaVersionOrDefault()}/schemas/ipfs`;

export function buildSchemaUrl(schemaPath: string): string {
  const cleanPath = schemaPath.startsWith('/')
    ? schemaPath.slice(1)
    : schemaPath;
  return `${SCHEMA_BASE_URL}/${cleanPath}`;
}

export function getSchemaVersionOrDefault(): string {
  return process.env['SCHEMA_VERSION'] || '0.0.0-dev';
}
