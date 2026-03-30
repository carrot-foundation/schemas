#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getErrorMessage } from './utils/fs-utils.js';
import {
  log,
  warn,
  pathExists,
  readFileWithContext,
  parseFrontmatter as parseFrontmatterBase,
  normalizeArray,
  listFilesRecursive,
  readdirWithContext,
  buildPaths,
  loadCanonicalEntries,
} from './ai-utils.js';
import type { CanonicalEntry, FrontmatterResult } from './ai-utils.js';

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const DRY_RUN = args.has('--dry-run');

const PATHS = {
  ...buildPaths(ROOT),
  claudeRoot: path.join(ROOT, '.claude'),
  rootAgents: path.join(ROOT, 'AGENTS.md'),
  rootClaude: path.join(ROOT, 'CLAUDE.md'),
  projectContext: path.join(ROOT, '.ai', 'PROJECT_CONTEXT.md'),
};

// Note: in dry-run mode, ensureDir is a no-op and writeFile only logs what
// would be written. writeIfMissing still checks the real filesystem, so it
// will log and skip files that already exist on disk.
async function ensureDir(targetPath: string): Promise<void> {
  if (DRY_RUN) {
    return;
  }
  try {
    await fs.mkdir(targetPath, { recursive: true });
  } catch (error) {
    throw new Error(
      `Failed to create directory ${targetPath}: ${getErrorMessage(error)}`,
      { cause: error },
    );
  }
}

function parseFrontmatter(rawContent: string): FrontmatterResult {
  return parseFrontmatterBase(rawContent, '[sync] ');
}

function quote(value: unknown): string {
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }

  const str = String(value);
  if (str === '') {
    return "''";
  }

  if (/^[A-Za-z0-9_./:@-]+$/.test(str)) {
    return str;
  }

  const escaped = str.replaceAll("'", "''");
  return `'${escaped}'`;
}

function toFrontmatter(
  data: Record<string, unknown>,
  preferredOrder: string[] = [],
): string {
  const keys = [
    ...preferredOrder.filter((key) => key in data),
    ...Object.keys(data).filter((key) => !preferredOrder.includes(key)),
  ];
  const lines = ['---'];

  for (const key of keys) {
    const value = data[key];

    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${quote(String(item))}`);
      }
      continue;
    }

    lines.push(`${key}: ${quote(String(value))}`);
  }

  lines.push('---');
  return `${lines.join('\n')}\n`;
}

function titleFromId(id: string): string {
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function matchSectionHeading(line: string, heading: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.startsWith('## ')) return false;
  const afterHash = trimmed.slice(3).trim();
  return afterHash.toLowerCase() === heading.toLowerCase();
}

interface GetSectionBodyOptions {
  toEnd?: boolean;
  contextLabel?: string;
}

function getSectionBody(
  markdownBody: string,
  heading: string,
  { toEnd = false, contextLabel = '' }: GetSectionBodyOptions = {},
): string {
  const lines = markdownBody.split('\n');
  const start = lines.findIndex((line) => matchSectionHeading(line, heading));
  if (start === -1) {
    const ctx = contextLabel ? ` (${contextLabel})` : '';
    throw new Error(`[sync] required section "## ${heading}" not found${ctx}`);
  }

  if (toEnd) {
    return lines
      .slice(start + 1)
      .join('\n')
      .trim();
  }

  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      break;
    }
    out.push(lines[i]);
  }

  return out.join('\n').trim();
}

function extractBullets(markdownBody: string, heading: string): string[] {
  const lines = markdownBody.split('\n');
  const hasHeading = lines.some((line) => matchSectionHeading(line, heading));
  if (!hasHeading) return [];

  const section = getSectionBody(markdownBody, heading);
  const bullets = section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s+/, '').trim())
    .filter(Boolean);

  return bullets;
}

async function writeFile(targetPath: string, content: string): Promise<void> {
  if (DRY_RUN) {
    log(`[dry-run] would write: ${path.relative(ROOT, targetPath)}`);
    return;
  }
  await ensureDir(path.dirname(targetPath));
  try {
    await fs.writeFile(targetPath, `${content.replace(/\s+$/u, '')}\n`, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to write ${path.relative(ROOT, targetPath)}: ${getErrorMessage(error)}`,
      { cause: error },
    );
  }
}

const CANONICAL_BASE_FILENAMES = new Set([
  'README.md',
  'DEFINITIONS.md',
  'STANDARDS.md',
  'PROJECT_CONTEXT.md',
]);

function isCanonicalTarget(targetPath: string): boolean {
  const filename = path.basename(targetPath);
  const dir = path.dirname(targetPath);
  if (dir === PATHS.canonicalRoot && CANONICAL_BASE_FILENAMES.has(filename)) {
    return true;
  }
  if (
    dir === PATHS.canonicalRules ||
    dir === PATHS.canonicalSkills ||
    dir === PATHS.canonicalAgents
  ) {
    return true;
  }
  return false;
}

async function writeIfMissing(
  targetPath: string,
  content: string,
): Promise<void> {
  if (await pathExists(targetPath)) {
    if (isCanonicalTarget(targetPath) || !FORCE) {
      log(`[sync] skipped (exists): ${path.relative(ROOT, targetPath)}`);
      return;
    }
  }
  await writeFile(targetPath, content);
}

function renderRuleCanonical(
  data: Record<string, unknown>,
  body: string,
): string {
  const fm = toFrontmatter(data, [
    'id',
    'intent',
    'scope',
    'requirements',
    'anti_patterns',
  ]);

  return `${fm}\n# ${titleFromId(data.id as string)} Rule\n\n## Rule body\n\n${body.trim()}\n`;
}

function renderSkillCanonical(
  data: Record<string, unknown>,
  body: string,
): string {
  const fm = toFrontmatter(data, [
    'id',
    'name',
    'description',
    'when_to_use',
    'workflow',
    'inputs',
    'outputs',
    'references',
  ]);

  return `${fm}\n# ${titleFromId(data.id as string)} Skill\n\n## Instructions\n\n${body.trim()}\n`;
}

function renderAgentCanonical(
  data: Record<string, unknown>,
  body: string,
): string {
  const fm = toFrontmatter(data, [
    'id',
    'name',
    'purpose',
    'when_to_delegate',
    'checklist',
    'report_format',
    'tool_limits',
  ]);

  return `${fm}\n# ${titleFromId(data.id as string)} Agent\n\n## Instructions\n\n${body.trim()}\n`;
}

async function bootstrapCanonicalRules(): Promise<void> {
  const sourceFiles = await listFilesRecursive(PATHS.cursorRules, '.mdc');
  for (const sourceFile of sourceFiles) {
    const id = path.basename(sourceFile, '.mdc');
    const canonicalPath = path.join(PATHS.canonicalRules, `${id}.md`);

    if (!FORCE && (await pathExists(canonicalPath))) {
      continue;
    }

    const raw = await readFileWithContext(sourceFile, 'bootstrap rule');
    const { data: frontmatter, body } = parseFrontmatter(raw);

    const globs = normalizeArray(frontmatter.globs);
    const requirements = extractBullets(body, 'Standards');
    const antiPatterns = extractBullets(body, 'Anti-patterns');

    const canonicalData: Record<string, unknown> = {
      id,
      intent: String(frontmatter.description || `Rule for ${id}`),
      scope: globs.length > 0 ? globs : ['*'],
      requirements:
        requirements.length > 0
          ? requirements
          : ['Follow the requirements defined in the rule body.'],
      anti_patterns:
        antiPatterns.length > 0
          ? antiPatterns
          : ['Avoid the anti-patterns listed in the rule body.'],
    };

    await writeFile(canonicalPath, renderRuleCanonical(canonicalData, body));
    log(`bootstrapped canonical rule: ${id}`);
  }
}

const PATH_DISQUALIFY = /[\s'"()<{@]/;

function collectPathReferences(text: string): string[] {
  const refs = new Set<string>();
  for (const [, value] of text.matchAll(/`([^`]+)`/g)) {
    if (
      value.includes('/') &&
      !value.startsWith('http') &&
      !PATH_DISQUALIFY.test(value) &&
      value.length < 80 &&
      /^[./A-Za-z]/.test(value)
    ) {
      refs.add(value);
    }
  }
  return [...refs].slice(0, 10);
}

async function bootstrapCanonicalSkills(): Promise<void> {
  if (!(await pathExists(PATHS.cursorSkills))) return;
  const entries = await readdirWithContext(
    PATHS.cursorSkills,
    { withFileTypes: true },
    'list cursor skills',
  );
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const id = entry.name;
    const sourceFile = path.join(PATHS.cursorSkills, id, 'SKILL.md');
    if (!(await pathExists(sourceFile))) continue;

    const canonicalPath = path.join(PATHS.canonicalSkills, `${id}.md`);
    if (!FORCE && (await pathExists(canonicalPath))) {
      continue;
    }

    const raw = await readFileWithContext(sourceFile, 'bootstrap skill');
    const { data: frontmatter, body } = parseFrontmatter(raw);

    const whenToUse = extractBullets(body, 'When to use');
    const workflow = extractBullets(body, 'Workflow');
    const refs = collectPathReferences(body);

    const canonicalData: Record<string, unknown> = {
      id,
      name: String(frontmatter.name || id),
      description: String(frontmatter.description || `Skill for ${id}`),
      when_to_use:
        whenToUse.length > 0
          ? whenToUse
          : [`Use this skill when the task matches ${id}.`],
      workflow:
        workflow.length > 0
          ? workflow
          : ['Follow the instruction steps in the skill body.'],
      inputs: ['User request and repository context.'],
      outputs: ['Completed task result with verification.'],
      references: refs.length > 0 ? refs : ['CLAUDE.md'],
    };

    await writeFile(canonicalPath, renderSkillCanonical(canonicalData, body));
    log(`bootstrapped canonical skill: ${id}`);
  }
}

async function bootstrapCanonicalAgents(): Promise<void> {
  const sourceFiles = await listFilesRecursive(PATHS.cursorAgents, '.md');
  for (const sourceFile of sourceFiles) {
    const id = path.basename(sourceFile, '.md');
    const canonicalPath = path.join(PATHS.canonicalAgents, `${id}.md`);

    if (!FORCE && (await pathExists(canonicalPath))) {
      continue;
    }

    const raw = await readFileWithContext(sourceFile, 'bootstrap agent');
    const { data: frontmatter, body } = parseFrontmatter(raw);

    const whenToDelegate = extractBullets(body, 'When Invoked');
    const checklist = extractBullets(body, 'Verification Steps');
    const hasReportFormat = body
      .split('\n')
      .some((line) => matchSectionHeading(line, 'Report Format'));
    const reportFormat = hasReportFormat
      ? getSectionBody(body, 'Report Format')
      : '';

    const canonicalData: Record<string, unknown> = {
      id,
      name: String(frontmatter.name || id),
      purpose: String(frontmatter.description || `Specialist agent for ${id}`),
      when_to_delegate:
        whenToDelegate.length > 0
          ? whenToDelegate
          : [`Delegate when specialized ${id} analysis is needed.`],
      checklist:
        checklist.length > 0
          ? checklist
          : ['Follow the steps in the agent instructions.'],
      report_format: reportFormat
        ? reportFormat.split('\n')[0].slice(0, 120)
        : 'Provide a structured report with findings and verification.',
      tool_limits: ['Respect project sandbox and approval policies.'],
    };

    await writeFile(canonicalPath, renderAgentCanonical(canonicalData, body));
    log(`bootstrapped canonical agent: ${id}`);
  }
}

function renderCursorRule(rule: CanonicalEntry): string {
  const globs = normalizeArray(rule.data.scope);
  const isUniversal = globs.length === 1 && globs[0] === '*';
  const frontmatter: Record<string, unknown> = {
    description: rule.data.intent,
    globs: globs.length > 0 ? globs : ['*'],
    alwaysApply: isUniversal,
  };

  const fm = toFrontmatter(frontmatter, [
    'description',
    'globs',
    'alwaysApply',
  ]);
  let body = getSectionBody(rule.body, 'Rule body', {
    toEnd: true,
    contextLabel: `rule:${rule.data.id}`,
  });

  const substantiveLines = body
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('>'));
  const isMinimal = substantiveLines.length < 3;
  const hasFrontmatterContent =
    ((rule.data.requirements as unknown[])?.length || 0) > 0 ||
    ((rule.data.anti_patterns as unknown[])?.length || 0) > 0;

  if (isMinimal && hasFrontmatterContent) {
    const sections: string[] = [];
    const requirements = normalizeArray(rule.data.requirements);
    if (requirements.length > 0) {
      sections.push(
        '## Requirements\n\n' + requirements.map((r) => `- ${r}`).join('\n'),
      );
    }
    const anti = normalizeArray(rule.data.anti_patterns);
    if (anti.length > 0) {
      sections.push(
        '## Anti-patterns\n\n' + anti.map((a) => `- ${a}`).join('\n'),
      );
    }
    if (sections.length > 0) {
      body = `${body.trim()}\n\n${sections.join('\n\n')}`;
    }
  }

  return `${fm}\n${body}\n`;
}

function renderSkillFile(skill: CanonicalEntry): string {
  const frontmatter: Record<string, unknown> = {
    name: skill.data.name || skill.data.id,
    description: skill.data.description || `Skill for ${skill.data.id}`,
  };

  const fm = toFrontmatter(frontmatter, ['name', 'description']);
  const body = getSectionBody(skill.body, 'Instructions', {
    toEnd: true,
    contextLabel: `skill:${skill.data.id}`,
  });
  return `${fm}\n${body}\n`;
}

function renderAgentFile(agent: CanonicalEntry): string {
  const frontmatter: Record<string, unknown> = {
    name: agent.data.name || agent.data.id,
    description: agent.data.purpose || `Specialist agent for ${agent.data.id}`,
    model: 'default',
  };

  const fm = toFrontmatter(frontmatter, ['name', 'description', 'model']);
  const body = getSectionBody(agent.body, 'Instructions', {
    toEnd: true,
    contextLabel: `agent:${agent.data.id}`,
  });
  return `${fm}\n${body}\n`;
}

function renderRuleSkillFile(rule: CanonicalEntry): string {
  const frontmatter: Record<string, unknown> = {
    name: `rule-${rule.data.id}`,
    description: rule.data.intent || `Rule mapping for ${rule.data.id}`,
  };

  const fm = toFrontmatter(frontmatter, ['name', 'description']);
  const scope = normalizeArray(rule.data.scope);
  if (scope.length === 0) {
    log(`[sync] warning: rule "${rule.data.id}" has empty scope array`);
  }

  return `${fm}\n# Rule ${rule.data.id}\n\nApply this rule whenever work touches:\n${scope.map((item) => `- \`${item}\``).join('\n')}\n\n${getSectionBody(rule.body, 'Rule body', { toEnd: true, contextLabel: `rule:${rule.data.id}` })}\n`;
}

function renderAgentAsCodexSkill(agent: CanonicalEntry): string {
  const frontmatter: Record<string, unknown> = {
    name: agent.data.id,
    description: agent.data.purpose || `Specialist role for ${agent.data.id}`,
  };

  const fm = toFrontmatter(frontmatter, ['name', 'description']);
  const whenToDelegate = normalizeArray(agent.data.when_to_delegate);
  const checklist = normalizeArray(agent.data.checklist);

  return `${fm}\n# Specialist Role: ${agent.data.name || agent.data.id}\n\nUse this skill when:\n${whenToDelegate.map((item) => `- ${item}`).join('\n')}\n\n## Checklist\n${checklist.map((item) => `- ${item}`).join('\n')}\n\n## Report format\n${agent.data.report_format || 'Provide a structured report with findings and verification.'}\n\n## Instructions\n\n${getSectionBody(agent.body, 'Instructions', { toEnd: true, contextLabel: `agent:${agent.data.id}` })}\n`;
}

async function writeCanonicalBaseDocs(): Promise<void> {
  await ensureDir(PATHS.canonicalRoot);
  await ensureDir(PATHS.canonicalSchemas);

  await writeIfMissing(
    path.join(PATHS.canonicalRoot, 'README.md'),
    `# AI instructions\n\nNeutral source-of-truth for Cursor, Claude, and Codex instructions.\n\n## Governance\n\n- Edit canonical instruction files only under \`.ai/\`.\n- Regenerate all platform adapters with \`pnpm ai:sync\`.\n- Validate parity and links with \`pnpm ai:check\`.\n- Hard delete only: remove from canonical and all adapters in the same change.\n\n## Structure\n\n- \`DEFINITIONS.md\`\n- \`STANDARDS.md\`\n- \`PARITY_MATRIX.md\`\n- \`rules/*.md\`\n- \`capabilities/skills/*.md\`\n- \`capabilities/agents/*.md\`\n- \`schemas/*.yaml\`\n`,
  );

  await writeIfMissing(
    path.join(PATHS.canonicalRoot, 'DEFINITIONS.md'),
    `# Definitions\n\n- **Policy**: cross-cutting instruction that applies across tools.\n- **Rule**: scoped behavioral requirement mapped to each platform.\n- **Skill**: reusable workflow unit.\n- **Agent**: specialist role for targeted execution or review.\n- **Adapter**: generated tool-specific artifact from canonical files.\n- **Parity**: equivalent capability coverage across Cursor, Claude, and Codex.\n`,
  );

  await writeIfMissing(
    path.join(PATHS.canonicalRoot, 'STANDARDS.md'),
    `# Standards\n\n## Equal-first\n\n- Cursor, Claude, and Codex are treated as equals.\n- No platform is primary for capability definition.\n- All canonical skills, agents, and rules must map across all tools.\n\n## Capability requirements\n\n### Rules\n\nRequired fields: \`id\`, \`intent\`, \`scope\`, \`requirements\`, \`anti_patterns\`.\n\n### Skills\n\nRequired fields: \`id\`, \`name\`, \`description\`, \`when_to_use\`, \`workflow\`, \`inputs\`, \`outputs\`, \`references\`.\n\n### Agents\n\nRequired fields: \`id\`, \`name\`, \`purpose\`, \`when_to_delegate\`, \`checklist\`, \`report_format\`, \`tool_limits\`.\n`,
  );

  await writeIfMissing(
    path.join(PATHS.canonicalRoot, 'PROJECT_CONTEXT.md'),
    `# Project Context\n\nProject-specific knowledge for AI assistants.\n\n## Project Overview\n\nDescribe the project name, purpose, and audience here.\n\n## Scope\n\nDefine what is in and out of scope for AI assistance.\n\n## How to use\n\nThis file is appended to generated adapters (e.g., CLAUDE.md) to provide project-specific context.\nEdit this file directly; regenerate adapters with \`pnpm ai:sync\`.\n`,
  );

  await writeIfMissing(
    path.join(PATHS.canonicalSchemas, 'rule.schema.yaml'),
    `type: object\nrequired:\n  - id\n  - intent\n  - scope\n  - requirements\n  - anti_patterns\nproperties:\n  id:\n    type: string\n  intent:\n    type: string\n  scope:\n    type: array\n    items:\n      type: string\n  requirements:\n    type: array\n    items:\n      type: string\n  anti_patterns:\n    type: array\n    items:\n      type: string\n`,
  );

  await writeIfMissing(
    path.join(PATHS.canonicalSchemas, 'skill.schema.yaml'),
    `type: object\nrequired:\n  - id\n  - name\n  - description\n  - when_to_use\n  - workflow\n  - inputs\n  - outputs\n  - references\nproperties:\n  id:\n    type: string\n  name:\n    type: string\n  description:\n    type: string\n  when_to_use:\n    type: array\n    items:\n      type: string\n  workflow:\n    type: array\n    items:\n      type: string\n  inputs:\n    type: array\n    items:\n      type: string\n  outputs:\n    type: array\n    items:\n      type: string\n  references:\n    type: array\n    items:\n      type: string\n`,
  );

  await writeIfMissing(
    path.join(PATHS.canonicalSchemas, 'agent.schema.yaml'),
    `type: object\nrequired:\n  - id\n  - name\n  - purpose\n  - when_to_delegate\n  - checklist\n  - report_format\n  - tool_limits\nproperties:\n  id:\n    type: string\n  name:\n    type: string\n  purpose:\n    type: string\n  when_to_delegate:\n    type: array\n    items:\n      type: string\n  checklist:\n    type: array\n    items:\n      type: string\n  report_format:\n    type: string\n  tool_limits:\n    type: array\n    items:\n      type: string\n`,
  );
}

async function dirHasFiles(dir: string): Promise<boolean> {
  if (!(await pathExists(dir))) return false;
  const entries = await readdirWithContext(
    dir,
    undefined,
    `check contents of ${dir}`,
  );
  return entries.length > 0;
}

async function ensureCanonicalStructure(): Promise<void> {
  await ensureDir(PATHS.canonicalRules);
  await ensureDir(PATHS.canonicalSkills);
  await ensureDir(PATHS.canonicalAgents);
  await writeCanonicalBaseDocs();

  if (!(await dirHasFiles(PATHS.canonicalRules))) {
    await bootstrapCanonicalRules();
  }
  if (!(await dirHasFiles(PATHS.canonicalSkills))) {
    await bootstrapCanonicalSkills();
  }
  if (!(await dirHasFiles(PATHS.canonicalAgents))) {
    await bootstrapCanonicalAgents();
  }
}

function renderCursorSkillsReadme(
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): string {
  const lines = ['# Schemas skills', ''];
  lines.push(
    'This directory contains specialized skills for the Schemas project.',
  );
  lines.push('Generated by `pnpm ai:sync`.');
  lines.push('');
  lines.push('## Available skills');
  lines.push('');

  for (const skill of canonicalSkills) {
    const id = String(skill.data.id);
    const desc = skill.data.description || '';
    lines.push(`### \`${id}\``);
    lines.push('');
    lines.push(`- **Use for**: ${desc}`);
    lines.push('');
  }

  lines.push('## Notes');
  lines.push('');
  lines.push(
    '- **Rules** (`.cursor/rules/`) are standards and constraints that auto-apply by file glob. Canonical source: `.ai/rules/`.',
  );
  lines.push(
    '- **Skills** (`.cursor/skills/`) are playbooks invoked for specific tasks. Canonical source: `.ai/capabilities/skills/`.',
  );
  lines.push(
    `- **Agents** (\`.cursor/agents/\`) are specialized personas (${canonicalAgents.map((a) => a.data.id).join(', ')}). Canonical source: \`.ai/capabilities/agents/\`.`,
  );

  return lines.join('\n');
}

async function generateCursorArtifacts(
  canonicalRules: CanonicalEntry[],
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): Promise<void> {
  for (const rule of canonicalRules) {
    const target = path.join(PATHS.cursorRules, `${rule.data.id}.mdc`);
    await writeFile(target, renderCursorRule(rule));
  }

  for (const skill of canonicalSkills) {
    const target = path.join(
      PATHS.cursorSkills,
      String(skill.data.id),
      'SKILL.md',
    );
    await writeFile(target, renderSkillFile(skill));
  }

  for (const agent of canonicalAgents) {
    const target = path.join(PATHS.cursorAgents, `${agent.data.id}.md`);
    await writeFile(target, renderAgentFile(agent));
  }

  await writeFile(
    path.join(PATHS.cursorSkills, 'README.md'),
    renderCursorSkillsReadme(canonicalSkills, canonicalAgents),
  );
}

async function generateClaudeArtifacts(
  canonicalRules: CanonicalEntry[],
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): Promise<void> {
  const settingsPath = path.join(PATHS.claudeRoot, 'settings.json');

  let existingSettings: Record<string, unknown> = {};
  if (await pathExists(settingsPath)) {
    const raw = await readFileWithContext(settingsPath, 'load Claude settings');
    try {
      existingSettings = JSON.parse(raw) as Record<string, unknown>;
    } catch (parseError) {
      throw new Error(
        `[sync] ${settingsPath} contains invalid JSON: ${(parseError as Error).message}\nFix the file manually or delete it to start fresh, then re-run pnpm ai:sync.`,
        { cause: parseError },
      );
    }
  }

  const existingPerms =
    existingSettings.permissions &&
    typeof existingSettings.permissions === 'object' &&
    !Array.isArray(existingSettings.permissions)
      ? (existingSettings.permissions as Record<string, unknown>)
      : {};
  const existingAllow = Array.isArray(existingPerms.allow)
    ? (existingPerms.allow as unknown[]).filter(
        (item): item is string => typeof item === 'string',
      )
    : [];
  const hardcodedAllow = [
    'Bash(ls:*)',
    'Bash(find:*)',
    'Bash(rg:*)',
    'Bash(cat:*)',
    'Bash(sed:*)',
    'Bash(git status:*)',
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Bash(pnpm build:*)',
    'Bash(pnpm test:*)',
    'Bash(pnpm lint:*)',
    'Bash(pnpm check:*)',
    'Bash(pnpm type-check:*)',
    'Bash(pnpm format:*)',
    'Bash(pnpm spell-check:*)',
    'Bash(pnpm generate-ipfs-schemas:*)',
    'Bash(pnpm validate-schemas:*)',
    'Bash(pnpm verify-schema-versions:*)',
    'Bash(pnpm hash-schemas:*)',
    'Bash(pnpm check-refs:*)',
    'Bash(pnpm ai\\:check:*)',
    'Bash(pnpm ai\\:sync:*)',
    'Bash(npx prettier:*)',
    'Bash(npx eslint:*)',
  ];
  const mergedAllow = [...new Set([...existingAllow, ...hardcodedAllow])].sort(
    (a, b) => a.localeCompare(b),
  );
  const mergedSettings = {
    ...existingSettings,
    permissions: {
      ...existingPerms,
      allow: mergedAllow,
    },
  };

  await writeFile(settingsPath, JSON.stringify(mergedSettings, null, 2));

  for (const skill of canonicalSkills) {
    const target = path.join(
      PATHS.claudeSkills,
      String(skill.data.id),
      'SKILL.md',
    );
    await writeFile(target, renderSkillFile(skill));
  }

  for (const rule of canonicalRules) {
    const target = path.join(
      PATHS.claudeSkills,
      `rule-${rule.data.id}`,
      'SKILL.md',
    );
    await writeFile(target, renderRuleSkillFile(rule));
  }

  for (const agent of canonicalAgents) {
    const target = path.join(PATHS.claudeAgents, `${agent.data.id}.md`);
    await writeFile(target, renderAgentFile(agent));
  }
}

async function generateCodexArtifacts(
  canonicalRules: CanonicalEntry[],
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): Promise<void> {
  for (const skill of canonicalSkills) {
    const target = path.join(
      PATHS.codexSkills,
      String(skill.data.id),
      'SKILL.md',
    );
    await writeFile(target, renderSkillFile(skill));
  }

  for (const rule of canonicalRules) {
    const target = path.join(
      PATHS.codexSkills,
      `rule-${rule.data.id}`,
      'SKILL.md',
    );
    await writeFile(target, renderRuleSkillFile(rule));
  }

  for (const agent of canonicalAgents) {
    const target = path.join(
      PATHS.codexSkills,
      String(agent.data.id),
      'SKILL.md',
    );
    await writeFile(target, renderAgentAsCodexSkill(agent));
  }
}

function checkbox(value: boolean): string {
  return value ? 'Yes' : 'No';
}

async function generateParityMatrix(
  canonicalRules: CanonicalEntry[],
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): Promise<void> {
  const lines: string[] = [];

  lines.push('# Parity matrix');
  lines.push('');
  lines.push('Generated by `pnpm ai:sync`.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Canonical rules: ${canonicalRules.length}`);
  lines.push(`- Canonical skills: ${canonicalSkills.length}`);
  lines.push(`- Canonical agents: ${canonicalAgents.length}`);
  lines.push('');

  lines.push('## Skills parity');
  lines.push('');
  lines.push('| Skill | Cursor | Claude | Codex |');
  lines.push('| --- | --- | --- | --- |');

  for (const skill of canonicalSkills) {
    const id = String(skill.data.id);
    const cursorExists = await pathExists(
      path.join(PATHS.cursorSkills, id, 'SKILL.md'),
    );
    const claudeExists = await pathExists(
      path.join(PATHS.claudeSkills, id, 'SKILL.md'),
    );
    const codexExists = await pathExists(
      path.join(PATHS.codexSkills, id, 'SKILL.md'),
    );
    lines.push(
      `| ${id} | ${checkbox(cursorExists)} | ${checkbox(claudeExists)} | ${checkbox(codexExists)} |`,
    );
  }

  lines.push('');
  lines.push('## Agents parity');
  lines.push('');
  lines.push('| Agent | Cursor agent | Claude agent | Codex skill mapping |');
  lines.push('| --- | --- | --- | --- |');

  for (const agent of canonicalAgents) {
    const id = String(agent.data.id);
    const cursorExists = await pathExists(
      path.join(PATHS.cursorAgents, `${id}.md`),
    );
    const claudeExists = await pathExists(
      path.join(PATHS.claudeAgents, `${id}.md`),
    );
    const codexExists = await pathExists(
      path.join(PATHS.codexSkills, id, 'SKILL.md'),
    );
    lines.push(
      `| ${id} | ${checkbox(cursorExists)} | ${checkbox(claudeExists)} | ${checkbox(codexExists)} |`,
    );
  }

  lines.push('');
  lines.push('## Rules parity');
  lines.push('');
  lines.push(
    '| Rule | Cursor rule | Claude skill mapping | Codex skill mapping |',
  );
  lines.push('| --- | --- | --- | --- |');

  for (const rule of canonicalRules) {
    const id = String(rule.data.id);
    const cursorExists = await pathExists(
      path.join(PATHS.cursorRules, `${id}.mdc`),
    );
    const claudeExists = await pathExists(
      path.join(PATHS.claudeSkills, `rule-${id}`, 'SKILL.md'),
    );
    const codexExists = await pathExists(
      path.join(PATHS.codexSkills, `rule-${id}`, 'SKILL.md'),
    );
    lines.push(
      `| ${id} | ${checkbox(cursorExists)} | ${checkbox(claudeExists)} | ${checkbox(codexExists)} |`,
    );
  }

  await writeFile(PATHS.parityMatrix, `${lines.join('\n')}\n`);
}

async function generateRootAdapters(
  canonicalRules: CanonicalEntry[],
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): Promise<void> {
  const sharedLinks = [
    '- `.ai/README.md`',
    '- `.ai/DEFINITIONS.md`',
    '- `.ai/STANDARDS.md`',
    '- `.ai/PARITY_MATRIX.md`',
    '- `.ai/PROJECT_CONTEXT.md`',
  ].join('\n');

  const skillsList = canonicalSkills
    .map((s) => `- \`${s.data.id}\` - ${s.data.description || s.data.id}`)
    .join('\n');
  const rulesList = canonicalRules
    .map((r) => `- \`rule-${r.data.id}\` - ${r.data.intent || r.data.id}`)
    .join('\n');
  const agentsList = canonicalAgents
    .map((a) => `- \`${a.data.id}\` - ${a.data.purpose || a.data.id}`)
    .join('\n');

  const agentsContent = `# AGENTS.md

Schemas AI instructions for Codex, Claude, and Cursor with equal capability parity.

## Equality rule

- Cursor, Claude, and Codex are treated as equals.
- No platform is primary for instruction definition.
- Canonical source: \`.ai/\`.

## Canonical workflow

1. Edit canonical files in \`.ai/\`.
2. Run \`pnpm ai:sync\` to regenerate platform adapters.
3. Run \`pnpm ai:check\` to validate parity and links.

## Current capability counts

- Rules: ${canonicalRules.length}
- Skills: ${canonicalSkills.length}
- Agents/Roles: ${canonicalAgents.length}

## Available skills

${skillsList}

## Rule mappings

${rulesList}

## Agent roles

${agentsList}

## Canonical references

${sharedLinks}

## Runtime adapter paths

- Cursor: \`.cursor/rules/\`, \`.cursor/skills/\`, \`.cursor/agents/\`
- Claude: \`.claude/settings.json\`, \`.claude/skills/\`, \`.claude/agents/\`
- Codex: \`.agents/skills/\`, \`AGENTS.md\`

## Setup commands

- Install deps: \`pnpm install\`
- Run all quality gates: \`pnpm check\`
- Run tests: \`pnpm test\`
- Build: \`pnpm build\`
- Generate JSON schemas: \`pnpm generate-ipfs-schemas\`
- Validate schemas: \`pnpm validate-schemas\`
- Validate AI instructions: \`pnpm ai:check\`

## Where to look first (by task)

- **Schema definitions**: \`src/{type}/\` — one directory per schema type
- **Shared primitives**: \`src/shared/schemas/primitives/\` — blockchain, time, ids, numbers, text, URI, geo, hashes, enums, version
- **Shared entities**: \`src/shared/schemas/entities/\` — participant, location
- **Core composition**: \`src/shared/schemas/core/\` — BaseIpfsSchema, NftIpfsSchema
- **Test utilities**: \`src/test-utils/\` — centralized fixtures and assertions
- **Generated schemas**: \`schemas/ipfs/\` — JSON Schema output (never edit directly)
- **Build scripts**: \`scripts/\` — generation, validation, hashing
`;

  const claudeHeader = `# CLAUDE.md

Claude adapter for Schemas AI instructions. This file is generated from canonical \`.ai/\`.

## Equality rule

- Cursor, Claude, and Codex are configured as equals.
- Capability parity is mandatory across all three.
- Canonical source remains tool-agnostic in \`.ai/\`.

## Claude runtime

- Baseline settings: \`.claude/settings.json\`
- Skills: \`.claude/skills/*/SKILL.md\`
- Agents: \`.claude/agents/*.md\`

## Required workflow

1. Update canonical docs under \`.ai/\`.
2. Run \`pnpm ai:sync\`.
3. Run \`pnpm ai:check\`.

## Canonical references

${sharedLinks}

## Capability counts

- Rules: ${canonicalRules.length}
- Skills: ${canonicalSkills.length}
- Agents/Roles: ${canonicalAgents.length}
`;

  const rawProjectContext = (await pathExists(PATHS.projectContext))
    ? (
        await readFileWithContext(PATHS.projectContext, 'load project context')
      ).trim()
    : null;

  // Demote all H1 headings to H2 to avoid duplicate H1 headings in generated adapters
  const demotedContext = rawProjectContext
    ? rawProjectContext.replace(/^# /gm, '## ')
    : null;

  const claudeContent = demotedContext
    ? `${claudeHeader.trimEnd()}\n\n${demotedContext}\n`
    : claudeHeader;

  const codexContent = demotedContext
    ? `${agentsContent.trimEnd()}\n\n${demotedContext}\n`
    : agentsContent;

  await writeFile(PATHS.rootAgents, codexContent);
  await writeFile(PATHS.rootClaude, claudeContent);
}

async function removeStaleAdapters(
  canonicalRules: CanonicalEntry[],
  canonicalSkills: CanonicalEntry[],
  canonicalAgents: CanonicalEntry[],
): Promise<number> {
  let removalFailures = 0;
  const validSkillIds = new Set(canonicalSkills.map((s) => String(s.data.id)));
  const validSkillAndAgentIds = new Set([
    ...validSkillIds,
    ...canonicalAgents.map((a) => String(a.data.id)),
  ]);
  const validRuleIds = new Set(canonicalRules.map((r) => String(r.data.id)));
  const validRuleSkillDirs = new Set(
    canonicalRules.map((r) => `rule-${r.data.id}`),
  );

  for (const baseDir of [
    PATHS.cursorSkills,
    PATHS.claudeSkills,
    PATHS.codexSkills,
  ]) {
    if (!(await pathExists(baseDir))) continue;
    const allowedIds =
      baseDir === PATHS.codexSkills ? validSkillAndAgentIds : validSkillIds;
    const entries = await readdirWithContext(
      baseDir,
      { withFileTypes: true },
      `scan stale adapters in ${path.relative(ROOT, baseDir)}`,
    );
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const id = entry.name;
      if (id.startsWith('rule-')) {
        if (validRuleSkillDirs.has(id)) continue;
      } else if (allowedIds.has(id)) {
        continue;
      }
      const staleDir = path.join(baseDir, id);
      if (!DRY_RUN) {
        try {
          await fs.rm(staleDir, { recursive: true });
        } catch (rmError) {
          warn(
            `[sync] warning: failed to remove ${path.relative(ROOT, staleDir)}: ${(rmError as Error).message}. Close any editors locking this file and re-run pnpm ai:sync.`,
          );
          removalFailures++;
          continue;
        }
      }
      log(`removed stale adapter: ${path.relative(ROOT, staleDir)}`);
    }
  }

  if (await pathExists(PATHS.cursorRules)) {
    const ruleFiles = await readdirWithContext(
      PATHS.cursorRules,
      { withFileTypes: true },
      'scan stale cursor rules',
    );
    for (const entry of ruleFiles) {
      if (!entry.isFile() || !entry.name.endsWith('.mdc')) continue;
      const id = entry.name.replace(/\.mdc$/, '');
      if (validRuleIds.has(id)) continue;
      const stalePath = path.join(PATHS.cursorRules, entry.name);
      if (!DRY_RUN) {
        try {
          await fs.unlink(stalePath);
        } catch (unlinkError) {
          warn(
            `[sync] warning: failed to remove ${path.relative(ROOT, stalePath)}: ${(unlinkError as Error).message}. Close any editors locking this file and re-run pnpm ai:sync.`,
          );
          removalFailures++;
          continue;
        }
      }
      log(`removed stale adapter: ${path.relative(ROOT, stalePath)}`);
    }
  }

  const validAgentIds = new Set(canonicalAgents.map((a) => String(a.data.id)));
  for (const agentsDir of [PATHS.cursorAgents, PATHS.claudeAgents]) {
    if (!(await pathExists(agentsDir))) continue;
    const files = await readdirWithContext(
      agentsDir,
      { withFileTypes: true },
      `scan stale agents in ${path.relative(ROOT, agentsDir)}`,
    );
    for (const entry of files) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const id = entry.name.replace(/\.md$/, '');
      if (validAgentIds.has(id)) continue;
      const stalePath = path.join(agentsDir, entry.name);
      if (!DRY_RUN) {
        try {
          await fs.unlink(stalePath);
        } catch (unlinkError) {
          warn(
            `[sync] warning: failed to remove ${path.relative(ROOT, stalePath)}: ${(unlinkError as Error).message}. Close any editors locking this file and re-run pnpm ai:sync.`,
          );
          removalFailures++;
          continue;
        }
      }
      log(`removed stale adapter: ${path.relative(ROOT, stalePath)}`);
    }
  }

  return removalFailures;
}

async function main(): Promise<void> {
  if (!(await pathExists(path.join(ROOT, 'package.json')))) {
    process.stderr.write(
      'Error: must be run from the project root (no package.json found)\n',
    );
    process.exitCode = 1;
    return;
  }

  await ensureCanonicalStructure();

  const { entries: canonicalRules } = await loadCanonicalEntries(
    PATHS.canonicalRules,
    { prefix: '[sync] ' },
  );
  const { entries: canonicalSkills } = await loadCanonicalEntries(
    PATHS.canonicalSkills,
    { prefix: '[sync] ' },
  );
  const { entries: canonicalAgents } = await loadCanonicalEntries(
    PATHS.canonicalAgents,
    { prefix: '[sync] ' },
  );

  const skillIds = new Set(canonicalSkills.map((s) => String(s.data.id)));
  for (const skill of canonicalSkills) {
    const id = String(skill.data.id);
    if (id.startsWith('rule-')) {
      throw new Error(
        `[validation] skill id "${id}" must not start with "rule-" (reserved namespace)`,
      );
    }
  }
  for (const agent of canonicalAgents) {
    const agentId = String(agent.data.id);
    if (agentId.startsWith('rule-')) {
      throw new Error(
        `[validation] agent id "${agentId}" must not start with "rule-" (reserved namespace)`,
      );
    }
    if (skillIds.has(agentId)) {
      throw new Error(`[codex] duplicate skill/agent id: ${agentId}`);
    }
  }

  await generateCursorArtifacts(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
  );
  await generateClaudeArtifacts(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
  );
  await generateCodexArtifacts(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
  );
  await generateParityMatrix(canonicalRules, canonicalSkills, canonicalAgents);
  await generateRootAdapters(canonicalRules, canonicalSkills, canonicalAgents);
  const removalFailures = await removeStaleAdapters(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
  );
  if (removalFailures > 0) {
    log(
      `[sync] completed with ${removalFailures} warning(s): some stale adapters could not be removed`,
    );
    process.exitCode = 1;
  } else {
    log('ai sync complete');
  }
  log(`rules: ${canonicalRules.length}`);
  log(`skills: ${canonicalSkills.length}`);
  log(`agents: ${canonicalAgents.length}`);
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    process.stderr.write(`${error.stack || error.message}\n`);
  } else {
    process.stderr.write(`Unexpected error: ${String(error)}\n`);
  }
  process.exitCode = 1;
});
