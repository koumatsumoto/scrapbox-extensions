import { registerElementManagement } from '../../libs/common/dom';
import { defaultImageUrl, listItemContentSelectorFn } from './config';

const appendImg = (elem: HTMLElement) => {
  const container = document.createElement('div');
  container.classList.add('icon');
  container.innerHTML = `<img loading="lazy" src="${defaultImageUrl}">`;
  elem.appendChild(container);
};

/**
 * Add <img> into list item that does not have own image.
 */
export const defaultImage = () =>
  registerElementManagement({
    targetsSelector: listItemContentSelectorFn,
    onFirstCheck: (elem) => {
      appendImg(elem);
    },
    checkInterval: 1000 * 5,
  });
