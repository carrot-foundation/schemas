export interface SchemaManifest {
  version?: string;
  schemas: Record<string, { hash: string; path: string }>;
}
