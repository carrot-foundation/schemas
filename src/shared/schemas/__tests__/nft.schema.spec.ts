import { describe, it, expect } from 'vitest';
import {
  createNftIpfsFixture,
  expectIssues,
  expectIssuesContain,
  validNftIpfsFixture,
} from '../../../test-utils';
import { NftIpfsSchema } from '../core/nft.schema';
import {
  createMassIDNameSchema,
  createMassIDShortNameSchema,
  createGasIDNameSchema,
  createGasIDShortNameSchema,
  createRecycledIDNameSchema,
  createRecycledIDShortNameSchema,
  createCreditPurchaseReceiptNameSchema,
  createCreditPurchaseReceiptShortNameSchema,
  createCreditRetirementReceiptNameSchema,
  createCreditRetirementReceiptShortNameSchema,
} from '../core/nft-name.schemas';

describe('NftIpfsSchema', () => {
  it('rejects duplicate trait_type in attributes', () => {
    const [firstAttribute] = validNftIpfsFixture.attributes;

    expectIssuesContain(
      NftIpfsSchema,
      () => ({
        ...validNftIpfsFixture,
        attributes: [...validNftIpfsFixture.attributes, { ...firstAttribute }],
      }),
      ['Attribute trait_type values must be unique'],
    );
  });

  it('rejects unsupported blockchain chain_id and network_name combinations', () => {
    expectIssuesContain(
      NftIpfsSchema,
      () =>
        createNftIpfsFixture({
          blockchain: {
            ...validNftIpfsFixture.blockchain,
            chain_id: 137,
            network_name: 'Amoy',
          },
        }),
      [
        'chain_id and network_name must match a supported network: 137/Polygon (mainnet) or 80002/Amoy (testnet)',
      ],
    );
  });

  it('enforces blockchain details to match environment network', () => {
    expectIssues(
      NftIpfsSchema,
      () =>
        createNftIpfsFixture({
          blockchain: {
            ...validNftIpfsFixture.blockchain,
            chain_id: 80002,
            network_name: 'Amoy',
          },
          environment: {
            blockchain_network: 'mainnet',
            deployment: 'production',
            data_set_name: 'PROD',
          },
        }),
      [
        'blockchain.chain_id must be 137 when environment.blockchain_network is mainnet',
        'blockchain.network_name must be Polygon when environment.blockchain_network is mainnet',
      ],
    );
  });

  describe('name format validation', () => {
    it('validates MassID name format', () => {
      const schema = createMassIDNameSchema('123');
      expect(schema.safeParse('MassID #123 • Organic • 3.0t').success).toBe(
        true,
      );
      const result = schema.safeParse('Invalid Name');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Name must match format: "MassID #123 • [waste_type] • [weight]t"',
        );
      }
    });

    it('validates GasID name format', () => {
      const schema = createGasIDNameSchema('456');
      expect(
        schema.safeParse('GasID #456 • BOLD Carbon (CH₄) • 0.86t CO₂e').success,
      ).toBe(true);
      const result = schema.safeParse('Invalid Name');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Name must match format: "GasID #456 • [methodology] • [co2e]t CO₂e"',
        );
      }
    });

    it('validates RecycledID name format', () => {
      const schema = createRecycledIDNameSchema('789');
      expect(
        schema.safeParse('RecycledID #789 • BOLD Recycling • 3.25t Recycled')
          .success,
      ).toBe(true);
      const result = schema.safeParse('Invalid Name');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Name must match format: "RecycledID #789 • [methodology] • [weight]t Recycled"',
        );
      }
    });

    it('validates Credit Purchase Receipt name format', () => {
      const schema = createCreditPurchaseReceiptNameSchema('987');
      expect(
        schema.safeParse('Credit Purchase Receipt #987 • 8.5 Credits Purchased')
          .success,
      ).toBe(true);
      const result = schema.safeParse('Invalid Name');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Name must match format: "Credit Purchase Receipt #987 • [amount] Credits Purchased"',
        );
      }
    });

    it('validates Credit Retirement Receipt name format', () => {
      const schema = createCreditRetirementReceiptNameSchema('1245');
      expect(
        schema.safeParse(
          'Credit Retirement Receipt #1245 • 10.5 Credits Retired',
        ).success,
      ).toBe(true);
      const result = schema.safeParse('Invalid Name');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Name must match format: "Credit Retirement Receipt #1245 • [amount] Credits Retired"',
        );
      }
    });
  });

  describe('short_name format validation', () => {
    it('validates MassID short_name format', () => {
      const schema = createMassIDShortNameSchema('123');
      expect(schema.safeParse('MassID #123').success).toBe(true);
      const result = schema.safeParse('Invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Short name must be exactly "MassID #123"',
        );
      }
    });

    it('validates GasID short_name format', () => {
      const schema = createGasIDShortNameSchema('456');
      expect(schema.safeParse('GasID #456').success).toBe(true);
      const result = schema.safeParse('Invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Short name must be exactly "GasID #456"',
        );
      }
    });

    it('validates RecycledID short_name format', () => {
      const schema = createRecycledIDShortNameSchema('789');
      expect(schema.safeParse('RecycledID #789').success).toBe(true);
      const result = schema.safeParse('Invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Short name must be exactly "RecycledID #789"',
        );
      }
    });

    it('validates Credit Purchase Receipt short_name format', () => {
      const schema = createCreditPurchaseReceiptShortNameSchema('987');
      expect(schema.safeParse('Purchase Receipt #987').success).toBe(true);
      const result = schema.safeParse('Invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Short name must be exactly "Purchase Receipt #987"',
        );
      }
    });

    it('validates Credit Retirement Receipt short_name format', () => {
      const schema = createCreditRetirementReceiptShortNameSchema('1245');
      expect(schema.safeParse('Retirement Receipt #1245').success).toBe(true);
      const result = schema.safeParse('Invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Short name must be exactly "Retirement Receipt #1245"',
        );
      }
    });
  });
});
