import { findElements } from '../../libs/common/dom';
import { getDiaryPageTitle } from '../../libs/scrapbox';
import { getGlobalHelpers } from '../global-helpers';

export const selectNewButtons = () => findElements<HTMLAnchorElement>('a.new-button');
export const replaceText = (source: string, word: string) => source.replace('new', encodeURIComponent(word));

export const replaceNewButtonLink = () => {
  const targets = selectNewButtons();
  targets.forEach((e) => (e.href = replaceText(e.href, getDiaryPageTitle())));
};

export const main = () => {
  // initial
  replaceNewButtonLink();

  // on url change
  const { router } = getGlobalHelpers();
  router.urlChange.subscribe(() => replaceNewButtonLink());
};
