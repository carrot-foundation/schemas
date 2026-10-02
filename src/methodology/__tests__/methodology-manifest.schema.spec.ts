import { describe, expect, it } from 'vitest';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { MethodologySchema } from '../methodology.schema';
import { MethodologyDataSchema } from '../methodology.data.schema';
import { AuditRuleDefinitionSchema } from '../../shared';
import { MassIDAuditSchema } from '../../mass-id-audit';
import {
  validMethodologyRulesManifestFixture,
  validManifestAuditRuleDefinitionFixture,
} from '../../test-utils';
import example from '../../../schemas/ipfs/methodology/methodology.example.json';
import publishedSchema from '../../../schemas/ipfs/methodology/methodology.schema.json';
import auditExample from '../../../schemas/ipfs/mass-id-audit/mass-id-audit.example.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateDataJson = ajv.compile(publishedSchema.properties.data);

const data = {
  ...example.data,
  version: '3.4.1',
  rules_manifest: validMethodologyRulesManifestFixture,
  mass_id_audit_rules: [validManifestAuditRuleDefinitionFixture],
};

describe('Methodology manifest provenance', () => {
  it('preserves independent operational and source versions with the complete immutable path', () => {
    const input = { ...example, data };
    expect(MethodologySchema.safeParse(input).data).toEqual(input);
    expect(validateDataJson(data)).toBe(true);
  });

  it('preserves an explicit source join without renaming the operational rule slug', () => {
    const input = validManifestAuditRuleDefinitionFixture;
    expect(AuditRuleDefinitionSchema.safeParse(input).data).toEqual(input);
    expect(input.application_rule_slug).not.toBe(input.slug);
  });

  it('requires provenance instead of accepting the former unbound Methodology shape', () => {
    const { rules_manifest: omitted, ...withoutManifest } = data;
    expect(omitted).toEqual(validMethodologyRulesManifestFixture);
    expect(MethodologyDataSchema.safeParse(withoutManifest).success).toBe(
      false,
    );
    expect(validateDataJson(withoutManifest)).toBe(false);
  });

  it.each(['ipfs_uri', 'sha256', 'source_commit', 'framework', 'application'])(
    'requires manifest field %s in source and generated validation',
    (key) => {
      const manifest: Record<string, unknown> = {
        ...validMethodologyRulesManifestFixture,
      };
      Reflect.deleteProperty(manifest, key);
      const input = { ...data, rules_manifest: manifest };
      expect(MethodologyDataSchema.safeParse(input).success).toBe(false);
      expect(validateDataJson(input)).toBe(false);
    },
  );

  it.each([
    ['ipfs_uri', 'https://example.com/manifest.json'],
    ['ipfs_uri', 'ipns://example-manifest'],
    ['ipfs_uri', 'ipfs://random-uri'],
    ['sha256', '0'.repeat(63)],
    ['sha256', 'A'.repeat(64)],
    ['sha256', `0x${'0'.repeat(64)}`],
    ['source_commit', 'main'],
    ['source_commit', '1'.repeat(39)],
    ['source_commit', 'A'.repeat(40)],
    ['source_commit', 'g'.repeat(40)],
    ['framework', { slug: 'Example Framework', version: '1.0.2' }],
    ['framework', { slug: 'example-framework' }],
    ['framework', { slug: 'example-framework', version: 'not-a-version' }],
    ['application', { slug: '', version: '1.0.0' }],
    ['application', { version: '1.0.0' }],
    ['application', { slug: 'example-application', version: '' }],
    [
      'application',
      { slug: 'example-application', version: '1.0.0', extra: true },
    ],
    ['extra', 'not-allowed'],
  ])('rejects invalid manifest %s value %j', (key, value) => {
    const input = {
      ...data,
      rules_manifest: { ...validMethodologyRulesManifestFixture, [key]: value },
    };
    expect(MethodologyDataSchema.safeParse(input).success).toBe(false);
    expect(validateDataJson(input)).toBe(false);
  });

  it.each([
    ['application_rule_slug', undefined],
    ['application_rule_slug', null],
    ['application_rule_slug', ''],
    ['application_rule_slug', 'Example Rule'],
    ['implements_methodology_framework_rules', undefined],
    ['implements_methodology_framework_rules', null],
    ['implements_methodology_framework_rules', []],
    [
      'implements_methodology_framework_rules',
      ['example-requirement', 'example-requirement'],
    ],
    ['implements_methodology_framework_rules', ['Invalid Requirement']],
  ])('rejects invalid application provenance %s value %j', (key, value) => {
    const input = {
      ...data,
      mass_id_audit_rules: [
        { ...validManifestAuditRuleDefinitionFixture, [key]: value },
      ],
    };
    expect(MethodologyDataSchema.safeParse(input).success).toBe(false);
    expect(validateDataJson(input)).toBe(false);
  });

  it('preserves every distinct normative association in source and generated validation', () => {
    const input = {
      ...data,
      mass_id_audit_rules: [
        {
          ...validManifestAuditRuleDefinitionFixture,
          implements_methodology_framework_rules: [
            'example-requirement',
            'another-requirement',
          ],
        },
      ],
    };
    expect(MethodologyDataSchema.safeParse(input).data).toEqual(input);
    expect(validateDataJson(input)).toBe(true);
  });

  it('keeps the frozen Methodology JSON join and executed processor identity on Audit', () => {
    const input = structuredClone(auditExample);
    input.data.rule_execution_results[0].rule_source_code_version = '4.5.6';
    expect(MassIDAuditSchema.safeParse(input).data).toEqual(input);
    expect(input.data.methodology.ipfs_uri).toEqual(
      auditExample.data.methodology.ipfs_uri,
    );
    const duplicateManifest = {
      ...input,
      data: {
        ...input.data,
        rules_manifest: validMethodologyRulesManifestFixture,
      },
    };
    expect(MassIDAuditSchema.safeParse(duplicateManifest).success).toBe(false);
  });
});
