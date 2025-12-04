# Create Branch

Generate Git branch name following Conventional Commit conventions.

## Usage

```
/create-branch [type] [description-words...]
```

**Examples:**

```
/create-branch feat add mass-id schema
/create-branch fix shared uuid validation
```

**Interactive:** Call without arguments for guided workflow

## Workflow

### 1. Gather Context

- Primary purpose (feat, fix, refactor, etc.)
- Scope from `@commit.mdc` domains
- Ticket ID if applicable
- Summary in 3-6 kebab-case keywords

### 2. Choose Format

- Preferred: `<type>/<short-description>`
- With scope: `<type>/<scope>-<short-description>`
- With ticket: append `-<TICKET>`

### 3. Validate

- Length ≤60 characters
- Lowercase, kebab-case only
- No prohibited punctuation
- Specific and meaningful description

### 4. Present Result

- Suggested branch name
- Rationale (type, scope, description)
- Reminder: align with commits and PR

## Challenge Points

- Filler words ("update", "changes")? → Demand specifics
- Length >60 chars? → Suggest trimming
- Multiple concerns? → Separate branches
- Unclear scope? → Ask which component affected

## Related

- `@branch-naming.mdc` - Complete naming standards
- `@commit.mdc` - Type and scope alignment
