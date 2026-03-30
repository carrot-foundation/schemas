export { buildReferenceStory } from './reference-story.js';
export {
  formatDate,
  formatDateTime,
  formatUnixMs,
  NON_PRODUCTION_MARKER,
} from './shared.js';

import { emitMethodologyExample } from './emitters/methodology.js';
import { emitCollectionExample } from './emitters/collection.js';
import { emitCreditExample } from './emitters/credit.js';
import { emitMassIDExample } from './emitters/mass-id.js';
import { emitGasIDExample } from './emitters/gas-id.js';
import { emitRecycledIDExample } from './emitters/recycled-id.js';
import { emitMassIDAuditExample } from './emitters/mass-id-audit.js';
import { emitCreditPurchaseReceiptExample } from './emitters/credit-purchase-receipt.js';
import { emitCreditRetirementReceiptExample } from './emitters/credit-retirement-receipt.js';

export {
  emitMethodologyExample,
  emitCollectionExample,
  emitCreditExample,
  emitMassIDExample,
  emitGasIDExample,
  emitRecycledIDExample,
  emitMassIDAuditExample,
  emitCreditPurchaseReceiptExample,
  emitCreditRetirementReceiptExample,
};

/** Registry mapping schema type directory names to their emitter functions. */
export const emitters = {
  methodology: emitMethodologyExample,
  collection: emitCollectionExample,
  credit: emitCreditExample,
  'mass-id': emitMassIDExample,
  'gas-id': emitGasIDExample,
  'recycled-id': emitRecycledIDExample,
  'mass-id-audit': emitMassIDAuditExample,
  'credit-purchase-receipt': emitCreditPurchaseReceiptExample,
  'credit-retirement-receipt': emitCreditRetirementReceiptExample,
};
