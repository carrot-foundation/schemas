import { it } from 'vitest';
import { z } from 'zod';

import { expectSchemaInvalid } from '../../../../test-utils';

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type ReceiptInvalidCase<T extends Record<string, unknown>> = {
  description: string;
  mutate: (draft: Mutable<T>) => void;
};

export function runReceiptInvalidCases<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  base: T,
  cases: ReceiptInvalidCase<T>[],
) {
  it.each(cases)('$description', ({ mutate }) => {
    expectSchemaInvalid(schema, base, (invalid) => {
      mutate(invalid as Mutable<T>);
    });
  });
}
