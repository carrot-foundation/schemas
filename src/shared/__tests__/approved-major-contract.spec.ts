import { describe, expect, it } from 'vitest';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

import { CollectionSchema } from '../../collection';
import { CreditPurchaseReceiptIpfsSchema } from '../../credit-purchase-receipt';
import { CreditRetirementReceiptIpfsSchema } from '../../credit-retirement-receipt';
import { CreditSchema } from '../../credit';
import { GasIDIpfsSchema } from '../../gas-id';
import { MassIDAuditSchema } from '../../mass-id-audit';
import { MassIDIpfsSchema } from '../../mass-id';
import { MethodologySchema } from '../../methodology';
import { RecycledIDIpfsSchema } from '../../recycled-id';

import collectionExample from '../../../schemas/ipfs/collection/collection.example.json';
import creditExample from '../../../schemas/ipfs/credit/credit.example.json';
import purchaseExample from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';
import retirementExample from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';
import gasExample from '../../../schemas/ipfs/gas-id/gas-id.example.json';
import auditExample from '../../../schemas/ipfs/mass-id-audit/mass-id-audit.example.json';
import massExample from '../../../schemas/ipfs/mass-id/mass-id.example.json';
import methodologyExample from '../../../schemas/ipfs/methodology/methodology.example.json';
import recycledExample from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';

import creditJsonSchema from '../../../schemas/ipfs/credit/credit.schema.json';
import gasJsonSchema from '../../../schemas/ipfs/gas-id/gas-id.schema.json';
import { hashObject } from '../hash';
import {
  verifiedRevisionFixture,
  unavailableRevisionFixture,
} from '../../test-utils/fixtures';

describe('approved major metadata contract', () => {
  it.each([
    ['MassID', MassIDIpfsSchema, massExample],
    ['GasID', GasIDIpfsSchema, gasExample],
    ['RecycledID', RecycledIDIpfsSchema, recycledExample],
    ['Credit', CreditSchema, creditExample],
    ['Collection', CollectionSchema, collectionExample],
    ['Purchase receipt', CreditPurchaseReceiptIpfsSchema, purchaseExample],
    [
      'Retirement receipt',
      CreditRetirementReceiptIpfsSchema,
      retirementExample,
    ],
    ['MassID Audit', MassIDAuditSchema, auditExample],
    ['Methodology', MethodologySchema, methodologyExample],
  ] as const)(
    'validates complete %s example with Zod',
    (_name, schema, example) => {
      expect(schema.safeParse(example).success).toBe(true);
    },
  );

  it.each([
    ['MassID', MassIDIpfsSchema, massExample],
    ['GasID', GasIDIpfsSchema, gasExample],
    ['RecycledID', RecycledIDIpfsSchema, recycledExample],
    ['Credit', CreditSchema, creditExample],
    ['Collection', CollectionSchema, collectionExample],
    ['Purchase receipt', CreditPurchaseReceiptIpfsSchema, purchaseExample],
    [
      'Retirement receipt',
      CreditRetirementReceiptIpfsSchema,
      retirementExample,
    ],
    ['MassID Audit', MassIDAuditSchema, auditExample],
    ['Methodology', MethodologySchema, methodologyExample],
  ] as const)(
    'preserves initial publication and accepts both revision states for %s',
    (_name, schema, example) => {
      expect(schema.safeParse(example).success).toBe(true);
      for (const revision of [
        verifiedRevisionFixture,
        unavailableRevisionFixture,
      ]) {
        const input = { ...structuredClone(example), revision };
        const result = schema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(input);
      }
    },
  );

  it('requires the ERC-1046 marker and on-chain identity in Credit', () => {
    const missingInterop = structuredClone(creditExample);
    Reflect.deleteProperty(missingInterop, 'interop');
    expect(CreditSchema.safeParse(missingInterop).success).toBe(false);

    const wrongInterop = structuredClone(creditExample);
    wrongInterop.interop.erc1046 = false;
    expect(CreditSchema.safeParse(wrongInterop).success).toBe(false);

    const extraInterop = structuredClone(creditExample);
    Object.assign(extraInterop.interop, { erc721: true });
    expect(CreditSchema.safeParse(extraInterop).success).toBe(false);

    const missingContract = structuredClone(creditExample);
    Reflect.deleteProperty(
      missingContract.blockchain,
      'smart_contract_address',
    );
    expect(CreditSchema.safeParse(missingContract).success).toBe(false);

    const paddedName = structuredClone(creditExample);
    paddedName.name = ` ${paddedName.name} `;
    expect(CreditSchema.safeParse(paddedName).success).toBe(false);

    const trailingNewline = structuredClone(creditExample);
    trailingNewline.name = `${trailingNewline.name}\n`;
    expect(CreditSchema.safeParse(trailingNewline).success).toBe(false);
  });

  it('requires paired credit identity and network in both certificate families', () => {
    for (const [schema, example] of [
      [GasIDIpfsSchema, gasExample],
      [RecycledIDIpfsSchema, recycledExample],
    ] as const) {
      const missingCredit = structuredClone(example);
      Reflect.deleteProperty(missingCredit.data, 'credit');
      expect(schema.safeParse(missingCredit).success).toBe(false);

      const mismatchedPair = structuredClone(example);
      mismatchedPair.data.credit.symbol =
        mismatchedPair.data.credit.symbol === 'C-BIOW'
          ? 'C-CARB.CH4'
          : 'C-BIOW';
      expect(schema.safeParse(mismatchedPair).success).toBe(false);

      const wrongChain = structuredClone(example);
      wrongChain.data.credit.chain_id = 137;
      expect(schema.safeParse(wrongChain).success).toBe(false);
    }
  });

  it('requires a sourced unit for each reported GasID calculation value', () => {
    const missingUnit = structuredClone(gasExample);
    Reflect.deleteProperty(
      missingUnit.data.prevented_emissions_calculation.values[0],
      'unit',
    );
    expect(GasIDIpfsSchema.safeParse(missingUnit).success).toBe(false);
    expect(gasExample.data.prevented_emissions_calculation.values).toEqual([
      {
        reference: 'R',
        value: 123.519,
        unit: 'kg CO₂e',
        label: 'Prevented Emissions (CO₂e kg)',
      },
    ]);
  });

  it('requires MassID recycling method to match its NFT trait', () => {
    const missing = structuredClone(massExample);
    Reflect.deleteProperty(missing.data, 'recycling_method');
    expect(MassIDIpfsSchema.safeParse(missing).success).toBe(false);

    const mismatch = structuredClone(massExample);
    mismatch.data.recycling_method = 'Example alternative method';
    expect(MassIDIpfsSchema.safeParse(mismatch).success).toBe(false);
  });

  it('keeps reserved retirement references conditional and free of a CID', () => {
    const purchase = CreditPurchaseReceiptIpfsSchema.parse(purchaseExample);
    expect(Object.keys(purchase.data.retirement_receipt ?? {}).sort()).toEqual([
      'chain_id',
      'smart_contract_address',
      'token_id',
    ]);

    const reserved = structuredClone(purchase);
    reserved.data.collections = [];
    reserved.data.certificates.forEach((certificate) => {
      certificate.collections = [];
    });
    reserved.attributes = reserved.attributes.filter(
      (attribute) => attribute.trait_type !== 'Retirement Date',
    );
    expect(CreditPurchaseReceiptIpfsSchema.safeParse(reserved).success).toBe(
      true,
    );

    const reservedWithZeroRetired = structuredClone(purchase);
    reservedWithZeroRetired.data.certificates.forEach((certificate) => {
      certificate.collections.forEach((collection) => {
        collection.retired_amount = 0;
      });
    });
    expect(
      CreditPurchaseReceiptIpfsSchema.safeParse(reservedWithZeroRetired)
        .success,
    ).toBe(false);
    reservedWithZeroRetired.attributes =
      reservedWithZeroRetired.attributes.filter(
        (attribute) => attribute.trait_type !== 'Retirement Date',
      );
    expect(
      CreditPurchaseReceiptIpfsSchema.safeParse(reservedWithZeroRetired)
        .success,
    ).toBe(true);

    const noRetirement = structuredClone(reservedWithZeroRetired);
    Reflect.deleteProperty(noRetirement.data, 'retirement_receipt');
    noRetirement.attributes = noRetirement.attributes.filter(
      (attribute) =>
        attribute.trait_type !== 'Retirement Receipt' &&
        attribute.trait_type !== 'Retirement Date',
    );
    expect(
      CreditPurchaseReceiptIpfsSchema.safeParse(noRetirement).success,
    ).toBe(true);

    const missing = structuredClone(purchase);
    Reflect.deleteProperty(missing.data, 'retirement_receipt');
    expect(CreditPurchaseReceiptIpfsSchema.safeParse(missing).success).toBe(
      false,
    );

    const historical = structuredClone(retirementExample);
    expect(historical.data.purchase_receipt?.ipfs_uri).toMatch(/^ipfs:\/\//);
    if (historical.data.purchase_receipt) {
      Reflect.deleteProperty(historical.data.purchase_receipt, 'ipfs_uri');
    }
    expect(
      CreditRetirementReceiptIpfsSchema.safeParse(historical).success,
    ).toBe(false);

    const independent = structuredClone(retirementExample);
    Reflect.deleteProperty(independent.data, 'purchase_receipt');
    independent.attributes = independent.attributes.filter(
      (attribute) =>
        attribute.trait_type !== 'Purchase Date' &&
        attribute.trait_type !== 'Purchase Receipt',
    );
    expect(
      CreditRetirementReceiptIpfsSchema.safeParse(independent).success,
    ).toBe(true);
  });

  it('distinguishes collection JSON from its image in receipt examples', () => {
    expect(purchaseExample.data.collections[0].external_id).toBe(
      collectionExample.external_id,
    );
    expect(purchaseExample.data.collections[0].ipfs_uri).not.toBe(
      collectionExample.image,
    );
    expect(retirementExample.data.collections[0].ipfs_uri).toBe(
      purchaseExample.data.collections[0].ipfs_uri,
    );
  });

  it('requires Methodology image and keeps illustrative dates distinct', () => {
    const missingImage = structuredClone(methodologyExample);
    Reflect.deleteProperty(missingImage, 'image');
    expect(MethodologySchema.safeParse(missingImage).success).toBe(false);
    expect(methodologyExample.data.publication_date).not.toBe(
      methodologyExample.data.revision_date,
    );
    expect(methodologyExample.data.description).toContain('fictional');
  });

  it('enforces structural fields in generated JSON Schema too', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validateCredit = ajv.compile(creditJsonSchema);
    const validateGas = ajv.compile(gasJsonSchema);
    expect(validateCredit(creditExample)).toBe(true);
    expect(validateGas(gasExample)).toBe(true);

    const missingInterop = structuredClone(creditExample);
    Reflect.deleteProperty(missingInterop, 'interop');
    expect(validateCredit(missingInterop)).toBe(false);

    const missingUnit = structuredClone(gasExample);
    Reflect.deleteProperty(
      missingUnit.data.prevented_emissions_calculation.values[0],
      'unit',
    );
    expect(validateGas(missingUnit)).toBe(false);

    const wrongPair = structuredClone(creditExample);
    Object.assign(wrongPair, { symbol: 'C-BIOW' });
    expect(CreditSchema.safeParse(wrongPair).success).toBe(false);
    expect(validateCredit(wrongPair)).toBe(false);

    const wrongCreditNetwork = structuredClone(creditExample);
    Object.assign(wrongCreditNetwork.blockchain, { chain_id: 137 });
    expect(CreditSchema.safeParse(wrongCreditNetwork).success).toBe(false);
    expect(validateCredit(wrongCreditNetwork)).toBe(false);

    const noCreditEnvironment = structuredClone(creditExample);
    Reflect.deleteProperty(noCreditEnvironment, 'environment');
    expect(CreditSchema.safeParse(noCreditEnvironment).success).toBe(true);
    expect(validateCredit(noCreditEnvironment)).toBe(true);

    const biowasteCredit = structuredClone(creditExample);
    Object.assign(biowasteCredit, {
      slug: 'biowaste',
      symbol: 'C-BIOW',
    });
    expect(CreditSchema.safeParse(biowasteCredit).success).toBe(true);
    expect(validateCredit(biowasteCredit)).toBe(true);

    const wrongNftNetwork = structuredClone(gasExample);
    Object.assign(wrongNftNetwork.blockchain, { chain_id: 1 });
    expect(GasIDIpfsSchema.safeParse(wrongNftNetwork).success).toBe(false);
    expect(validateGas(wrongNftNetwork)).toBe(false);

    const wrongNftEnvironment = structuredClone(gasExample);
    Object.assign(wrongNftEnvironment.environment, {
      blockchain_network: 'mainnet',
    });
    expect(GasIDIpfsSchema.safeParse(wrongNftEnvironment).success).toBe(false);
    expect(validateGas(wrongNftEnvironment)).toBe(false);

    const polygonNft = structuredClone(gasExample);
    Object.assign(polygonNft.blockchain, {
      chain_id: 137,
      network_name: 'Polygon',
    });
    Object.assign(polygonNft.environment, { blockchain_network: 'mainnet' });
    Object.assign(polygonNft.data.credit, { chain_id: 137 });
    Object.assign(polygonNft.data.mass_id, { chain_id: 137 });
    expect(GasIDIpfsSchema.safeParse(polygonNft).success).toBe(true);
    expect(validateGas(polygonNft)).toBe(true);
  });

  it('hashes audit data independently from the complete metadata record', () => {
    for (const document of [
      massExample,
      gasExample,
      recycledExample,
      purchaseExample,
      retirementExample,
    ]) {
      const wholeRecord = structuredClone(document);
      Reflect.deleteProperty(wholeRecord, 'audit_data_hash');
      expect(document.audit_data_hash).toBe(hashObject(document.data));
      expect(document.audit_data_hash).not.toBe(hashObject(wholeRecord));
    }
  });

  it.each([
    ['purchase', CreditPurchaseReceiptIpfsSchema, purchaseExample],
    ['retirement', CreditRetirementReceiptIpfsSchema, retirementExample],
  ] as const)(
    'rejects nested MassID chain mismatches in every %s receipt certificate',
    (_family, schema, example) => {
      expect(schema.safeParse(example).success).toBe(true);

      for (const index of [0, 1, 2]) {
        const document = structuredClone(example);
        document.data.certificates[index].mass_id.chain_id = 137;
        const result = schema.safeParse(document);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toContainEqual(
            expect.objectContaining({
              path: ['data', 'certificates', index, 'mass_id', 'chain_id'],
            }),
          );
        }
      }
    },
  );

  it('rejects mismatched chain identities at every certificate and receipt reference', () => {
    for (const [schema, example] of [
      [GasIDIpfsSchema, gasExample],
      [RecycledIDIpfsSchema, recycledExample],
    ] as const) {
      const document = structuredClone(example);
      Object.assign(document.data.mass_id, { chain_id: 137 });
      expect(schema.safeParse(document).success).toBe(false);
    }

    for (const field of [
      'retirement_receipt',
      'credits',
      'certificates',
    ] as const) {
      const document = structuredClone(purchaseExample);
      if (field === 'retirement_receipt') {
        Object.assign(document.data.retirement_receipt, { chain_id: 137 });
      } else {
        Object.assign(document.data[field][0], { chain_id: 137 });
      }
      expect(CreditPurchaseReceiptIpfsSchema.safeParse(document).success).toBe(
        false,
      );
    }

    for (const field of [
      'purchase_receipt',
      'credits',
      'certificates',
    ] as const) {
      const document = structuredClone(retirementExample);
      if (field === 'purchase_receipt') {
        Object.assign(document.data.purchase_receipt, { chain_id: 137 });
      } else {
        Object.assign(document.data[field][0], { chain_id: 137 });
      }
      expect(
        CreditRetirementReceiptIpfsSchema.safeParse(document).success,
      ).toBe(false);
    }

    for (const field of ['gas_id', 'recycled_id'] as const) {
      const document = structuredClone(auditExample);
      Object.assign(document.data, {
        [field]: {
          ...document.data.mass_id,
          token_id: '200001',
          chain_id: 137,
        },
      });
      expect(MassIDAuditSchema.safeParse(document).success).toBe(false);
    }
  });
});
