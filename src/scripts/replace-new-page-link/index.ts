import { Router } from 'scrapbox-tools';
import { getDiaryPageTitle } from '../../libs';

const replaceHref = (element: { href: string }) => {
  element.href = element.href.replace('new', encodeURIComponent(getDiaryPageTitle()));
};

export const replaceLinkToNewPage = ({ router }: { router: Router }) => {
  router.url.subscribe(() => {
    Array.from(document.querySelectorAll<HTMLAnchorElement>('a.new-button')).forEach(replaceHref);
  });
};
