import { timer } from 'rxjs';

const appendIcon = (imageUrl: unknown) => {
  return (elem: HTMLElement) => {
    const container = document.createElement('div');
    container.classList.add('icon');
    container.innerHTML = `<img loading="lazy" src="${imageUrl}">`;
    elem.appendChild(container);
  };
};

const hasNoIcon = (elem: HTMLElement) => {
  return elem.querySelector('.icon') === null;
};

/**
 * Add <img> into list item that does not have own image.
 */
export const setDefaultImage = ({ imageUrl }: { imageUrl: string }) => {
  timer(0, 1000 * 5)
    .pipe()
    .subscribe(() => {
      if (window.scrapbox.Layout !== 'list') {
        return;
      }

      Array.from(document.querySelectorAll<HTMLElement>('.page-list .page-list-item .content'))
        .filter(hasNoIcon)
        .forEach(appendIcon(imageUrl));
    });
};
