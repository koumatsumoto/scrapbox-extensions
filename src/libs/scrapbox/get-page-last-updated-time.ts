export const getPageLastUpdatedTime = () => {
  if (window.scrapbox.Layout !== 'page') {
    throw new Error('Layout type is not page');
  }

  return window.scrapbox.Page.lines.map((l) => l.updated).reduce((prev, curr) => (prev < curr ? curr : prev), 0);
};
