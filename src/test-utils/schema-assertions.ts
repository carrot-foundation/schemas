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
  const mutated = mutate(draft);

  const valueToValidate = mutated === undefined ? draft : (mutated as T);

  const result = schema.safeParse(valueToValidate);

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

export function expectIssuesContain<T>(
  schema: z.ZodType<T>,
  buildData: () => T,
  expectedSubstrings: string[],
) {
  const result = schema.safeParse(buildData());

  expect(result.success).toBe(false);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    expectedSubstrings.forEach((substring) => {
      expect(messages.some((message) => message.includes(substring))).toBe(
        true,
      );
    });
  }
}

export function expectSchemaInvalidWithout<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  exampleData: T,
  key: keyof T,
) {
  expectSchemaInvalid(schema, exampleData, (draft) => {
    Reflect.deleteProperty(draft, key);
  });
}

export function expectSchemaTyped<T>(
  schema: z.ZodType<T>,
  buildData: () => T,
  assert: (data: T) => void,
) {
  const result = schema.safeParse(buildData());

  expect(result.success).toBe(true);

  if (result.success) {
    assert(result.data);
  }
}
