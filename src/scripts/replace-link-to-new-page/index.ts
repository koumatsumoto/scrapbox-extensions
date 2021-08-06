import { findElements, getDiaryPageTitle } from '../../libs';
import { getGlobalObject } from '../global-object';

const replaceHref = (element: { href: string }) => {
  element.href = element.href.replace('new', encodeURIComponent(getDiaryPageTitle()));
};

export const replaceLinkToNewPage = () => {
  const { router } = getGlobalObject();
  router.url.subscribe(() => {
    findElements<HTMLAnchorElement>('a.new-button').forEach(replaceHref);
  });
};
