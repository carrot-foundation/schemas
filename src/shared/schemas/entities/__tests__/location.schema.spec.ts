import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { CoordinatesSchema, LocationSchema } from '../location.schema';
import {
  CitySchema,
  IsoCountryCodeSchema,
  Sha256HashSchema,
} from '../../primitives';
import { validateLocationBrazilData } from '../../../data';

describe('CoordinatesSchema', () => {
  it('accepts valid coordinates', () => {
    const result = CoordinatesSchema.safeParse({
      latitude: -0.1,
      longitude: -51.1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing latitude', () => {
    const result = CoordinatesSchema.safeParse({
      longitude: -51.1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing longitude', () => {
    const result = CoordinatesSchema.safeParse({
      latitude: -0.1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid latitude', () => {
    const result = CoordinatesSchema.safeParse({
      latitude: 100,
      longitude: -51.1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid longitude', () => {
    const result = CoordinatesSchema.safeParse({
      latitude: -0.1,
      longitude: 200,
    });
    expect(result.success).toBe(false);
  });

  it('rejects coordinates with wrong precision', () => {
    const result = CoordinatesSchema.safeParse({
      latitude: -0.12,
      longitude: -51.1,
    });
    expect(result.success).toBe(false);
  });
});

describe('LocationSchema', () => {
  const validLocation = {
    id_hash: '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    city: 'Macapá',
    subdivision_code: 'BR-AP',
    country_code: 'BR',
    responsible_participant_id_hash:
      'a1b2c3d4e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcd',
    coordinates: {
      latitude: -0.1,
      longitude: -51.1,
    },
  };

  it('accepts valid location with matching city and subdivision', () => {
    const result = LocationSchema.safeParse(validLocation);
    expect(result.success).toBe(true);
  });

  it('accepts valid location with Cariacica and BR-ES', () => {
    const location = {
      ...validLocation,
      city: 'Cariacica',
      subdivision_code: 'BR-ES',
      coordinates: {
        latitude: -20.5,
        longitude: -40.2,
      },
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(true);
  });

  it('rejects location with invalid city', () => {
    const location = {
      ...validLocation,
      city: 'InvalidCity',
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
    if (!result.success) {
      const cityIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'city',
      );
      expect(cityIssue?.message).toBe('Must be a valid Brazil municipality');
    }
  });

  it('rejects location with mismatched subdivision code', () => {
    const location = {
      ...validLocation,
      city: 'Macapá',
      subdivision_code: 'BR-ES',
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
    if (!result.success) {
      const subdivisionIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'subdivision_code',
      );
      expect(subdivisionIssue?.message).toContain(
        'Must match the subdivision code of the municipality: BR-AP',
      );
    }
  });

  it('rejects location with invalid country code', () => {
    const location = {
      ...validLocation,
      country_code: 'US',
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
  });

  it('rejects location with invalid subdivision code format', () => {
    const location = {
      ...validLocation,
      subdivision_code: 'BR-XX',
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
  });

  it('rejects location with invalid coordinates', () => {
    const location = {
      ...validLocation,
      coordinates: {
        latitude: 100,
        longitude: -51.1,
      },
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
  });

  it('rejects location with missing required fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id_hash, ...locationWithoutId } = validLocation;
    const result = LocationSchema.safeParse(locationWithoutId);
    expect(result.success).toBe(false);
  });

  it('rejects location with invalid id_hash format', () => {
    const location = {
      ...validLocation,
      id_hash: 'invalid-hash',
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
  });

  it('rejects location with invalid responsible_participant_id_hash format', () => {
    const location = {
      ...validLocation,
      responsible_participant_id_hash: 'invalid-hash',
    };
    const result = LocationSchema.safeParse(location);
    expect(result.success).toBe(false);
  });

  it('validates city-subdivision matching for multiple municipalities', () => {
    const location = {
      ...validLocation,
      city: 'Macapá',
      subdivision_code: 'BR-AP',
    };
    expect(LocationSchema.safeParse(location).success).toBe(true);

    const cariacicaLocation = {
      ...validLocation,
      city: 'Cariacica',
      subdivision_code: 'BR-ES',
      coordinates: {
        latitude: -20.5,
        longitude: -40.2,
      },
    };
    expect(LocationSchema.safeParse(cariacicaLocation).success).toBe(true);
  });

  it('rejects location with subdivision code that does not start with BR', () => {
    // Test the defensive check for countryPart !== 'BR'
    // We create a schema identical to LocationSchema but with z.string() for subdivision_code
    // to bypass the base validation and test the superRefine logic
    const testSchema = z
      .object({
        id_hash: Sha256HashSchema,
        city: CitySchema,
        subdivision_code: z.string(),
        country_code: IsoCountryCodeSchema,
        responsible_participant_id_hash: Sha256HashSchema,
        coordinates: CoordinatesSchema,
      })
      .superRefine((record, ctx) => {
        validateLocationBrazilData(record, ctx);
      });

    const location = {
      ...validLocation,
      subdivision_code: 'US-CA',
    };

    const result = testSchema.safeParse(location);
    expect(result.success).toBe(false);
    if (!result.success) {
      const subdivisionIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'subdivision_code',
      );
      expect(subdivisionIssue?.message).toBe('Must start with BR');
    }
  });
});
