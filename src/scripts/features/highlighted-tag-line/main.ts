import { compact, filter, map } from 'fp-ts/lib/Array';
import { isSome } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { findElement } from '../../../libs/common/dom';
import { scrapbox } from '../../../libs/scrapbox/public-api';

const cssClassName = 'sx-highlighted-tag-line';
const applyCSSClass = (e: Element) => e.classList.add(cssClassName);

const highlightTagLines = () => {
  const elements = pipe(scrapbox.getTagLineIds(window), map(findElement), filter(isSome), compact);

  try {
    elements.forEach((e) => applyCSSClass(e));
  } catch (e) {
    console.error('[highlighted-tag-line]', e);
  }
};

export const useHighlightedTagLine = () => {
  highlightTagLines();
  setInterval(highlightTagLines, 1000);
};
