import { describe, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
  expectSchemaInvalid,
  expectSchemaValid,
} from '../../test-utils';
import { MassIDDataSchema } from '../mass-id.data.schema';
import exampleJson from '../../../schemas/ipfs/mass-id/mass-id.example.json';

describe('MassIDDataSchema', () => {
  const schema = MassIDDataSchema;
  const base = exampleJson.data as z.input<typeof schema>;

  it('validates example data successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects events referencing unknown participants', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.events[0].participant_id_hash =
        '2222222222222222222222222222222222222222222222222222222222222222';
      return next;
    }, [
      'All participant ID hashes in events must exist in participants array',
    ]);
  });

  it('rejects events referencing unknown locations', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.events[0].location_id_hash =
        '3333333333333333333333333333333333333333333333333333333333333333';
      return next;
    }, ['All location ID hashes in events must exist in locations array']);
  });

  it('rejects attachments referencing unknown events', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.attachments = next.attachments?.map((attachment) => ({
        ...attachment,
        event_id: '00000000-0000-0000-0000-000000000000',
      }));
      return next;
    }, ['All attachments must reference an existing event by event_id']);
  });

  it('allows data without attachments', () => {
    expectSchemaValid(schema, () => {
      const next = structuredClone(base);
      Reflect.deleteProperty(next as Record<string, unknown>, 'attachments');
      return next;
    });
  });

  it('rejects locations with unknown responsible participants', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.locations[0].responsible_participant_id_hash =
        '1111111111111111111111111111111111111111111111111111111111111111';
      return next;
    }, [
      'All responsible participant ID hashes in locations must exist in participants array',
    ]);
  });

  it('rejects events that are not ordered by timestamp', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const nextTimestamp = '1900-01-01T00:00:00.000Z';
      invalid.events[1].timestamp = nextTimestamp;
      invalid.events[2].timestamp = nextTimestamp;
    });
  });
});
