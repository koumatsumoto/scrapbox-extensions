import { UserScriptApi, USProject } from 'scrapbox-tools/';
import { getFormattedDateString } from '../../libs';
import { customCSSClassName } from './constants';

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
  const listItems = parent.querySelectorAll<Element>('.app .page-list .page-list-item');

  // Map<title, element>
  return new Map(
    Array.from(listItems)
      .map((elem) => [elem.querySelector('.title')?.textContent ?? '', elem] as const)
      .filter(([title]) => Boolean(title)),
  );
};

export const showDatetime = () => {
  const added = new Set<string>(); // page title

  const dictionary = getPageTitleMap(UserScriptApi.data.Project.pages);
  for (const [title, element] of getTitleToElementMap()) {
    if (!added.has(title)) {
      const data = dictionary.get(title);
      if (data) {
        element.querySelector('.content')!.appendChild(createDatetimeElement(data.updated));
        added.add(title);
      }
    }
  }
};
