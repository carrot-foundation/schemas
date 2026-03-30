import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildReferenceStory,
  emitCollectionExample,
  emitCreditExample,
  emitCreditPurchaseReceiptExample,
  emitCreditRetirementReceiptExample,
  emitGasIDExample,
  emitMassIDAuditExample,
  emitMassIDExample,
  emitMethodologyExample,
  emitRecycledIDExample,
  emitters,
  NON_PRODUCTION_MARKER,
} from '../index.js';
import { MassIDIpfsSchema } from '../../../src/mass-id';
import { GasIDIpfsSchema } from '../../../src/gas-id';
import { RecycledIDIpfsSchema } from '../../../src/recycled-id';
import { CreditSchema } from '../../../src/credit';
import { CollectionSchema } from '../../../src/collection';
import { MethodologySchema } from '../../../src/methodology';
import { MassIDAuditSchema } from '../../../src/mass-id-audit';
import { CreditPurchaseReceiptIpfsSchema } from '../../../src/credit-purchase-receipt';
import { CreditRetirementReceiptIpfsSchema } from '../../../src/credit-retirement-receipt';

const VALID_SHA256 = 'a'.repeat(64);
const VALID_SCHEMA_URL =
  'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/1.0.0/schemas/ipfs/mass-id/mass-id.schema.json';
const VALID_VERSION = '1.0.0';

/**
 * Replace post-processing placeholders with valid values so that
 * emitter output can be validated against Zod schemas.
 */
function applyPlaceholders(doc: Record<string, unknown>): void {
  doc.$schema = VALID_SCHEMA_URL;

  const schema = doc.schema as Record<string, unknown> | undefined;
  if (schema) {
    schema.hash = VALID_SHA256;
    schema.version = VALID_VERSION;
  }

  if ('audit_data_hash' in doc) {
    doc.audit_data_hash = VALID_SHA256;
  }
  if ('content_hash' in doc) {
    doc.content_hash = VALID_SHA256;
  }
}

describe('reference example story', () => {
  it('uses real Carrot entities in a non-production context', () => {
    const story = buildReferenceStory();

    expect(story.environment.deployment).not.toBe('production');
    expect(story.environment.data_set_name).toBe('TEST');
    expect(story.methodology.name).toContain('BOLD');
    expect(story.collection.slug).toBe('bold-cold-start-carazinho');
    expect(story.credit.symbol).toBe('C-CARB.CH4');
  });

  it('builds catalog examples from the shared story', () => {
    const methodology = emitMethodologyExample();
    const collection = emitCollectionExample();
    const credit = emitCreditExample();

    expect(methodology.data.slug).toBe('bold-carbon-ch4');
    expect(collection.slug).toBe('bold-cold-start-carazinho');
    expect(credit.symbol).toBe('C-CARB.CH4');
  });

  it('links purchase and retirement receipts to the same canonical story', () => {
    const purchase = emitCreditPurchaseReceiptExample();
    const retirement = emitCreditRetirementReceiptExample();

    expect(purchase.data.retirement_receipt.token_id).toBe(
      retirement.blockchain.token_id,
    );
    expect(
      retirement.attributes.some(
        (attribute: { trait_type: string }) =>
          attribute.trait_type === 'Purchase Receipt',
      ),
    ).toBe(true);
  });

  it('keeps asset and audit references aligned', () => {
    const massID = emitMassIDExample();
    const gasID = emitGasIDExample();
    const recycledID = emitRecycledIDExample();
    const audit = emitMassIDAuditExample();

    expect(gasID.data.mass_id.token_id).toBe(massID.blockchain.token_id);
    expect(recycledID.data.mass_id.token_id).toBe(massID.blockchain.token_id);
    expect(audit.data.mass_id.token_id).toBe(massID.blockchain.token_id);
  });
});

describe('emitter output validates against Zod schemas', () => {
  const cases = [
    { name: 'MassID', emitter: emitMassIDExample, schema: MassIDIpfsSchema },
    { name: 'GasID', emitter: emitGasIDExample, schema: GasIDIpfsSchema },
    {
      name: 'RecycledID',
      emitter: emitRecycledIDExample,
      schema: RecycledIDIpfsSchema,
    },
    { name: 'Credit', emitter: emitCreditExample, schema: CreditSchema },
    {
      name: 'Collection',
      emitter: emitCollectionExample,
      schema: CollectionSchema,
    },
    {
      name: 'Methodology',
      emitter: emitMethodologyExample,
      schema: MethodologySchema,
    },
    {
      name: 'MassID Audit',
      emitter: emitMassIDAuditExample,
      schema: MassIDAuditSchema,
    },
    {
      name: 'CreditPurchaseReceipt',
      emitter: emitCreditPurchaseReceiptExample,
      schema: CreditPurchaseReceiptIpfsSchema,
    },
    {
      name: 'CreditRetirementReceipt',
      emitter: emitCreditRetirementReceiptExample,
      schema: CreditRetirementReceiptIpfsSchema,
    },
  ] as const;

  it.each(cases)(
    '$name emitter produces schema-valid output (after placeholder replacement)',
    ({ emitter, schema }) => {
      const result = emitter();
      applyPlaceholders(result);
      const parsed = schema.safeParse(result);

      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
          .join('\n');
        throw new Error(`Schema validation failed:\n${issues}`);
      }

      expect(parsed.success).toBe(true);
    },
  );
});

describe('emitter registry completeness', () => {
  it('has an emitter for every schema type directory under schemas/ipfs/', () => {
    const ipfsRoot = path.resolve(__dirname, '../../../schemas/ipfs');
    const directories = fs
      .readdirSync(ipfsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const missing = directories.filter((dir) => !(dir in emitters));

    expect(missing).toEqual([]);
  });
});

describe('NON_PRODUCTION_MARKER propagation', () => {
  const emitterEntries = Object.entries(emitters).map(([name, emitter]) => ({
    name,
    emitter,
  }));

  it.each(emitterEntries)(
    '$name emitter propagates NON_PRODUCTION_MARKER into environment',
    ({ emitter }) => {
      const result = emitter();
      const env = (result as Record<string, unknown>).environment as
        | Record<string, unknown>
        | undefined;

      expect(env).toBeDefined();
      expect(env?.blockchain_network).toBe(
        NON_PRODUCTION_MARKER.blockchain_network,
      );
      expect(env?.deployment).toBe(NON_PRODUCTION_MARKER.deployment);
      expect(env?.data_set_name).toBe(NON_PRODUCTION_MARKER.data_set_name);
    },
  );
});
