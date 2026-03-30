import fs from 'node:fs';
import path from 'node:path';

export function collectJsonFiles(rootDir: string, suffix: string): string[] {
  const results: string[] = [];
  const stack: string[] = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(suffix)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

export function loadJson<T = unknown>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

export function getVersion(): string {
  const pkgPath = path.join(process.cwd(), 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
      version?: string;
    };
    return process.env.SCHEMA_VERSION || pkg.version || '0.0.0-dev';
  } catch (error) {
    const fallback = process.env.SCHEMA_VERSION || '0.0.0-dev';
    console.warn(
      `Warning: Failed to read package.json at ${pkgPath}. ` +
        `Falling back to version "${fallback}". Error: ${(error as Error).message}`,
    );
    return fallback;
  }
}
