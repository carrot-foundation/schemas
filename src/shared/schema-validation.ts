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
    ctx.addIssue({
      code: 'custom',
      message: mismatchMessage,
      path,
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
