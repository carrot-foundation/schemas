#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  log,
  pathExists,
  readFileWithContext,
  parseFrontmatter as parseFrontmatterBase,
  normalizeArray,
  listFilesRecursive,
} from './ai-utils.mjs';

const ROOT = process.cwd();

function isWithinRoot(absolutePath) {
  const resolved = path.resolve(absolutePath);
  return resolved === ROOT || resolved.startsWith(ROOT + path.sep);
}

const PATHS = {
  canonicalRoot: path.join(ROOT, '.ai'),
  canonicalRules: path.join(ROOT, '.ai', 'rules'),
  canonicalSkills: path.join(ROOT, '.ai', 'capabilities', 'skills'),
  canonicalAgents: path.join(ROOT, '.ai', 'capabilities', 'agents'),
  canonicalSchemas: path.join(ROOT, '.ai', 'schemas'),

  cursorRules: path.join(ROOT, '.cursor', 'rules'),
  cursorSkills: path.join(ROOT, '.cursor', 'skills'),
  cursorAgents: path.join(ROOT, '.cursor', 'agents'),

  claudeSkills: path.join(ROOT, '.claude', 'skills'),
  claudeAgents: path.join(ROOT, '.claude', 'agents'),
  claudeSettings: path.join(ROOT, '.claude', 'settings.json'),

  codexSkills: path.join(ROOT, '.agents', 'skills'),

  parityMatrix: path.join(ROOT, '.ai', 'PARITY_MATRIX.md'),
};

const REQUIRED_CANONICAL_FILES = [
  path.join(PATHS.canonicalRoot, 'README.md'),
  path.join(PATHS.canonicalRoot, 'DEFINITIONS.md'),
  path.join(PATHS.canonicalRoot, 'STANDARDS.md'),
  path.join(PATHS.canonicalRoot, 'PROJECT_CONTEXT.md'),
  PATHS.parityMatrix,
];

function buildStalePatterns(rules, skills) {
  const patterns = [];
  for (const rule of rules) {
    if (!rule.data.id) continue;
    const id = String(rule.data.id);
    patterns.push(`.cursor/rules/${id}.mdc`);
    patterns.push(`@${id}.mdc`);
  }
  for (const skill of skills) {
    if (!skill.data.id) continue;
    const id = String(skill.data.id);
    patterns.push(`.cursor/skills/${id}/SKILL.md`);
  }
  return patterns;
}

const STALE_CHECK_FILES = [
  path.join(ROOT, 'README.md'),
  path.join(ROOT, 'AGENTS.md'),
  path.join(ROOT, 'CLAUDE.md'),
  path.join(ROOT, '.ai', 'README.md'),
  path.join(ROOT, '.ai', 'DEFINITIONS.md'),
  path.join(ROOT, '.ai', 'STANDARDS.md'),
  path.join(ROOT, '.ai', 'PARITY_MATRIX.md'),
];

function parseFrontmatter(rawContent) {
  return parseFrontmatterBase(rawContent, '[check] ');
}

function parseSchemaRequired(content) {
  const lines = content.split('\n');
  const required = [];
  let inRequired = false;
  for (const line of lines) {
    if (line.trim() === 'required:') {
      inRequired = true;
      continue;
    }
    if (inRequired) {
      const match = line.match(/^\s+-\s+(\S+)/);
      if (match) {
        required.push(match[1]);
      } else {
        inRequired = false;
      }
    }
  }
  return required;
}

function parseSchemaPropertyTypes(content) {
  const lines = content.split('\n');
  const types = {};
  let inProperties = false;
  let currentKey = null;
  for (const line of lines) {
    if (line.trim() === 'properties:') {
      inProperties = true;
      continue;
    }
    if (!inProperties) continue;
    const keyMatch = line.match(/^(\s{2})([A-Za-z0-9_-]+):\s*$/);
    const typeMatch = line.match(/^\s{4}type:\s*(string|array|object)\s*$/);
    if (keyMatch && keyMatch[1].length === 2) {
      currentKey = keyMatch[2];
      continue;
    }
    if (typeMatch && currentKey) {
      const t = typeMatch[1];
      if (t === 'string' || t === 'array') {
        types[currentKey] = t;
      }
      currentKey = null;
    }
  }
  return types;
}

async function loadRequiredFieldsFromSchemas(errors = []) {
  const results = { rule: [], skill: [], agent: [] };
  for (const [key, file] of [
    ['rule', 'rule.schema.yaml'],
    ['skill', 'skill.schema.yaml'],
    ['agent', 'agent.schema.yaml'],
  ]) {
    const p = path.join(PATHS.canonicalSchemas, file);
    if (await pathExists(p)) {
      const content = await readFileWithContext(p, 'load schema');
      const parsed = parseSchemaRequired(content);
      if (parsed.length > 0) {
        results[key] = parsed;
      } else if (content.includes('required')) {
        errors.push(
          `[schema] ${file} contains "required" but parser returned no fields — schema may be malformed`,
        );
      } else {
        errors.push(
          `[schema] ${file} has no required fields — run \`pnpm ai:sync\` to regenerate`,
        );
      }
    } else {
      errors.push(
        `[schema] ${file} not found — run \`pnpm ai:sync\` to generate schema files`,
      );
    }
  }
  return results;
}

const FALLBACK_RULE_TYPES = {
  scope: 'array',
  requirements: 'array',
  anti_patterns: 'array',
};
const FALLBACK_SKILL_TYPES = {
  when_to_use: 'array',
  workflow: 'array',
  inputs: 'array',
  outputs: 'array',
  references: 'array',
};
const FALLBACK_AGENT_TYPES = {
  when_to_delegate: 'array',
  checklist: 'array',
  tool_limits: 'array',
  report_format: 'string',
};

async function loadSchemaTypeMaps(errors = []) {
  const results = {
    rule: FALLBACK_RULE_TYPES,
    skill: FALLBACK_SKILL_TYPES,
    agent: FALLBACK_AGENT_TYPES,
  };
  for (const [key, file] of [
    ['rule', 'rule.schema.yaml'],
    ['skill', 'skill.schema.yaml'],
    ['agent', 'agent.schema.yaml'],
  ]) {
    const p = path.join(PATHS.canonicalSchemas, file);
    if (await pathExists(p)) {
      const content = await readFileWithContext(p, 'load schema types');
      const parsed = parseSchemaPropertyTypes(content);
      if (Object.keys(parsed).length > 0) {
        results[key] = parsed;
      } else if (content.includes('properties')) {
        errors.push(
          `[schema] ${file} contains "properties" but parser returned no types — schema may be malformed`,
        );
      } else {
        errors.push(
          `[schema] ${file} has no property types — run \`pnpm ai:sync\` to regenerate`,
        );
      }
    } else {
      errors.push(
        `[schema] ${file} not found — run \`pnpm ai:sync\` to generate schema files`,
      );
    }
  }
  return results;
}

async function loadCanonical(dir, errors = []) {
  const files = await listFilesRecursive(dir, '.md');
  const parsed = [];
  for (const file of files) {
    const raw = await readFileWithContext(file, 'load canonical');
    const { data, body } = parseFrontmatter(raw);
    parsed.push({ file, data, body, raw });
  }
  const ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/;
  const seenIds = new Map();
  const validEntries = [];
  for (const entry of parsed) {
    const id = entry.data.id;
    const rel = path.relative(ROOT, entry.file);
    if (id == null) {
      errors.push(`[validation] ${rel} is missing "id" in frontmatter`);
      continue;
    }
    if (typeof id !== 'string') {
      errors.push(
        `[validation] ${rel} has non-string id (got ${typeof id}: ${id})`,
      );
      continue;
    }
    if (id === '') {
      errors.push(`[validation] ${rel} has empty "id" in frontmatter`);
      continue;
    }
    if (!ID_PATTERN.test(id)) {
      errors.push(
        `[validation] ${rel} has malformed id "${id}" — only lowercase alphanumeric, hyphens, and underscores allowed`,
      );
      continue;
    }
    if (seenIds.has(id)) {
      errors.push(`[duplicate] id "${id}" in ${rel} and ${seenIds.get(id)}`);
    } else {
      seenIds.set(id, rel);
    }
    validEntries.push(entry);
  }
  return validEntries;
}

function assertRequiredFields(items, fields, errors, kind) {
  for (const item of items) {
    for (const field of fields) {
      if (!(field in item.data)) {
        errors.push(
          `[${kind}] missing field \`${field}\` in ${path.relative(ROOT, item.file)}`,
        );
      }
    }
  }
}

function assertFieldTypes(items, typeMap, errors, kind) {
  for (const item of items) {
    for (const [field, expectedType] of Object.entries(typeMap)) {
      if (!(field in item.data)) continue;
      const value = item.data[field];
      if (expectedType === 'array' && !Array.isArray(value)) {
        errors.push(
          `[${kind}] field \`${field}\` should be an array in ${path.relative(ROOT, item.file)}`,
        );
      }
      if (expectedType === 'string' && typeof value !== 'string') {
        errors.push(
          `[${kind}] field \`${field}\` should be a string in ${path.relative(ROOT, item.file)}`,
        );
      }
    }
  }
}

async function verifyParity(rules, skills, agents, errors) {
  for (const skill of skills) {
    const id = String(skill.data.id);
    for (const target of [
      path.join(PATHS.cursorSkills, id, 'SKILL.md'),
      path.join(PATHS.claudeSkills, id, 'SKILL.md'),
      path.join(PATHS.codexSkills, id, 'SKILL.md'),
    ]) {
      if (!(await pathExists(target)))
        errors.push(
          `[parity][skill:${id}] missing ${path.relative(ROOT, target)}`,
        );
    }
  }
  for (const agent of agents) {
    const id = String(agent.data.id);
    for (const target of [
      path.join(PATHS.cursorAgents, `${id}.md`),
      path.join(PATHS.claudeAgents, `${id}.md`),
      path.join(PATHS.codexSkills, id, 'SKILL.md'),
    ]) {
      if (!(await pathExists(target)))
        errors.push(
          `[parity][agent:${id}] missing ${path.relative(ROOT, target)}`,
        );
    }
  }
  for (const rule of rules) {
    const id = String(rule.data.id);
    for (const target of [
      path.join(PATHS.cursorRules, `${id}.mdc`),
      path.join(PATHS.claudeSkills, `rule-${id}`, 'SKILL.md'),
      path.join(PATHS.codexSkills, `rule-${id}`, 'SKILL.md'),
    ]) {
      if (!(await pathExists(target)))
        errors.push(
          `[parity][rule:${id}] missing ${path.relative(ROOT, target)}`,
        );
    }
  }
}

function checkAdapterBodyLength(adapterPath, adapterContent, kind, id, errors) {
  const { body: adapterBody } = parseFrontmatter(adapterContent);
  if (!adapterBody.trim()) {
    errors.push(
      `[stale][${kind}:${id}] adapter ${path.relative(ROOT, adapterPath)} appears empty. Run \`pnpm ai:sync\`.`,
    );
  } else if (adapterBody.split('\n').length < 3) {
    errors.push(
      `[stale][${kind}:${id}] adapter ${path.relative(ROOT, adapterPath)} appears truncated. Run \`pnpm ai:sync\`.`,
    );
  }
}

async function verifyAdapterFreshness(rules, skills, agents, errors) {
  for (const rule of rules) {
    const id = String(rule.data.id);
    for (const p of [
      path.join(PATHS.cursorRules, `${id}.mdc`),
      path.join(PATHS.claudeSkills, `rule-${id}`, 'SKILL.md'),
      path.join(PATHS.codexSkills, `rule-${id}`, 'SKILL.md'),
    ]) {
      if (await pathExists(p))
        checkAdapterBodyLength(
          p,
          await readFileWithContext(p, 'verify adapter freshness'),
          'rule',
          id,
          errors,
        );
    }
  }
  for (const skill of skills) {
    const id = String(skill.data.id);
    for (const p of [
      path.join(PATHS.cursorSkills, id, 'SKILL.md'),
      path.join(PATHS.claudeSkills, id, 'SKILL.md'),
      path.join(PATHS.codexSkills, id, 'SKILL.md'),
    ]) {
      if (await pathExists(p))
        checkAdapterBodyLength(
          p,
          await readFileWithContext(p, 'verify adapter freshness'),
          'skill',
          id,
          errors,
        );
    }
  }
  for (const agent of agents) {
    const id = String(agent.data.id);
    for (const p of [
      path.join(PATHS.cursorAgents, `${id}.md`),
      path.join(PATHS.claudeAgents, `${id}.md`),
      path.join(PATHS.codexSkills, id, 'SKILL.md'),
    ]) {
      if (await pathExists(p))
        checkAdapterBodyLength(
          p,
          await readFileWithContext(p, 'verify adapter freshness'),
          'agent',
          id,
          errors,
        );
    }
  }
}

async function checkStalePatterns(stalePatterns, errors) {
  const canonicalFiles = [
    ...(await listFilesRecursive(PATHS.canonicalRules, '.md')),
    ...(await listFilesRecursive(PATHS.canonicalSkills, '.md')),
    ...(await listFilesRecursive(PATHS.canonicalAgents, '.md')),
  ];
  for (const file of [...STALE_CHECK_FILES, ...canonicalFiles]) {
    if (!(await pathExists(file))) continue;
    const raw = await readFileWithContext(file, 'check stale patterns');
    for (const pattern of stalePatterns) {
      if (raw.includes(pattern))
        errors.push(
          `[stale] ${path.relative(ROOT, file)} contains stale reference: ${pattern}`,
        );
    }
  }
}

function stripCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, '');
}

function extractMarkdownLinks(content) {
  const stripped = stripCodeBlocks(content);
  const links = [];
  const angleRegex = /\]\(<([^>]+)>\)/g;
  let match = angleRegex.exec(stripped);
  while (match) {
    links.push(match[1]);
    match = angleRegex.exec(stripped);
  }
  const normalRegex = /\[[^\]]*\]\(([^)]+)\)/g;
  match = normalRegex.exec(stripped);
  while (match) {
    if (!match[1].startsWith('<')) links.push(match[1]);
    match = normalRegex.exec(stripped);
  }
  return links;
}

async function resolveLink(filePath, link) {
  const cleaned = link.replaceAll(/(?:^<)|(?:>$)/g, '').trim();
  if (!cleaned || cleaned.startsWith('#')) return true;
  if (
    cleaned.startsWith('http://') ||
    cleaned.startsWith('https://') ||
    cleaned.startsWith('mailto:') ||
    cleaned.startsWith('mdc:')
  )
    return true;
  const withoutAnchor = cleaned.split('#')[0].split('?')[0];
  if (!withoutAnchor) return true;
  if (withoutAnchor.startsWith('/')) {
    const resolvedAbs = path.resolve(path.join(ROOT, withoutAnchor.slice(1)));
    if (!isWithinRoot(resolvedAbs)) return false;
    return await pathExists(resolvedAbs);
  }
  const resolved = path.resolve(path.dirname(filePath), withoutAnchor);
  if (!isWithinRoot(resolved)) return false;
  if (await pathExists(resolved)) return true;
  if (await pathExists(`${resolved}.md`)) return true;
  return false;
}

async function checkLinks(errors) {
  const aiFiles = await listFilesRecursive(PATHS.canonicalRoot, '.md');
  const requiredRootFiles = [
    path.join(ROOT, 'AGENTS.md'),
    path.join(ROOT, 'CLAUDE.md'),
  ];
  for (const file of requiredRootFiles) {
    if (!(await pathExists(file))) {
      errors.push(
        `[missing] required adapter doc ${path.relative(ROOT, file)} does not exist — run pnpm ai:sync`,
      );
    }
  }
  const optionalRootFiles = [path.join(ROOT, 'README.md')];
  const rootFiles = [...requiredRootFiles, ...optionalRootFiles];
  for (const file of [...rootFiles, ...aiFiles]) {
    if (!(await pathExists(file))) continue;
    const raw = await readFileWithContext(file, 'check links');
    for (const link of extractMarkdownLinks(raw)) {
      if (!(await resolveLink(file, link)))
        errors.push(
          `[link] broken link in ${path.relative(ROOT, file)} -> ${link}`,
        );
    }
  }
}

function checkFrontmatterQuality(rules, skills, errors) {
  for (const rule of rules) {
    const requirements = normalizeArray(rule.data.requirements);
    const antis = normalizeArray(rule.data.anti_patterns);
    const reqSet = new Set(requirements);
    const antiSet = new Set(antis);
    if (reqSet.size > 0 && reqSet.size === antiSet.size) {
      const allMatch = [...antiSet].every((a) => reqSet.has(a));
      if (allMatch) {
        errors.push(
          `[quality][rule:${rule.data.id}] requirements and anti_patterns are identical.`,
        );
      }
    }
  }
  for (const skill of skills) {
    const wtu = normalizeArray(skill.data.when_to_use);
    const wf = normalizeArray(skill.data.workflow);
    const wtuSet = new Set(wtu);
    const wfSet = new Set(wf);
    if (wtuSet.size > 0 && wtuSet.size === wfSet.size && wfSet.size > 1) {
      const allMatch = [...wfSet].every((w) => wtuSet.has(w));
      if (allMatch) {
        errors.push(
          `[quality][skill:${skill.data.id}] when_to_use and workflow are identical.`,
        );
      }
    }
  }
}

async function checkReferencesPaths(skills, errors) {
  for (const skill of skills) {
    const refs = normalizeArray(skill.data.references);
    const id = String(skill.data.id);
    for (const ref of refs) {
      if (typeof ref !== 'string' || !ref.trim()) continue;
      const absolute = path.resolve(path.join(ROOT, ref.replace(/\/$/, '')));
      if (!isWithinRoot(absolute)) {
        errors.push(`[references][skill:${id}] path escapes repo root: ${ref}`);
        continue;
      }
      const exists =
        (await pathExists(absolute)) ||
        (await pathExists(absolute + '.md')) ||
        (await pathExists(absolute + '/'));
      if (!exists)
        errors.push(`[references][skill:${id}] path does not exist: ${ref}`);
    }
  }
}

async function verifyOrphanAdapters(rules, skills, agents, errors) {
  const validRuleIds = new Set(rules.map((r) => String(r.data.id)));
  const validRuleSkillDirs = new Set(rules.map((r) => `rule-${r.data.id}`));
  const validSkillIds = new Set(skills.map((s) => String(s.data.id)));
  const validAgentIds = new Set(agents.map((a) => String(a.data.id)));

  if (await pathExists(PATHS.cursorRules)) {
    for (const entry of await fs.readdir(PATHS.cursorRules, {
      withFileTypes: true,
    })) {
      if (!entry.isFile() || !entry.name.endsWith('.mdc')) continue;
      if (!validRuleIds.has(entry.name.replace(/\.mdc$/, '')))
        errors.push(
          `[orphan] .cursor/rules/${entry.name} has no canonical source`,
        );
    }
  }
  for (const baseDir of [
    PATHS.cursorSkills,
    PATHS.claudeSkills,
    PATHS.codexSkills,
  ]) {
    if (!(await pathExists(baseDir))) continue;
    const allowSkillOnly =
      baseDir === PATHS.cursorSkills || baseDir === PATHS.claudeSkills;
    for (const entry of await fs.readdir(baseDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const id = entry.name;
      if (id.startsWith('rule-')) {
        if (!validRuleSkillDirs.has(id))
          errors.push(
            `[orphan] ${path.relative(ROOT, path.join(baseDir, id))} has no canonical rule`,
          );
      } else if (allowSkillOnly) {
        if (!validSkillIds.has(id))
          errors.push(
            `[orphan] ${path.relative(ROOT, path.join(baseDir, id))} has no canonical skill`,
          );
      } else if (!validSkillIds.has(id) && !validAgentIds.has(id))
        errors.push(
          `[orphan] ${path.relative(ROOT, path.join(baseDir, id))} has no canonical skill or agent`,
        );
    }
  }
  for (const agentsDir of [PATHS.cursorAgents, PATHS.claudeAgents]) {
    if (!(await pathExists(agentsDir))) continue;
    for (const entry of await fs.readdir(agentsDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      if (!validAgentIds.has(entry.name.replace(/\.md$/, '')))
        errors.push(
          `[orphan] ${path.relative(ROOT, path.join(agentsDir, entry.name))} has no canonical agent`,
        );
    }
  }
}

function assertNonEmptyStrings(items, stringFields, errors, kind) {
  for (const item of items) {
    for (const field of stringFields) {
      if (!(field in item.data)) continue;
      if (
        typeof item.data[field] === 'string' &&
        item.data[field].trim() === ''
      )
        errors.push(
          `[${kind}] field \`${field}\` must be non-empty in ${path.relative(ROOT, item.file)}`,
        );
    }
  }
}

function assertIdMatchesFilename(items, errors, kind) {
  for (const item of items) {
    const basename = path.basename(item.file, '.md');
    const id = String(item.data.id || '');
    if (id !== basename)
      errors.push(
        `[${kind}] id "${id}" does not match filename in ${path.relative(ROOT, item.file)} (expected ${basename})`,
      );
  }
}

function assertRequiredHeadings(rules, skills, agents, errors) {
  for (const rule of rules) {
    if (!/^##\s+Rule\s+body\s*$/im.test(rule.body))
      errors.push(
        `[rule:${rule.data.id}] body must contain "## Rule body" heading`,
      );
  }
  for (const skill of skills) {
    if (!skill.body.trim())
      errors.push(`[skill:${skill.data.id}] body must not be empty`);
  }
  for (const agent of agents) {
    if (!/^##\s+Instructions\s*$/im.test(agent.body))
      errors.push(
        `[agent:${agent.data.id}] body must contain "## Instructions" heading`,
      );
  }
}

async function main() {
  if (!(await pathExists(path.join(ROOT, 'package.json')))) {
    process.stderr.write(
      'Error: must be run from the project root (no package.json found)\n',
    );
    process.exitCode = 1;
    return;
  }

  const errors = [];

  for (const file of REQUIRED_CANONICAL_FILES) {
    if (!(await pathExists(file)))
      errors.push(`[canonical] missing ${path.relative(ROOT, file)}`);
  }
  if (!(await pathExists(PATHS.claudeSettings)))
    errors.push('[claude] missing .claude/settings.json');

  const schemaFields = await loadRequiredFieldsFromSchemas(errors);
  const schemaTypes = await loadSchemaTypeMaps(errors);

  const ruleFields =
    schemaFields.rule.length > 0
      ? schemaFields.rule
      : ['id', 'intent', 'scope', 'requirements', 'anti_patterns'];
  const skillFields =
    schemaFields.skill.length > 0
      ? schemaFields.skill
      : [
          'id',
          'name',
          'description',
          'when_to_use',
          'workflow',
          'inputs',
          'outputs',
          'references',
        ];
  const agentFields =
    schemaFields.agent.length > 0
      ? schemaFields.agent
      : [
          'id',
          'name',
          'purpose',
          'when_to_delegate',
          'checklist',
          'report_format',
          'tool_limits',
        ];

  const canonicalRules = await loadCanonical(PATHS.canonicalRules, errors);
  const canonicalSkills = await loadCanonical(PATHS.canonicalSkills, errors);
  const canonicalAgents = await loadCanonical(PATHS.canonicalAgents, errors);

  assertRequiredFields(canonicalRules, ruleFields, errors, 'rule');
  assertRequiredFields(canonicalSkills, skillFields, errors, 'skill');
  assertRequiredFields(canonicalAgents, agentFields, errors, 'agent');
  assertFieldTypes(canonicalRules, schemaTypes.rule, errors, 'rule');
  assertFieldTypes(canonicalSkills, schemaTypes.skill, errors, 'skill');
  assertFieldTypes(canonicalAgents, schemaTypes.agent, errors, 'agent');

  for (const rule of canonicalRules) {
    if (normalizeArray(rule.data.scope).length === 0)
      errors.push(
        `[rule:${rule.data.id}] scope must contain at least one path pattern`,
      );
  }

  assertNonEmptyStrings(canonicalRules, ['id', 'intent'], errors, 'rule');
  assertNonEmptyStrings(
    canonicalSkills,
    ['id', 'name', 'description'],
    errors,
    'skill',
  );
  assertNonEmptyStrings(
    canonicalAgents,
    ['id', 'name', 'purpose', 'report_format'],
    errors,
    'agent',
  );
  assertIdMatchesFilename(canonicalRules, errors, 'rule');
  assertIdMatchesFilename(canonicalSkills, errors, 'skill');
  assertIdMatchesFilename(canonicalAgents, errors, 'agent');
  assertRequiredHeadings(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
    errors,
  );

  await verifyParity(canonicalRules, canonicalSkills, canonicalAgents, errors);
  await verifyAdapterFreshness(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
    errors,
  );
  await verifyOrphanAdapters(
    canonicalRules,
    canonicalSkills,
    canonicalAgents,
    errors,
  );
  await checkReferencesPaths(canonicalSkills, errors);
  await checkStalePatterns(
    buildStalePatterns(canonicalRules, canonicalSkills),
    errors,
  );
  await checkLinks(errors);
  checkFrontmatterQuality(canonicalRules, canonicalSkills, errors);

  // Verify capability counts in CLAUDE.md and AGENTS.md
  for (const adapterFile of [
    path.join(ROOT, 'CLAUDE.md'),
    path.join(ROOT, 'AGENTS.md'),
  ]) {
    if (!(await pathExists(adapterFile))) continue;
    const content = await readFileWithContext(
      adapterFile,
      'verify capability counts',
    );
    const countsMap = {
      Rules: canonicalRules.length,
      Skills: canonicalSkills.length,
      'Agents/Roles': canonicalAgents.length,
    };
    for (const [label, expected] of Object.entries(countsMap)) {
      const match = content.match(
        new RegExp(`-\\s+${label.replace('/', '\\/')}:\\s+(\\d+)`),
      );
      if (match && Number(match[1]) !== expected) {
        errors.push(
          `[counts] ${path.relative(ROOT, adapterFile)} shows ${label}: ${match[1]} but canonical has ${expected}. Run \`pnpm ai:sync\`.`,
        );
      }
    }
  }

  if (errors.length > 0) {
    log('ai check failed');
    for (const error of errors) log(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  log('ai check passed');
  log(`rules: ${canonicalRules.length}`);
  log(`skills: ${canonicalSkills.length}`);
  log(`agents: ${canonicalAgents.length}`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
