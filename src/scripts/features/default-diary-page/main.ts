import { findElements } from '../../../libs/common/dom';
import { getDateText, Router } from '../../../libs/scrapbox';

export const selectNewButtons = () => findElements<HTMLAnchorElement>('a.new-button');
export const replaceText = (source: string, word: string) => source.replace('new', encodeURIComponent(word));

export const replaceNewButtonLink = () => {
  const targets = selectNewButtons();
  targets.forEach((e) => (e.href = replaceText(e.href, getDateText())));
};

export const main = () => {
  // initial
  replaceNewButtonLink();
  // on route change
  Router.onPageChange(replaceNewButtonLink);
};
