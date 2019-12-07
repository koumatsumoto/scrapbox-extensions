import { isEmptyDoubleDimensionalArray } from '../../util/common';
import { ScrapboxDomManipulator } from '../../util/scrapbox-dom';
import { Block, Container, InvalidBlock, ManipulatableElement, Meta, Page } from './types';

const cssClass = {
  title: 'us-structure-title',
  block: 'us-structure-block',
  meta: 'us-structure-meta',
  symbol: 'us-structure-symbol',
  texts: 'us-structure-texts',
};

export const createBlock = (lines: Element[]) => {
  let meta: Meta | undefined;
  let symbol: ManipulatableElement | undefined;
  const text: ManipulatableElement[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // tags line
    if (i === 0) {
      meta = new Meta(line);
    } else if (i === 1) {
      symbol = line;
    } else {
      text.push(line);
    }
  }

  return new InvalidBlock(meta, symbol, text);
};

export const getPage = () => {
  const sections = ScrapboxDomManipulator.getLinesGroupBySectionNumber();
  if (isEmptyDoubleDimensionalArray(sections)) {
    return;
  }

  // first section includes title
  const title = sections[0].shift()!;
  const blocks: Block[] = [];
  sections.forEach((lines) => blocks.push(createBlock(lines)));

  const container = new Container(blocks);
  const page = new Page(title, container);

  return page;
};

export const enableLineStructualization = () => {};
