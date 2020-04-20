import { getTagLineIds, getTagLineIdsForDOM } from './scrapbox-object/line';
import { getPage } from './scrapbox-object/page';

export * from './deprecated/id';
export * from './deprecated/line';
export * from './deprecated/page';
export * from './deprecated/util';
export * from './deprecated/scrapbox';

export const scrapbox = {
  getPage,
  getTagLineIds,
  getTagLineIdsForDOM,
};
