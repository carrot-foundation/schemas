export { buildReferenceStory } from './reference-story.js';
export {
  buildExampleId,
  formatDate,
  formatDateTime,
  formatUnixMs,
  NON_PRODUCTION_MARKER,
} from './shared.js';
export { emitMethodologyExample } from './emitters/methodology.js';
export { emitCollectionExample } from './emitters/collection.js';
export { emitCreditExample } from './emitters/credit.js';

import { emitMethodologyExample } from './emitters/methodology.js';
import { emitCollectionExample } from './emitters/collection.js';
import { emitCreditExample } from './emitters/credit.js';

/** Registry mapping schema type directory names to their emitter functions. */
export const emitters = {
  methodology: emitMethodologyExample,
  collection: emitCollectionExample,
  credit: emitCreditExample,
};
