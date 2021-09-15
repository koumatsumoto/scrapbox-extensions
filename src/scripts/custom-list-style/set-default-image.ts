import { timer } from 'rxjs';
import { defaultImageUrl } from './constants';

const appendIcon = (elem: HTMLElement) => {
  const container = document.createElement('div');
  container.classList.add('icon');
  container.innerHTML = `<img loading="lazy" src="${defaultImageUrl}">`;
  elem.appendChild(container);
};

const hasNoIcon = (elem: HTMLElement) => {
  return elem.querySelector('.icon') === null;
};

/**
 * Add <img> into list item that does not have own image.
 */
export const setDefaultImage = () => {
  timer(0, 1000 * 5).subscribe(() => {
    if (window.scrapbox.Layout !== 'list') {
      return;
    }

    const listElements = Array.from(document.querySelectorAll<HTMLElement>('.page-list .page-list-item .content'));
    listElements.filter(hasNoIcon).forEach(appendIcon);
  });
};
