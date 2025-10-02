# Carrot Foundation Schema Patterns and Best Practices

This document outlines the established patterns and conventions for developing and maintaining Zod schemas within the Carrot Foundation schema repository.

## Core Principles

### 1. Meta Information for Enhanced Documentation

Every schema field should include comprehensive `meta` information to provide examples, titles, and contextual information for better developer experience and automated documentation generation.

#### Pattern Usage

```typescript
const fieldName = z
  .string()
  .describe('Field description for validation')
  .meta({
    title: 'Human-readable Field Title',
    examples: ['example1', 'example2', 'example3'],
  });
```

#### Benefits
- **Automated Documentation**: Meta information enables automatic generation of comprehensive JSON Schema documentation
- **Developer Experience**: Clear examples and titles improve code comprehensibility
- **API Documentation**: Facilitates creation of interactive API documentation with realistic examples
- **Testing**: Examples provide ready-to-use test data

### 2. Using `describe()` for Field Descriptions

Always use the `describe()` method to add meaningful descriptions to schema fields. This information is used for validation error messages and documentation generation.

#### Pattern Usage

```typescript
// ✅ Good - Clear, descriptive
const wasteType = z
  .string()
  .min(1)
  .describe('Primary waste material category')
  .meta({
    title: 'Waste Type',
    examples: ['Organic', 'Plastic', 'Metal'],
  });

// ❌ Avoid - Missing description
const wasteType = z.string().min(1);
```

### 3. Replacing `strict()` with `strictObject()`

Use `strictObject()` instead of combining `object()` with `strict()` for cleaner, more explicit schema definitions.

#### Migration Pattern

```typescript
// ❌ Old Pattern
const schema = z
  .object({
    field1: z.string(),
    field2: z.number(),
  })
  .strict();

// ✅ New Pattern
const schema = z.strictObject({
  field1: z.string(),
  field2: z.number(),
});
```

#### Benefits
- **Cleaner Syntax**: Single method call instead of chaining
- **Explicit Intent**: Clearly indicates strict object validation
- **Consistency**: Aligns with modern Zod best practices

### 4. Minimizing Use of `refine()` Validators

Avoid custom `refine()` validations except when business logic cannot be represented through standard Zod methods.

#### When to Use `refine()`

Use `refine()` only for:
- Cross-field validations that cannot be expressed declaratively
- Complex business rules that require custom logic
- Domain-specific constraints that have no Zod equivalent

#### Preferred Alternatives

```typescript
// ❌ Unnecessary refine usage
const schema = z
  .object({
    email: z.string(),
  })
  .refine((data) => data.email.includes('@'), 'Must be valid email');

// ✅ Use built-in validators
const schema = z.strictObject({
  email: z.string().email('Must be valid email'),
});

// ❌ Unnecessary refine for length
const schema = z
  .object({
    name: z.string(),
  })
  .refine((data) => data.name.length >= 1, 'Name required');

// ✅ Use built-in constraints
const schema = z.strictObject({
  name: z.string().min(1, 'Name required'),
});
```

#### Acceptable `refine()` Usage

```typescript
// ✅ Complex business logic that requires refine()
const schema = z
  .strictObject({
    participants: z.array(participantSchema),
    events: z.array(eventSchema),
  })
  .refine((data) => {
    const participantIds = new Set(data.participants.map(p => p.id));
    const eventParticipantIds = data.events.map(e => e.participant_id);
    return eventParticipantIds.every(id => participantIds.has(id));
  }, 'All participant IDs in events must exist in participants array');
```

## Implementation Examples

### Complete Field Definition

```typescript
const wasteClassification = z
  .strictObject({
    primary_type: wasteType
      .describe('Primary waste material category')
      .meta({
        title: 'Primary Waste Type',
        examples: ['Organic', 'Plastic', 'Metal'],
      }),
    
    net_weight: z
      .number()
      .min(0)
      .describe('Net weight of the waste batch in the specified measurement unit')
      .meta({
        title: 'Net Weight',
        examples: [3000, 1500, 2.5],
      }),
    
    contamination_level: z
      .enum(['None', 'Low', 'Medium', 'High'])
      .describe('Level of contamination in the waste batch')
      .meta({
        title: 'Contamination Level',
        examples: ['Low', 'Medium', 'None'],
      }),
  })
  .describe('Standardized waste material classification and regulatory information')
  .meta({
    title: 'Waste Classification',
    examples: [
      {
        primary_type: 'Organic',
        net_weight: 3000,
        contamination_level: 'Low',
      },
    ],
  });
```

### Schema with Proper Relationships

```typescript
const chainOfCustodyEvent = z
  .strictObject({
    event_id: uuid
      .describe('Unique event identifier')
      .meta({
        title: 'Event ID',
        examples: ['8f799606-4ed5-49ce-8310-83b0c56ac01e'],
      }),
    
    participant_id: uuid
      .describe('Reference to participant in the participants array')
      .meta({
        title: 'Participant ID',
        examples: ['6f520d88-864d-432d-bf9f-5c3166c4818f'],
      }),
  })
  .describe('Chain of custody event')
  .meta({
    title: 'Chain of Custody Event',
    examples: [
      {
        event_id: '8f799606-4ed5-49ce-8310-83b0c56ac01e',
        participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
      },
    ],
  });
```

## Benefits of These Patterns

### 1. Enhanced Documentation Generation
- Automatic creation of comprehensive JSON Schema files
- Rich examples for API documentation
- Clear field descriptions for developers

### 2. Improved Developer Experience
- Consistent naming conventions
- Comprehensive examples for testing
- Clear validation error messages

### 3. Better Maintainability
- Reduced custom validation logic
- Consistent schema structure
- Self-documenting code

### 4. Automated Tooling Support
- Schema validation tools can leverage meta information
- Testing frameworks can use examples for property-based testing
- Documentation generators have rich context

## Migration Checklist

When updating existing schemas, ensure:

- [ ] All fields have `describe()` with clear descriptions
- [ ] All fields include `meta()` with title and examples
- [ ] Replace `.object().strict()` with `.strictObject()`
- [ ] Review and minimize `refine()` usage
- [ ] Add comprehensive examples at all schema levels
- [ ] Ensure examples are realistic and useful

## Example Migration

### Before
```typescript
const oldSchema = z
  .object({
    name: z.string().min(1),
    weight: z.number(),
  })
  .strict()
  .refine((data) => data.weight > 0, 'Weight must be positive');
```

### After
```typescript
const newSchema = z
  .strictObject({
    name: z
      .string()
      .min(1)
      .describe('Name of the participant')
      .meta({
        title: 'Participant Name',
        examples: ['Enlatados Produção', 'Eco Reciclagem'],
      }),
    
    weight: z
      .number()
      .positive()
      .describe('Weight in kilograms')
      .meta({
        title: 'Weight (kg)',
        examples: [3000, 1500, 500],
      }),
  })
  .describe('Participant information')
  .meta({
    title: 'Participant',
    examples: [
      {
        name: 'Enlatados Produção',
        weight: 3000,
      },
    ],
  });
```

This comprehensive approach ensures schemas are self-documenting, maintainable, and provide excellent developer experience while maintaining strict validation standards.
