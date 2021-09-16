import { timer, withLatestFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DynamicConfig } from 'scrapbox-tools';
import { defaultImageUrl } from './constants';

const appendIcon =
  (imageUrl: unknown = defaultImageUrl) =>
  (elem: HTMLElement) => {
    const container = document.createElement('div');
    container.classList.add('icon');
    container.innerHTML = `<img loading="lazy" src="${imageUrl}">`;
    elem.appendChild(container);
  };

const hasNoIcon = (elem: HTMLElement) => {
  return elem.querySelector('.icon') === null;
};

/**
 * Add <img> into list item that does not have own image.
 */
export const setDefaultImage = ({ dynamicConfig }: { dynamicConfig: DynamicConfig }) => {
  timer(0, 1000 * 5)
    .pipe(
      withLatestFrom(dynamicConfig.data),
      filter(() => window.scrapbox.Layout !== 'list'),
    )
    .subscribe(([, config]) => {
      const listElements = Array.from(document.querySelectorAll<HTMLElement>('.page-list .page-list-item .content'));

      listElements.filter(hasNoIcon).forEach(appendIcon(config['defaultListItemImage']));
    });
};
