export const getPageLastUpdatedTime = () => {
  const scrapbox = window['scrapbox'];

  if (scrapbox.Layout !== 'page') {
    throw new Error('Layout type is not page');
  }

  return scrapbox.Page.lines.map((l) => l.updated).reduce((prev, curr) => (prev < curr ? curr : prev), 0);
};
