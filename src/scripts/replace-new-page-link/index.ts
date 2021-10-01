import { Router } from 'scrapbox-tools';
import { getFormattedDateString } from '../../libs';

const replaceHref = (element: { href: string }) => {
  element.href = element.href.replace('new', encodeURIComponent(getFormattedDateString()));
};

export const replaceLinkToNewPage = ({ router }: { router: Router }) => {
  router.url.subscribe(() => {
    Array.from(document.querySelectorAll<HTMLAnchorElement>('a.new-button')).forEach(replaceHref);
  });
};
