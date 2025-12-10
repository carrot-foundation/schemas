import { z } from 'zod';

export function createValidationContext(): {
  issues: z.core.$ZodIssue[];
  ctx: z.RefinementCtx;
} {
  const issues: z.core.$ZodIssue[] = [];
  const ctx = {
    addIssue: (issue: z.core.$ZodIssue) => issues.push(issue),
  } as unknown as z.RefinementCtx;

  return { issues, ctx };
}
