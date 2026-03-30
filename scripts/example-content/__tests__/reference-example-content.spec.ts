import { describe, expect, it } from 'vitest';
import { buildReferenceStory } from '../index.js';

describe('reference example story', () => {
  it('uses real Carrot entities in a non-production context', () => {
    const story = buildReferenceStory();

    expect(story.environment.deployment).not.toBe('production');
    expect(story.environment.data_set_name).toBe('TEST');
    expect(story.methodology.name).toContain('BOLD');
    expect(story.collection.slug).toBe('bold-cold-start-carazinho');
    expect(story.credit.symbol).toBe('C-CARB.CH4');
  });
});
