import { USProject, UserScriptApi } from 'scrapbox-tools/';
import { findElementOrFail, findElements, getFormattedDateString } from '../../libs';
import { customCSSClassName } from '../config';

const createDatetimeElement = (timestamp: number) => {
  const elem = document.createElement('div');
  // TODO: need commonize timestamp operation, scrapbox use second, but millisecond requires in javascript
  elem.textContent = getFormattedDateString(new Date(timestamp * 1000));
  elem.classList.add(customCSSClassName.datetimeOnListItem);

  return elem;
};

export const getPageTitleMap = (pages: USProject['pages']) => {
  return new Map(pages.filter((page) => Boolean(page.title)).map((page) => [page.title, page]));
};

export const getTitleToElementMap = (parent: ParentNode = document) => {
  const listItems = findElements('.app .page-list .page-list-item', parent) as Element[];

  // Map<title, element>
  return new Map(
    listItems.map((elem) => [findElementOrFail('.title', elem).textContent ?? '', elem] as const).filter(([title]) => Boolean(title)),
  );
};

export const showDatetime = () => {
  const added = new Set<string>(); // page title

  const dictionary = getPageTitleMap(UserScriptApi.data.Project.pages);
  for (const [title, element] of getTitleToElementMap()) {
    if (!added.has(title)) {
      const data = dictionary.get(title);
      if (data) {
        findElementOrFail('.content', element).appendChild(createDatetimeElement(data.updated));
        added.add(title);
      }
    }
  }
};
