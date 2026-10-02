import type { MethodologyRulesManifest } from '../../methodology';
import type { AuditRuleDefinition } from '../../shared';
import { validAuditRuleDefinitionFixture } from './audit.fixtures';

export const validMethodologyRulesManifestFixture: MethodologyRulesManifest = {
  ipfs_uri:
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm/manifest.json',
  sha256: '0'.repeat(64),
  source_commit: '1'.repeat(40),
  framework: { slug: 'example-framework', version: '1.0.2' },
  application: { slug: 'example-application', version: '1.0.0' },
};

export const validManifestAuditRuleDefinitionFixture: AuditRuleDefinition = {
  ...validAuditRuleDefinitionFixture,
  application_rule_slug: 'example-application-rule',
  implements_methodology_framework_rules: ['example-requirement'],
};
