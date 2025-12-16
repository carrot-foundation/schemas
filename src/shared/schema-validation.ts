import { z } from 'zod';

export const EPSILON = 1e-9;

export function nearlyEqual(a: number, b: number, epsilon: number = EPSILON) {
  return Math.abs(a - b) <= epsilon;
}

type Attribute = {
  trait_type: string;
  value: unknown;
};

type Message = string | ((value: string) => string);

function buildMessage(message: Message, value: string) {
  return typeof message === 'function' ? message(value) : message;
}

export function createAttributeMap(attributes: Attribute[]) {
  return new Map(
    attributes.map((attribute) => [attribute.trait_type, attribute]),
  );
}

export function validateSummaryListMatchesData(params: {
  ctx: z.RefinementCtx;
  summaryValues: Iterable<string>;
  dataValues: Iterable<string>;
  summaryPath: (string | number)[];
  missingFromDataMessage: Message;
  missingFromSummaryMessage: Message;
}) {
  const { ctx, summaryValues, dataValues, summaryPath } = params;
  const summarySet = new Set(summaryValues);
  const dataSet = new Set(dataValues);

  summarySet.forEach((value) => {
    if (!dataSet.has(value)) {
      ctx.addIssue({
        code: 'custom',
        message: buildMessage(params.missingFromDataMessage, value),
        path: summaryPath,
      });
    }
  });

  dataSet.forEach((value) => {
    if (!summarySet.has(value)) {
      ctx.addIssue({
        code: 'custom',
        message: buildMessage(params.missingFromSummaryMessage, value),
        path: summaryPath,
      });
    }
  });
}

export function validateTotalMatches(params: {
  ctx: z.RefinementCtx;
  actualTotal: number;
  expectedTotal: number;
  path: (string | number)[];
  message: string;
}) {
  const { ctx, actualTotal, expectedTotal, path, message } = params;
  if (!nearlyEqual(actualTotal, expectedTotal)) {
    ctx.addIssue({
      code: 'custom',
      message,
      path,
    });
  }
}

export function validateCountMatches(params: {
  ctx: z.RefinementCtx;
  actualCount: number;
  expectedCount: number;
  path: (string | number)[];
  message: string;
}) {
  const { ctx, actualCount, expectedCount, path, message } = params;
  if (actualCount !== expectedCount) {
    ctx.addIssue({
      code: 'custom',
      message,
      path,
    });
  }
}

export function validateNumericAttributeValue(params: {
  ctx: z.RefinementCtx;
  attributeByTraitType: Map<string, Attribute>;
  traitType: string;
  expectedValue: number;
  epsilon: number;
  missingMessage: string;
  mismatchMessage: string;
}) {
  const {
    ctx,
    attributeByTraitType,
    traitType,
    expectedValue,
    epsilon,
    missingMessage,
    mismatchMessage,
  } = params;

  const attribute = attributeByTraitType.get(traitType);
  if (!attribute) {
    ctx.addIssue({
      code: 'custom',
      message: missingMessage,
      path: ['attributes'],
    });
    return;
  }

  const attributeValue = attribute.value;
  if (typeof attributeValue !== 'number') {
    const attributeIndex = Array.from(attributeByTraitType.keys()).indexOf(
      traitType,
    );
    ctx.addIssue({
      code: 'custom',
      message: `${traitType} attribute value must be a number`,
      path: ['attributes', attributeIndex, 'value'],
    });
    return;
  }

  if (!nearlyEqual(attributeValue, expectedValue, epsilon)) {
    const attributeIndex = Array.from(attributeByTraitType.keys()).indexOf(
      traitType,
    );
    ctx.addIssue({
      code: 'custom',
      message: mismatchMessage,
      path: ['attributes', attributeIndex, 'value'],
    });
  }
}

export function validateAttributeValue(params: {
  ctx: z.RefinementCtx;
  attributeByTraitType: Map<string, Attribute>;
  traitType: string;
  expectedValue: unknown;
  missingMessage: string;
  mismatchMessage: string;
  path?: (string | number)[];
}) {
  const {
    ctx,
    attributeByTraitType,
    traitType,
    expectedValue,
    missingMessage,
    mismatchMessage,
    path = ['attributes'],
  } = params;

  if (expectedValue === undefined || expectedValue === null) {
    const attributeIndex = Array.from(attributeByTraitType.keys()).indexOf(
      traitType,
    );
    if (attributeIndex >= 0) {
      ctx.addIssue({
        code: 'custom',
        message: missingMessage,
        path: ['attributes', attributeIndex],
      });
    }
    return;
  }

  const attribute = attributeByTraitType.get(traitType);
  if (!attribute) {
    ctx.addIssue({
      code: 'custom',
      message: missingMessage,
      path,
    });
    return;
  }

  if (attribute.value !== expectedValue) {
    const attributeIndex = Array.from(attributeByTraitType.keys()).indexOf(
      traitType,
    );
    ctx.addIssue({
      code: 'custom',
      message: mismatchMessage,
      path: ['attributes', attributeIndex, 'value'],
    });
  }
}

export function validateDateAttribute(params: {
  ctx: z.RefinementCtx;
  attributeByTraitType: Map<string, Attribute>;
  traitType: string;
  dateValue: string;
  missingMessage: string;
  invalidDateMessage: string;
  mismatchMessage: string;
  attributePath?: (string | number)[];
  datePath?: (string | number)[];
}) {
  const {
    ctx,
    attributeByTraitType,
    traitType,
    dateValue,
    missingMessage,
    invalidDateMessage,
    mismatchMessage,
    attributePath = ['attributes'],
    datePath,
  } = params;

  const attribute = attributeByTraitType.get(traitType);
  if (!attribute) {
    ctx.addIssue({
      code: 'custom',
      message: missingMessage,
      path: attributePath,
    });
    return;
  }

  const dateMs = Date.parse(`${dateValue}T00:00:00.000Z`);
  if (Number.isNaN(dateMs)) {
    ctx.addIssue({
      code: 'custom',
      message: invalidDateMessage,
      path: datePath ?? attributePath,
    });
    return;
  }

  if (attribute.value !== dateMs) {
    ctx.addIssue({
      code: 'custom',
      message: mismatchMessage,
      path: attributePath,
    });
  }
}

export function validateDateTimeAttribute(params: {
  ctx: z.RefinementCtx;
  attributeByTraitType: Map<string, Attribute>;
  traitType: string;
  dateTimeValue: string | undefined;
  missingMessage: string;
  invalidDateMessage: string;
  mismatchMessage: string;
  attributePath?: (string | number)[];
  dateTimePath?: (string | number)[];
}) {
  const {
    ctx,
    attributeByTraitType,
    traitType,
    dateTimeValue,
    missingMessage,
    invalidDateMessage,
    mismatchMessage,
    attributePath = ['attributes'],
    dateTimePath,
  } = params;

  if (!dateTimeValue) {
    const attribute = attributeByTraitType.get(traitType);
    if (attribute) {
      ctx.addIssue({
        code: 'custom',
        message: missingMessage,
        path: attributePath,
      });
    }
    return;
  }

  const attribute = attributeByTraitType.get(traitType);
  if (!attribute) {
    ctx.addIssue({
      code: 'custom',
      message: missingMessage,
      path: attributePath,
    });
    return;
  }

  const dateMs = Date.parse(dateTimeValue);
  if (Number.isNaN(dateMs)) {
    ctx.addIssue({
      code: 'custom',
      message: invalidDateMessage,
      path: dateTimePath ?? attributePath,
    });
    return;
  }

  if (attribute.value !== dateMs) {
    ctx.addIssue({
      code: 'custom',
      message: mismatchMessage,
      path: attributePath,
    });
  }
}

export function validateAttributesForItems<T>(params: {
  ctx: z.RefinementCtx;
  attributeByTraitType: Map<string, Attribute>;
  items: T[];
  traitSelector: (item: T) => string;
  valueSelector: (item: T) => unknown;
  missingMessage: (trait: string) => string;
  mismatchMessage: (trait: string) => string;
  path?: (string | number)[];
}) {
  const {
    ctx,
    attributeByTraitType,
    items,
    traitSelector,
    valueSelector,
    missingMessage,
    mismatchMessage,
    path = ['attributes'],
  } = params;

  items.forEach((item) => {
    const traitType = traitSelector(item);
    const expectedValue = valueSelector(item);
    const attribute = attributeByTraitType.get(traitType);
    if (!attribute) {
      ctx.addIssue({
        code: 'custom',
        message: missingMessage(traitType),
        path,
      });
      return;
    }

    if (attribute.value !== expectedValue) {
      ctx.addIssue({
        code: 'custom',
        message: mismatchMessage(traitType),
        path,
      });
    }
  });
}

export function validateCertificateCollectionSlugs(params: {
  ctx: z.RefinementCtx;
  certificateCollections: Array<{ slug: string }>;
  validCollectionSlugs: Set<string>;
  certificateIndex: number;
  message?: string;
}) {
  const {
    ctx,
    certificateCollections,
    validCollectionSlugs,
    certificateIndex,
    message = 'certificate.collections[].slug must match a collection slug in collections',
  } = params;

  certificateCollections.forEach((collectionItem, collectionIndex) => {
    if (!validCollectionSlugs.has(collectionItem.slug)) {
      ctx.addIssue({
        code: 'custom',
        message,
        path: [
          'certificates',
          certificateIndex,
          'collections',
          collectionIndex,
          'slug',
        ],
      });
    }
  });
}

export function validateRetirementReceiptRequirement(params: {
  ctx: z.RefinementCtx;
  hasRetirementReceipt: boolean;
  totalRetiredAmount: number;
  messageWhenPresentButNoRetired?: string;
  messageWhenRetiredButNotPresent?: string;
}) {
  const {
    ctx,
    hasRetirementReceipt,
    totalRetiredAmount,
    messageWhenPresentButNoRetired = 'retirement_receipt is present but no certificate has retired_amount greater than 0',
    messageWhenRetiredButNotPresent = 'certificates with retired amounts > 0 require retirement_receipt',
  } = params;

  if (hasRetirementReceipt) {
    if (totalRetiredAmount === 0) {
      ctx.addIssue({
        code: 'custom',
        message: messageWhenPresentButNoRetired,
        path: ['retirement_receipt'],
      });
    }
  } else if (totalRetiredAmount > 0) {
    ctx.addIssue({
      code: 'custom',
      message: messageWhenRetiredButNotPresent,
      path: ['retirement_receipt'],
    });
  }
}

export function validateCollectionsHaveRetiredAmounts(params: {
  ctx: z.RefinementCtx;
  collections: Array<{ slug: string }>;
  retiredTotalsBySlug: Map<string, number>;
  message?: string;
}) {
  const {
    ctx,
    collections,
    retiredTotalsBySlug,
    message = 'collection must be referenced by at least one certificate with retired amounts > 0',
  } = params;

  collections.forEach((collection, index) => {
    const retiredTotal = retiredTotalsBySlug.get(String(collection.slug)) ?? 0;
    if (retiredTotal === 0) {
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['collections', index, 'slug'],
      });
    }
  });
}

export function validateCreditSlugExists(params: {
  ctx: z.RefinementCtx;
  creditSlug: string;
  validCreditSlugs: Set<string>;
  path: (string | number)[];
  message?: string;
}) {
  const {
    ctx,
    creditSlug,
    validCreditSlugs,
    path,
    message = 'credit_slug must match a credit slug in credits',
  } = params;

  if (!validCreditSlugs.has(creditSlug)) {
    ctx.addIssue({
      code: 'custom',
      message,
      path,
    });
  }
}

export function validateCreditSymbolExists(params: {
  ctx: z.RefinementCtx;
  creditSymbol: string;
  validCreditSymbols: Set<string>;
  path: (string | number)[];
  message?: string;
}) {
  const {
    ctx,
    creditSymbol,
    validCreditSymbols,
    path,
    message = 'credit_symbol must match a credit symbol in credits',
  } = params;

  if (!validCreditSymbols.has(creditSymbol)) {
    ctx.addIssue({
      code: 'custom',
      message,
      path,
    });
  }
}

export function validateTokenIdInName(params: {
  ctx: z.RefinementCtx;
  name: string;
  tokenId: string;
  pattern: RegExp;
  path: (string | number)[];
  message?: string;
}) {
  const {
    ctx,
    name,
    tokenId,
    pattern,
    path,
    message = `Name token_id must match blockchain.token_id: ${tokenId}`,
  } = params;

  const match = pattern.exec(name);
  if (match?.[1] !== tokenId) {
    ctx.addIssue({
      code: 'custom',
      message,
      path,
    });
  }
}

export function validateFormattedName(params: {
  ctx: z.RefinementCtx;
  name: string;
  schema: z.ZodString;
  path: (string | number)[];
}) {
  const { ctx, name, schema, path } = params;

  const result = schema.safeParse(name);
  if (!result.success) {
    ctx.addIssue({
      code: 'custom',
      message: result.error.issues[0].message,
      path,
    });
  }
}
