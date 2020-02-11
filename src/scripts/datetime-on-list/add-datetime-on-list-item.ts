import { getFormattedDateString } from '../../libs/scrapbox';
import { retrieveListItemsWithTitle, selectContainer } from '../../libs/scrapbox/dom';
import { getPageTitleMap } from '../../libs/scrapbox/public-api';
import { customCSSClassName } from '../config';

const createDatetimeElement = (timestamp: number) => {
  const elem = document.createElement('div');
  elem.textContent = getFormattedDateString(new Date(timestamp));
  elem.classList.add(customCSSClassName.datetimeOnListItem);

  return elem;
};

export const addDatetimeOnListItem = () => {
  const added = new Set<string>(); // page title

  const dictionary = getPageTitleMap();
  for (const [title, element] of retrieveListItemsWithTitle()) {
    if (!added.has(title)) {
      const data = dictionary.get(title);
      if (data) {
        selectContainer(element).appendChild(createDatetimeElement(data.updated));
        added.add(title);
      }
    }
  }
};
