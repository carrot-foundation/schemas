import { describe, expect, it } from 'vitest';
import {
  buildReferenceStory,
  emitCollectionExample,
  emitCreditExample,
  emitGasIdExample,
  emitMassIdAuditExample,
  emitMassIdExample,
  emitMethodologyExample,
  emitRecycledIdExample,
} from '../index.js';

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

  it('keeps asset and audit references aligned', () => {
    const massId = emitMassIdExample();
    const gasId = emitGasIdExample();
    const recycledId = emitRecycledIdExample();
    const audit = emitMassIdAuditExample();

    expect(gasId.data.mass_id.token_id).toBe(massId.blockchain.token_id);
    expect(recycledId.data.mass_id.token_id).toBe(massId.blockchain.token_id);
    expect(audit.data.mass_id.token_id).toBe(massId.blockchain.token_id);
  });
});
