import { z } from 'zod';
import { BRAZIL_MUNICIPALITIES } from './brazil.data';

export function validateLocationBrazilData(
  record: {
    subdivision_code: string;
    city: string;
    country_code: string;
  },
  ctx: {
    addIssue: (
      issue: Omit<z.core.$ZodIssue, 'code'> & { code: 'custom' },
    ) => void;
  },
): void {
  const { subdivision_code, city, country_code } = record;

  if (country_code !== 'BR') {
    return;
  }

  const municipality = BRAZIL_MUNICIPALITIES.find(
    (municipality) => municipality.name === city,
  );

  if (municipality) {
    const countryPart = subdivision_code.split('-')[0];
    const subdivisionPart = subdivision_code.split('-')[1];

    if (countryPart !== 'BR') {
      ctx.addIssue({
        code: 'custom',
        path: ['subdivision_code'],
        message: 'Must start with BR',
      });
    }

    if (municipality.subdivision !== subdivisionPart) {
      ctx.addIssue({
        code: 'custom',
        path: ['subdivision_code'],
        message: `Must match the subdivision code of the municipality: BR-${municipality.subdivision}`,
      });
    }
  } else {
    ctx.addIssue({
      code: 'custom',
      path: ['city'],
      message: 'Must be a valid Brazil municipality',
    });
  }
}
