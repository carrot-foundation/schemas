import { describe, expect, it } from 'vitest';
import {
  CitySchema,
  IsoCountryCodeSchema,
  IsoCountrySubdivisionCodeSchema,
  LatitudeSchema,
  LongitudeSchema,
} from '../geo.schema';
import { BRAZIL_SUBDIVISION_CODES } from '../../../data';

describe('IsoCountryCodeSchema', () => {
  it('accepts valid Brazil country code', () => {
    expect(IsoCountryCodeSchema.safeParse('BR').success).toBe(true);
  });

  it('rejects invalid country code format', () => {
    expect(IsoCountryCodeSchema.safeParse('BRA').success).toBe(false);
    expect(IsoCountryCodeSchema.safeParse('br').success).toBe(false);
    expect(IsoCountryCodeSchema.safeParse('US').success).toBe(false);
    expect(IsoCountryCodeSchema.safeParse('12').success).toBe(false);
  });

  it('rejects non-Brazil country codes', () => {
    const result = IsoCountryCodeSchema.safeParse('US');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Must be Brazil (BR)');
    }
  });
});

describe('IsoCountrySubdivisionCodeSchema', () => {
  it.each(BRAZIL_SUBDIVISION_CODES)(
    'accepts valid Brazil subdivision code: %s',
    (code) => {
      expect(IsoCountrySubdivisionCodeSchema.safeParse(code).success).toBe(
        true,
      );
    },
  );

  it('rejects invalid subdivision code format', () => {
    expect(IsoCountrySubdivisionCodeSchema.safeParse('BR').success).toBe(false);
    expect(IsoCountrySubdivisionCodeSchema.safeParse('BR-').success).toBe(
      false,
    );
    expect(IsoCountrySubdivisionCodeSchema.safeParse('BR-ABCD').success).toBe(
      false,
    );
    expect(IsoCountrySubdivisionCodeSchema.safeParse('US-CA').success).toBe(
      false,
    );
  });

  it('rejects non-Brazil subdivision codes', () => {
    const result = IsoCountrySubdivisionCodeSchema.safeParse('US-CA');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Must be a valid Brazil subdivision code',
      );
    }
  });

  it('rejects invalid Brazil subdivision codes', () => {
    const result = IsoCountrySubdivisionCodeSchema.safeParse('BR-XX');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Must be a valid Brazil subdivision code',
      );
    }
  });
});

describe('CitySchema', () => {
  it('accepts valid Brazil municipality names', () => {
    expect(CitySchema.safeParse('Macapá').success).toBe(true);
    expect(CitySchema.safeParse('Cariacica').success).toBe(true);
    expect(CitySchema.safeParse('Brasília').success).toBe(true);
    expect(CitySchema.safeParse('São Paulo').success).toBe(true);
  });

  it('rejects empty string', () => {
    expect(CitySchema.safeParse('').success).toBe(false);
  });

  it('rejects strings longer than 50 characters', () => {
    const longCity = 'A'.repeat(51);
    expect(CitySchema.safeParse(longCity).success).toBe(false);
  });

  it('rejects non-Brazil municipality names', () => {
    const result = CitySchema.safeParse('New York');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Must be a valid Brazil municipality',
      );
    }
  });

  it('rejects invalid city names', () => {
    const result = CitySchema.safeParse('InvalidCity');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Must be a valid Brazil municipality',
      );
    }
  });
});

describe('LatitudeSchema', () => {
  it('accepts valid latitudes', () => {
    expect(LatitudeSchema.safeParse(-90).success).toBe(true);
    expect(LatitudeSchema.safeParse(0).success).toBe(true);
    expect(LatitudeSchema.safeParse(90).success).toBe(true);
    expect(LatitudeSchema.safeParse(-0.1).success).toBe(true);
    expect(LatitudeSchema.safeParse(20.3).success).toBe(true);
  });

  it('rejects latitudes below -90', () => {
    expect(LatitudeSchema.safeParse(-90.1).success).toBe(false);
    expect(LatitudeSchema.safeParse(-100).success).toBe(false);
  });

  it('rejects latitudes above 90', () => {
    expect(LatitudeSchema.safeParse(90.1).success).toBe(false);
    expect(LatitudeSchema.safeParse(100).success).toBe(false);
  });

  it('rejects latitudes with more than 1 decimal place', () => {
    expect(LatitudeSchema.safeParse(20.12).success).toBe(false);
    expect(LatitudeSchema.safeParse(-0.123).success).toBe(false);
  });

  it('accepts latitudes with exactly 1 decimal place', () => {
    expect(LatitudeSchema.safeParse(20.1).success).toBe(true);
    expect(LatitudeSchema.safeParse(-0.1).success).toBe(true);
  });
});

describe('LongitudeSchema', () => {
  it('accepts valid longitudes', () => {
    expect(LongitudeSchema.safeParse(-180).success).toBe(true);
    expect(LongitudeSchema.safeParse(0).success).toBe(true);
    expect(LongitudeSchema.safeParse(180).success).toBe(true);
    expect(LongitudeSchema.safeParse(-51.1).success).toBe(true);
    expect(LongitudeSchema.safeParse(-40.3).success).toBe(true);
  });

  it('rejects longitudes below -180', () => {
    expect(LongitudeSchema.safeParse(-180.1).success).toBe(false);
    expect(LongitudeSchema.safeParse(-200).success).toBe(false);
  });

  it('rejects longitudes above 180', () => {
    expect(LongitudeSchema.safeParse(180.1).success).toBe(false);
    expect(LongitudeSchema.safeParse(200).success).toBe(false);
  });

  it('rejects longitudes with more than 1 decimal place', () => {
    expect(LongitudeSchema.safeParse(-51.12).success).toBe(false);
    expect(LongitudeSchema.safeParse(40.123).success).toBe(false);
  });

  it('accepts longitudes with exactly 1 decimal place', () => {
    expect(LongitudeSchema.safeParse(-51.1).success).toBe(true);
    expect(LongitudeSchema.safeParse(40.3).success).toBe(true);
  });
});
