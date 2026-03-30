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

export { emitMethodologyExample, emitCollectionExample, emitCreditExample };

/** Registry mapping schema type directory names to their emitter functions. */
export const emitters = {
  methodology: emitMethodologyExample,
  collection: emitCollectionExample,
  credit: emitCreditExample,
};
