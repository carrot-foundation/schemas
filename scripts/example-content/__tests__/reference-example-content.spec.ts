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
import { exampleIpfsUri } from '../shared.js';
import { MassIDIpfsSchema } from '../../../src/mass-id';
import { GasIDIpfsSchema } from '../../../src/gas-id';
import { RecycledIDIpfsSchema } from '../../../src/recycled-id';
import { CreditSchema } from '../../../src/credit';
import { CollectionSchema } from '../../../src/collection';
import { MethodologySchema } from '../../../src/methodology';
import { MassIDAuditSchema } from '../../../src/mass-id-audit';
import { CreditPurchaseReceiptIpfsSchema } from '../../../src/credit-purchase-receipt';
import { CreditRetirementReceiptIpfsSchema } from '../../../src/credit-retirement-receipt';

function getField(obj: Record<string, unknown>, ...keys: string[]): unknown {
  return keys.reduce(
    (acc, key) => (acc as Record<string, unknown>)[key],
    obj as unknown,
  );
}

function externalLinkUrls(document: Record<string, unknown>): string[] {
  if (!Array.isArray(document.external_links)) {
    throw new Error('Expected external_links array');
  }
  return document.external_links.map((link: unknown) => {
    if (
      typeof link !== 'object' ||
      link === null ||
      !('url' in link) ||
      typeof link.url !== 'string'
    ) {
      throw new Error('Expected external link URL');
    }
    return link.url;
  });
}

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
  it('uses approved domain values with fictional identifiers in a non-production context', () => {
    const story = buildReferenceStory();

    expect(story.environment.deployment).not.toBe('production');
    expect(story.environment.data_set_name).toBe('TEST');
    expect(story.methodology.name).toContain('BOLD');
    expect(story.collection.slug).toBe('example-collection-one');
    expect(story.credit.symbol).toBe('C-CARB.CH4');
  });

  it('builds catalog examples from the shared story', () => {
    const methodology = emitMethodologyExample();
    const collection = emitCollectionExample();
    const credit = emitCreditExample();

    expect(getField(methodology, 'data', 'slug')).toBe('bold-carbon-ch4');
    expect(collection.slug).toBe('example-collection-one');
    expect(credit.symbol).toBe('C-CARB.CH4');
  });

  it('links purchase and retirement receipts to the same canonical story', () => {
    const purchase = emitCreditPurchaseReceiptExample();
    const retirement = emitCreditRetirementReceiptExample();

    expect(getField(purchase, 'data', 'retirement_receipt', 'token_id')).toBe(
      getField(retirement, 'blockchain', 'token_id'),
    );
    expect(
      (retirement.attributes as Array<{ trait_type: string }>).some(
        (attribute) => attribute.trait_type === 'Purchase Receipt',
      ),
    ).toBe(true);
  });

  it('keeps asset and audit references aligned', () => {
    const massID = emitMassIDExample();
    const gasID = emitGasIDExample();
    const recycledID = emitRecycledIDExample();
    const audit = emitMassIDAuditExample();

    const massIDTokenId = getField(massID, 'blockchain', 'token_id');
    expect(getField(gasID, 'data', 'mass_id', 'token_id')).toBe(massIDTokenId);
    expect(getField(recycledID, 'data', 'mass_id', 'token_id')).toBe(
      massIDTokenId,
    );
    expect(getField(audit, 'data', 'mass_id', 'token_id')).toBe(massIDTokenId);
    expect(getField(audit, 'data', 'gas_id')).toBeUndefined();
    expect(getField(gasID, 'data', 'audit', 'ipfs_uri')).toBe(
      exampleIpfsUri('doc:audit-carbon'),
    );
    expect(getField(gasID, 'data', 'methodology', 'ipfs_uri')).toBe(
      exampleIpfsUri('doc:methodology-carbon'),
    );
    expect(getField(gasID, 'data', 'mass_id', 'ipfs_uri')).toBe(
      exampleIpfsUri('doc:mass-id'),
    );
    expect(getField(recycledID, 'data', 'methodology', 'ipfs_uri')).not.toBe(
      getField(gasID, 'data', 'methodology', 'ipfs_uri'),
    );
    expect(getField(recycledID, 'data', 'audit', 'ipfs_uri')).not.toBe(
      getField(gasID, 'data', 'audit', 'ipfs_uri'),
    );

    const auditCompletedAt = getField(
      audit,
      'data',
      'audit_summary',
      'completed_at',
    );
    expect(getField(gasID, 'data', 'audit', 'completed_at')).toBe(
      auditCompletedAt,
    );
    expect(Date.parse(String(auditCompletedAt))).toBeLessThan(
      Date.parse(String(getField(gasID, 'data', 'summary', 'issued_at'))),
    );
    const methodology = emitMethodologyExample();
    expect(Date.parse(String(methodology.created_at))).toBeLessThan(
      Date.parse(
        String(getField(audit, 'data', 'audit_summary', 'started_at')),
      ),
    );
  });

  it('uses distinct Registry records instead of white paper example links', () => {
    const massID = emitMassIDExample();
    const gasID = emitGasIDExample();
    const recycledID = emitRecycledIDExample();
    const linkedRecords = [massID, gasID, recycledID];

    for (const record of linkedRecords) {
      const urls = externalLinkUrls(record);
      expect(new Set(urls).size).toBe(urls.length);
      expect(
        urls.every((url) => url.startsWith('https://registry.example.com/')),
      ).toBe(true);
      expect(urls[0]).toBe(record.external_url);
    }

    expect(externalLinkUrls(massID)).toHaveLength(1);
    expect(externalLinkUrls(gasID)[1]).toBe(
      emitMethodologyExample().external_url,
    );
    expect(externalLinkUrls(recycledID)[1]).toBe(massID.external_url);
  });

  it('assigns distinct example CIDs by asset role and schema family', () => {
    const documents = Object.values(emitters).map((emit) => emit());
    const schemaUris = documents.map((document) =>
      getField(document, 'schema', 'ipfs_uri'),
    );
    expect(new Set(schemaUris).size).toBe(documents.length);

    const methodology = emitMethodologyExample();
    expect(methodology.image).not.toBe(
      getField(methodology, 'data', 'methodology_pdf'),
    );
    expect(methodology.image).not.toBe(
      getField(methodology, 'schema', 'ipfs_uri'),
    );

    const collection = emitCollectionExample();
    const purchase = emitCreditPurchaseReceiptExample();
    const retirement = emitCreditRetirementReceiptExample();
    expect(getField(purchase, 'data', 'collections', '0', 'ipfs_uri')).toBe(
      exampleIpfsUri('doc:collection-one'),
    );
    expect(getField(purchase, 'data', 'collections', '0', 'ipfs_uri')).not.toBe(
      collection.image,
    );
    expect(getField(retirement, 'data', 'purchase_receipt', 'ipfs_uri')).toBe(
      exampleIpfsUri('doc:purchase-receipt'),
    );
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
