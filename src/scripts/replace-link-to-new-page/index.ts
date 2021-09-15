import { getDiaryPageTitle } from '../../libs';
import { getGlobalObject } from '../global-object';

const replaceHref = (element: { href: string }) => {
  element.href = element.href.replace('new', encodeURIComponent(getDiaryPageTitle()));
};

export const replaceLinkToNewPage = () => {
  const { router } = getGlobalObject();
  router.url.subscribe(() => {
    Array.from(document.querySelectorAll<HTMLAnchorElement>('a.new-button')).forEach(replaceHref);
  });
};
