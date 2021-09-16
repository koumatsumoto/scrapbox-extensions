import { getFormattedDateString } from '../../libs';
import { customCSSClassName } from './constants';

const createDatetimeElement = (timestamp: number) => {
  const element = document.createElement('div');
  element.textContent = getFormattedDateString(new Date(timestamp * 1000));
  element.classList.add(customCSSClassName.datetimeOnListItem);

  return element;
};

const hasDatetimeElement = (element: Element) => {
  return Boolean(element.querySelector(`.${customCSSClassName.datetimeOnListItem}`));
};

const getTitle = (element: Element) => {
  return element.querySelector('.title')?.textContent ?? '';
};

export const showLastUpdatedTime = () => {
  const pages = new Map(window.scrapbox.Project.pages.filter((page) => Boolean(page.title)).map((page) => [page.title, page]));
  const elements = Array.from(document.querySelectorAll<Element>('.app .page-list .page-list-item .content'));

  elements.forEach((element) => {
    if (!hasDatetimeElement(element)) {
      const updated = pages.get(getTitle(element))?.updated;
      if (updated) {
        element.appendChild(createDatetimeElement(updated));
      }
    }
  });
};
