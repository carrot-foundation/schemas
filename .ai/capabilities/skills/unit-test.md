---
id: unit-test
name: unit-test
description: 'Use when writing or updating tests for schemas, especially when 100% coverage is required'
when_to_use:
  - 'After creating or modifying a schema'
  - 'When coverage drops below 100%'
  - 'When adding edge case tests'
  - 'When the user asks to write tests'
workflow:
  - '[ ] Identify test file location in __tests__/'
  - '[ ] Write tests for valid inputs'
  - '[ ] Write tests for invalid inputs'
  - '[ ] Write edge case tests'
  - '[ ] Run tests with coverage'
  - '[ ] Verify 100% thresholds met'
inputs:
  - 'Schema file to test'
  - 'Expected valid/invalid inputs'
outputs:
  - 'Complete test file with 100% coverage'
references:
  - .ai/rules/testing.md
---

# Unit Test Skill

## Instructions

Write and maintain Vitest tests for Zod schemas in the schemas package, targeting 100% coverage on all four thresholds.

### Test File Location

Tests live alongside their source in `__tests__/` directories:

```
src/
  {type}/
    {type}.schema.ts
    {type}.data.schema.ts
    __tests__/
      {type}.schema.spec.ts       # Tests for all schemas in this type
```

The naming convention is `{type}.schema.spec.ts` matching the main schema file.

### Test Structure

Every test file follows this structure:

```typescript
import { describe, expect, it } from 'vitest';
import { {TypeName}Schema } from '../{type}.schema';
import { {TypeName}DataSchema } from '../{type}.data.schema';

describe('{TypeName}Schema', () => {
  describe('valid inputs', () => {
    // Happy path tests
  });

  describe('invalid inputs', () => {
    // Rejection tests
  });

  describe('optional fields', () => {
    // Optional field behavior
  });

  describe('edge cases', () => {
    // Boundary values, empty strings, etc.
  });
});
```

### Using `.safeParse()` for Validation

Always use `.safeParse()` instead of `.parse()` in tests. This returns a result object instead of throwing:

```typescript
// CORRECT: safeParse returns { success, data?, error? }
const result = Schema.safeParse(input);
expect(result.success).toBe(true);

// INCORRECT: parse throws on invalid input
expect(() => Schema.parse(input)).not.toThrow();
```

To inspect parse errors during debugging:

```typescript
const result = Schema.safeParse(input);
if (!result.success) {
  console.log(JSON.stringify(result.error.issues, null, 2));
}
expect(result.success).toBe(true);
```

### Testing Valid Inputs

Provide at least one complete valid input with all required fields:

```typescript
it('should parse a complete valid input', () => {
  const input = {
    name: 'Test Document',
    description: 'A test document for validation',
    image: 'https://example.com/image.png',
    external_url: 'https://example.com',
    data: {
      field_name: 'value',
      numeric_field: 42,
    },
    attributes: [{ trait_type: 'Category', value: 'Test' }],
  };

  const result = Schema.safeParse(input);
  expect(result.success).toBe(true);
});
```

Use `it.each` for multiple valid variations:

```typescript
it.each([
  [
    'with minimum required fields',
    {
      /* only required fields */
    },
  ],
  [
    'with all optional fields',
    {
      /* required + all optional fields */
    },
  ],
  [
    'with different valid enum value',
    {
      /* valid input with alternative enum */
    },
  ],
])('should parse valid input: %s', (_label, input) => {
  const result = Schema.safeParse(input);
  expect(result.success).toBe(true);
});
```

### Testing Invalid Inputs

Test each required field individually for rejection:

```typescript
it('should reject when name is missing', () => {
  const { name, ...input } = validInput;
  const result = Schema.safeParse(input);
  expect(result.success).toBe(false);
});

it('should reject when name is wrong type', () => {
  const input = { ...validInput, name: 123 };
  const result = Schema.safeParse(input);
  expect(result.success).toBe(false);
});
```

Test unknown property rejection (strictObject enforcement):

```typescript
it('should reject unknown properties', () => {
  const input = {
    ...validInput,
    unknown_field: 'should not be here',
  };
  const result = Schema.safeParse(input);
  expect(result.success).toBe(false);
});
```

Table-driven invalid input tests:

```typescript
it.each([
  ['missing name', { ...validInput, name: undefined }],
  ['empty string name', { ...validInput, name: '' }],
  ['numeric name', { ...validInput, name: 123 }],
  [
    'negative amount',
    { ...validInput, data: { ...validInput.data, amount: -1 } },
  ],
  [
    'invalid enum value',
    { ...validInput, data: { ...validInput.data, status: 'invalid' } },
  ],
])('should reject invalid input: %s', (_label, input) => {
  const result = Schema.safeParse(input);
  expect(result.success).toBe(false);
});
```

### Testing Optional Fields

Verify schemas parse correctly with and without optional fields:

```typescript
describe('optional fields', () => {
  it('should parse without optional description', () => {
    const { description, ...input } = validInput;
    const result = Schema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should parse with optional description present', () => {
    const input = { ...validInput, description: 'Optional value' };
    const result = Schema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('Optional value');
    }
  });
});
```

### Testing Edge Cases

Cover boundary values and unusual but valid inputs:

```typescript
describe('edge cases', () => {
  it('should handle maximum length strings', () => {
    const input = { ...validInput, name: 'a'.repeat(1000) };
    const result = Schema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should handle zero for numeric fields', () => {
    const input = { ...validInput, data: { ...validInput.data, amount: 0 } };
    const result = Schema.safeParse(input);
    // Depends on whether .positive() or .nonnegative() is used
    expect(result.success).toBe(false); // or true
  });

  it('should handle empty arrays for attributes', () => {
    const input = { ...validInput, attributes: [] };
    const result = Schema.safeParse(input);
    // Depends on whether .min(1) is applied
  });

  it('should handle unicode strings', () => {
    const input = { ...validInput, name: 'Documento de impacto ambiental' };
    const result = Schema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
```

### Using Centralized Fixtures

Check `src/test-utils/fixtures/` for reusable test data before creating local fixtures:

```typescript
import { validNftInput } from '../../test-utils/fixtures/nft-fixtures';

const validInput = {
  ...validNftInput,
  data: {
    field_name: 'type-specific-value',
  },
};
```

### Running Tests with Coverage

Run tests with coverage to verify 100% thresholds:

```bash
# Run all tests with coverage
pnpm test:coverage

# Run tests for a single file
npx vitest run src/mass-id/__tests__/mass-id.schema.spec.ts

# Run with verbose output
npx vitest run --reporter=verbose

# Run in watch mode for iterative development
pnpm test:watch
```

### Coverage Thresholds

The schemas package enforces 100% on all four coverage metrics:

| Metric     | Threshold | What It Measures                                      |
| ---------- | --------- | ----------------------------------------------------- |
| Statements | 100%      | Every executable statement is reached                 |
| Branches   | 100%      | Every if/else, ternary, and optional chain is covered |
| Functions  | 100%      | Every function/method is called                       |
| Lines      | 100%      | Every line of code is executed                        |

If coverage drops below 100%, identify uncovered lines:

```bash
pnpm test:coverage
# Open coverage/index.html in a browser for detailed report
```

### Common Coverage Gaps

| Gap                        | Solution                                     |
| -------------------------- | -------------------------------------------- |
| Unreachable default export | Ensure barrel exports are tested indirectly  |
| Untested enum value        | Add an `it.each` case for each enum value    |
| Untested optional branch   | Add a test without the optional field        |
| Untested error path        | Add an invalid input that triggers the error |

### Anti-Patterns to Avoid

- **No `.only`**: Never commit `it.only` or `describe.only` (lint rule enforced)
- **No snapshot tests**: Use explicit assertions, not `toMatchSnapshot()`
- **No `parse()` in tests**: Always use `safeParse()` for predictable behavior
- **No `expect(true).toBe(true)`**: Always assert on meaningful values
- **No skipped tests**: Don't commit `it.skip` or `xit`
