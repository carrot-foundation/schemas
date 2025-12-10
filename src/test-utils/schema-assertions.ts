import { expect } from 'vitest';
import { z } from 'zod';

type Mutate<T> = (draft: T) => void;

export function expectSchemaValid<T>(schema: z.ZodType<T>, buildData: () => T) {
  const data = buildData();
  const result = schema.safeParse(data);

  expect(result.success).toBe(true);
}

export function expectSchemaInvalid<T>(
  schema: z.ZodType<T>,
  exampleData: T,
  mutate: Mutate<T>,
) {
  const draft = structuredClone(exampleData);
  mutate(draft);

  const result = schema.safeParse(draft);

  expect(result.success).toBe(false);
}

export function expectIssues<T>(
  schema: z.ZodType<T>,
  buildData: () => T,
  expectedMessages: string[],
) {
  const result = schema.safeParse(buildData());

  expect(result.success).toBe(false);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    expect(messages).toEqual(expectedMessages);
  }
}
