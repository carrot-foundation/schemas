import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { MassIDIpfsSchema } from '../mass-id.schema';
import exampleJson from '../../../schemas/ipfs/mass-id/mass-id.example.json';

describe('MassIDIpfsSchema', () => {
  const schema = MassIDIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid data', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      (invalid as typeof base & { tokenId?: string }).tokenId = 'invalid';
    });
  });

  it('rejects missing required fields', () => {
    expectSchemaInvalidWithout(schema, base, 'schema');
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('MassID');
        expect(data.blockchain.token_id).toBe('1034');
      },
    );
  });

  it('rejects duplicate trait_type in attributes', () => {
    expectIssuesContain(schema, () => {
      const attributes = base.attributes.slice(0, -1);
      attributes.push(structuredClone(attributes[0]));

      return {
        ...base,
        attributes,
      };
    }, ['Items must be unique']);
  });

  it('rejects duplicate URLs in external_links', () => {
    expectIssuesContain(schema, () => {
      const externalLinks = base.external_links ?? [];
      return {
        ...base,
        external_links: [
          ...externalLinks,
          {
            label: 'Duplicate Link',
            url: externalLinks[0]?.url ?? 'ipfs://duplicate',
            description: 'This has a duplicate URL',
          },
        ],
      };
    }, ['External link URLs must be unique']);
  });

  it('requires attributes to mirror waste properties', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      const wasteSubtypeAttrIndex = next.attributes.findIndex(
        (attr) => attr.trait_type === 'Waste Subtype',
      );
      if (wasteSubtypeAttrIndex >= 0) {
        next.attributes[wasteSubtypeAttrIndex].value = 'Domestic Sludge';
      }
      return next;
    }, ['Waste Subtype attribute must equal waste_properties.subtype']);
  });

  it('requires pick-up date attribute to match pick-up event', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      const pickUpDateIndex = next.attributes.findIndex(
        (attr) => attr.trait_type === 'Pick-up Date',
      );

      if (pickUpDateIndex >= 0) {
        next.attributes[pickUpDateIndex].value = 0;
      }

      return next;
    }, ['Pick-up Date attribute must equal Pick-up event timestamp']);
  });

  it('requires local waste classification attribute to be omitted when missing data', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      Reflect.deleteProperty(
        next.data.waste_properties as Record<string, unknown>,
        'local_classification',
      );
      return next;
    }, [
      'Local Waste Classification ID attribute must be omitted when waste_properties.local_classification.code is not provided',
    ]);
  });

  it('allows omitting optional attributes when source data is absent', () => {
    expectSchemaValid(schema, () => {
      const next = structuredClone(base);
      Reflect.deleteProperty(
        next.data.waste_properties as Record<string, unknown>,
        'local_classification',
      );
      next.attributes = next.attributes.filter(
        (attribute) => attribute.trait_type !== 'Local Waste Classification ID',
      );
      return next;
    });
  });

  it('requires pick-up date attribute to be omitted when timestamp is absent', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.data.events = next.data.events.filter(
        (event) => event.event_name !== 'Pick-up',
      );

      return next;
    }, [
      'Pick-up Date attribute must be omitted when Pick-up event timestamp is not provided',
    ]);
  });

  it('adds issue when timestamp parsing fails', () => {
    const originalParse = Date.parse;
    Date.parse = () => Number.NaN;

    try {
      expectIssuesContain(schema, () => structuredClone(base), [
        'Pick-up event timestamp must be a valid ISO 8601 date-time string',
      ]);
    } finally {
      Date.parse = originalParse;
    }
  });

  it('requires manifest attributes when attachments exist', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.attributes = next.attributes.filter(
        (attribute) =>
          attribute.trait_type !== 'Transport Manifest Number' &&
          attribute.trait_type !== 'Recycling Manifest Number',
      );
      return next;
    }, [
      'Transport Manifest Number attribute must be present and match Transport Manifest attachment document_number',
      'Recycling Manifest Number attribute must be present and match Recycling Manifest attachment document_number',
    ]);
  });

  it('requires Recycling Manifest Number attribute to be omitted when document_number is missing', () => {
    expectSchemaValid(schema, () => {
      const next = structuredClone(base);
      const recyclingManifest = next.data.attachments?.find(
        (attachment) => attachment.type === 'Recycling Manifest',
      );
      if (recyclingManifest) {
        Reflect.deleteProperty(
          recyclingManifest as Record<string, unknown>,
          'document_number',
        );
      }
      next.attributes = next.attributes.filter(
        (attribute) => attribute.trait_type !== 'Recycling Manifest Number',
      );
      return next;
    });
  });

  it('requires Transport Manifest Number attribute to be omitted when document_number is missing', () => {
    expectSchemaValid(schema, () => {
      const next = structuredClone(base);
      const transportManifest = next.data.attachments?.find(
        (attachment) => attachment.type === 'Transport Manifest',
      );
      if (transportManifest) {
        Reflect.deleteProperty(
          transportManifest as Record<string, unknown>,
          'document_number',
        );
      }
      next.attributes = next.attributes.filter(
        (attribute) => attribute.trait_type !== 'Transport Manifest Number',
      );
      return next;
    });
  });

  it('rejects name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'MassID #999 • Incorrect token id';
      return next;
    }, ['Name token_id must match blockchain.token_id: 1034']);
  });

  it('rejects short_name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'MassID #999';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 1034']);
  });
});
