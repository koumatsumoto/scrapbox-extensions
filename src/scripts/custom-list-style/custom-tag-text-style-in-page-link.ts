import { timer } from 'rxjs';
import { extractWord, isTagString } from '../../libs';
import { customCSSClassName } from './constants';

/**
 * Remove hash and add custom css class to link-text in list-item
 * Add custom css class to time text in list-item
 */
export const customTagTextStyleInPageLink = () => {
  timer(0, 1000 * 5).subscribe(() => {
    if (window.scrapbox.Layout !== 'page') {
      return;
    }

    const tagTextElements = Array.from(document.querySelectorAll<HTMLElement>('.page-list-item .description .page-link'));
    tagTextElements
      .filter((element) => isTagString(element.textContent))
      .forEach((element) => {
        element.textContent = extractWord(element.textContent!);
        element.classList.add(customCSSClassName.hashInListItem);
      });
  });
};
