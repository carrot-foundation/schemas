import { it } from 'vitest';
import { z } from 'zod';

import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../../test-utils';

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type ReferenceTestConfig<T extends Record<string, unknown>> = {
  schema: z.ZodType<T>;
  base: T;
  requiredFields: (keyof T)[];
  invalidCases?: Array<{
    description: string;
    mutate: (draft: Mutable<T>) => void;
  }>;
  validCases?: Array<{
    description: string;
    build: () => T;
  }>;
  typeCheck?: (data: T, base: T) => void;
};

export function runReferenceSchemaTests<T extends Record<string, unknown>>({
  schema,
  base,
  requiredFields,
  invalidCases = [],
  validCases = [],
  typeCheck,
}: ReferenceTestConfig<T>) {
  it('validates valid reference successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  validCases.forEach(({ description, build }) => {
    it(description, () => {
      expectSchemaValid(schema, build);
    });
  });

  requiredFields.forEach((field) => {
    it(`rejects missing ${String(field)}`, () => {
      expectSchemaInvalidWithout(schema, base, field);
    });
  });

  invalidCases.forEach(({ description, mutate }) => {
    it(description, () => {
      expectSchemaInvalid(schema, base, (invalid) => {
        mutate(invalid as Mutable<T>);
      });
    });
  });

  if (typeCheck) {
    it('validates type inference works correctly', () => {
      expectSchemaTyped(
        schema,
        () => structuredClone(base),
        (data) => {
          typeCheck(data, base);
        },
      );
    });
  }

  it('rejects additional properties', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      (invalid as Mutable<T> & { extra_field?: string }).extra_field =
        'not allowed';
    });
  });
}
