import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Dirent } from 'node:fs';

export interface FrontmatterResult {
  data: Record<string, unknown>;
  body: string;
}

export interface CanonicalEntry {
  file: string;
  data: Record<string, unknown>;
  body: string;
  raw: string;
}

export interface CanonicalEntriesResult {
  entries: CanonicalEntry[];
  errors: string[];
}

export interface ProjectPaths {
  canonicalRoot: string;
  canonicalRules: string;
  canonicalSkills: string;
  canonicalAgents: string;
  canonicalSchemas: string;
  cursorRules: string;
  cursorSkills: string;
  cursorAgents: string;
  claudeSkills: string;
  claudeAgents: string;
  codexSkills: string;
  parityMatrix: string;
}

export function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

export function warn(message: string): void {
  process.stderr.write(`${message}\n`);
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

export function parseScalar(value: string): string | number | boolean {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }

  return trimmed;
}

/**
 * Parses YAML-like frontmatter delimited by `---`.
 * Supports scalar key-value pairs, YAML-style list items (indented `- value`),
 * and comment lines (starting with `#`).
 * Does not handle nested objects, block scalars (`|`, `>`), or flow sequences.
 */
export function parseFrontmatter(
  rawContent: string,
  prefix = '',
): FrontmatterResult {
  const content = rawContent.replace(/\r\n/g, '\n');
  if (!content.startsWith('---\n')) {
    return { data: {}, body: content.trim() };
  }

  const closing = content.indexOf('\n---\n', 4);
  if (closing === -1) {
    warn(
      `${prefix}warning: file starts with "---" but has no closing delimiter — treating as no frontmatter`,
    );
    return { data: {}, body: content.trim() };
  }

  const frontmatterRaw = content.slice(4, closing);
  const body = content
    .slice(closing + 5)
    .replace(/^\n+/, '')
    .trim();

  const data: Record<string, unknown> = {};
  let currentArrayKey: string | null = null;

  for (const line of frontmatterRaw.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && !currentArrayKey) {
      warn(
        `${prefix}warning: list item found but no parent key — skipping: ${line}`,
      );
      continue;
    }
    if (listMatch && currentArrayKey) {
      (data[currentArrayKey] as unknown[]).push(parseScalar(listMatch[1]));
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) {
      warn(`${prefix}warning: malformed frontmatter line: ${line}`);
      continue;
    }

    const key = kvMatch[1];
    const value = kvMatch[2];

    if (value === '') {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = parseScalar(value);
    currentArrayKey = null;
  }

  return { data, body };
}

export function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value != null && value !== '') {
    warn(`warning: expected array or string but got ${typeof value}: ${value}`);
  }

  return [];
}

export async function readFileWithContext(
  filePath: string,
  operation = 'read',
): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to ${operation} ${filePath}: ${(error as Error).message}`,
      {
        cause: error,
      },
    );
  }
}

export async function readdirWithContext(
  dirPath: string,
  options?: { withFileTypes?: boolean; recursive?: boolean },
  operation = 'list directory',
): Promise<Dirent[]> {
  try {
    return (await fs.readdir(
      dirPath,
      options as { withFileTypes: true; recursive?: boolean },
    )) as Dirent[];
  } catch (error) {
    throw new Error(
      `Failed to ${operation} ${dirPath}: ${(error as Error).message}`,
      {
        cause: error,
      },
    );
  }
}

export async function listFilesRecursive(
  dir: string,
  extension: string,
  { warnIfMissing = false } = {},
): Promise<string[]> {
  if (!(await pathExists(dir))) {
    if (warnIfMissing) {
      warn(`warning: directory does not exist: ${dir}`);
    }
    return [];
  }

  const entries = await readdirWithContext(
    dir,
    { withFileTypes: true, recursive: true },
    `scan ${dir}`,
  );

  return entries
    .filter((e) => e.isFile() && e.name.endsWith(extension))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
}

export function buildPaths(root: string): ProjectPaths {
  return {
    canonicalRoot: path.join(root, '.ai'),
    canonicalRules: path.join(root, '.ai', 'rules'),
    canonicalSkills: path.join(root, '.ai', 'capabilities', 'skills'),
    canonicalAgents: path.join(root, '.ai', 'capabilities', 'agents'),
    canonicalSchemas: path.join(root, '.ai', 'schemas'),

    cursorRules: path.join(root, '.cursor', 'rules'),
    cursorSkills: path.join(root, '.cursor', 'skills'),
    cursorAgents: path.join(root, '.cursor', 'agents'),

    claudeSkills: path.join(root, '.claude', 'skills'),
    claudeAgents: path.join(root, '.claude', 'agents'),

    codexSkills: path.join(root, '.agents', 'skills'),

    parityMatrix: path.join(root, '.ai', 'PARITY_MATRIX.md'),
  };
}

const ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/;

export async function loadCanonicalEntries(
  dir: string,
  { onError = 'throw', prefix = '' } = {},
): Promise<CanonicalEntriesResult> {
  const files = await listFilesRecursive(dir, '.md', { warnIfMissing: true });
  const parsed: CanonicalEntry[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const raw = await readFileWithContext(file, 'load canonical');
    const rel = path.relative(process.cwd(), file);
    const { data, body } = parseFrontmatter(raw, `${prefix}${rel}: `);
    parsed.push({ file, data, body, raw });
  }

  const seenIds = new Map<string, string>();
  const validEntries: CanonicalEntry[] = [];

  for (const entry of parsed) {
    const id = entry.data.id;
    const rel = path.relative(process.cwd(), entry.file);

    if (id == null) {
      const msg = `[validation] ${rel} is missing "id" in frontmatter`;
      if (onError === 'throw') throw new Error(msg);
      errors.push(msg);
      continue;
    }
    if (typeof id !== 'string') {
      const msg = `[validation] ${rel} has non-string id (got ${typeof id}: ${id}) — if the id is numeric, quote it in frontmatter (e.g., id: '${id}')`;
      if (onError === 'throw') throw new Error(msg);
      errors.push(msg);
      continue;
    }
    if (id === '') {
      const msg = `[validation] ${rel} has empty "id" in frontmatter`;
      if (onError === 'throw') throw new Error(msg);
      errors.push(msg);
      continue;
    }
    if (!ID_PATTERN.test(id)) {
      const msg = `[validation] ${rel} has malformed id "${id}" — only lowercase alphanumeric, hyphens, and underscores allowed`;
      if (onError === 'throw') throw new Error(msg);
      errors.push(msg);
      continue;
    }
    if (seenIds.has(id)) {
      const msg = `[validation] duplicate id "${id}" in ${rel} and ${seenIds.get(id)}`;
      if (onError === 'throw') throw new Error(msg);
      errors.push(msg);
      continue;
    }
    seenIds.set(id, rel);
    validEntries.push(entry);
  }

  return {
    entries: validEntries.sort((a, b) =>
      String(a.data.id).localeCompare(String(b.data.id)),
    ),
    errors,
  };
}

// Returns false for two empty sets to avoid false positives in quality checks
// where both fields being absent is a separate concern from being identical.
export function setsAreIdentical<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size === 0 || a.size !== b.size) return false;
  return [...b].every((item) => a.has(item));
}
