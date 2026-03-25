import { promises as fs } from 'node:fs';
import path from 'node:path';

export function log(message) {
  process.stdout.write(`${message}\n`);
}

export async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export function parseScalar(value) {
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
 * Supports key-value pairs, list items, and comments.
 * Does not handle nested objects or multi-line string blocks.
 */
export function parseFrontmatter(rawContent, prefix = '') {
  const content = rawContent.replace(/\r\n/g, '\n');
  if (!content.startsWith('---\n')) {
    return { data: {}, body: content.trim() };
  }

  const closing = content.indexOf('\n---\n', 4);
  if (closing === -1) {
    log(
      `${prefix}warning: file starts with "---" but has no closing delimiter — treating as no frontmatter`,
    );
    return { data: {}, body: content.trim() };
  }

  const frontmatterRaw = content.slice(4, closing);
  const body = content
    .slice(closing + 5)
    .replace(/^\n+/, '')
    .trim();

  const data = {};
  let currentArrayKey = null;

  for (const line of frontmatterRaw.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && !currentArrayKey) {
      log(
        `${prefix}warning: list item found but no parent key — skipping: ${line}`,
      );
      continue;
    }
    if (listMatch && currentArrayKey) {
      data[currentArrayKey].push(parseScalar(listMatch[1]));
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) {
      log(`${prefix}warning: malformed frontmatter line: ${line}`);
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

export function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export async function readFileWithContext(filePath, operation = 'read') {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to ${operation} ${filePath}: ${error.message}`, {
      cause: error,
    });
  }
}

export async function listFilesRecursive(dir, extension) {
  if (!(await pathExists(dir))) {
    return [];
  }

  const result = [];

  async function walk(current) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (error) {
      throw new Error(`Failed to read directory ${current}: ${error.message}`, {
        cause: error,
      });
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && fullPath.endsWith(extension)) {
        result.push(fullPath);
      }
    }
  }

  await walk(dir);
  return result.sort();
}
