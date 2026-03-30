export { buildReferenceStory } from './reference-story.js';
export {
  buildExampleId,
  formatDate,
  formatDateTime,
  formatUnixMs,
  NON_PRODUCTION_MARKER,
} from './shared.js';

import { emitMethodologyExample } from './emitters/methodology.js';
import { emitCollectionExample } from './emitters/collection.js';
import { emitCreditExample } from './emitters/credit.js';
import { emitMassIdExample } from './emitters/mass-id.js';
import { emitGasIdExample } from './emitters/gas-id.js';
import { emitRecycledIdExample } from './emitters/recycled-id.js';
import { emitMassIdAuditExample } from './emitters/mass-id-audit.js';

export {
  emitMethodologyExample,
  emitCollectionExample,
  emitCreditExample,
  emitMassIdExample,
  emitGasIdExample,
  emitRecycledIdExample,
  emitMassIdAuditExample,
};

/** Registry mapping schema type directory names to their emitter functions. */
export const emitters = {
  methodology: emitMethodologyExample,
  collection: emitCollectionExample,
  credit: emitCreditExample,
  'mass-id': emitMassIdExample,
  'gas-id': emitGasIdExample,
  'recycled-id': emitRecycledIdExample,
  'mass-id-audit': emitMassIdAuditExample,
};
