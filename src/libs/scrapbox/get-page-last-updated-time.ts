import { Scrapbox } from '../../types/scrapbox';

export const getPageLastUpdatedTime = () => {
  const scrapbox = (window as any).scrapbox as Scrapbox;

  if (scrapbox.Layout !== 'page') {
    throw new Error('Layout type is not page');
  }

  return scrapbox.Page.lines.map((l) => l.updated).reduce((prev, curr) => (prev < curr ? curr : prev), 0);
};
