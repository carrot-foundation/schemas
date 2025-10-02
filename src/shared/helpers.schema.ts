import { z } from 'zod';

export function uniqueArrayItems<T extends z.ZodTypeAny>(
  schema: T,
  errorMessage: string = 'Array items must be unique',
) {
  return z
    .array(schema)
    .refine((items) => new Set(items).size === items.length, {
      message: errorMessage,
    });
}

export function uniqueBy<T extends z.ZodTypeAny, K>(
  schema: T,
  selector: (item: z.infer<T>) => K,
  errorMessage: string = 'Items must be unique',
) {
  return z.array(schema).refine(
    (items) => {
      const values = items.map(selector);
      return new Set(values).size === values.length;
    },
    {
      message: errorMessage,
    },
  );
}
