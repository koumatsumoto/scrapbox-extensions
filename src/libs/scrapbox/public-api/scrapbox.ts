import '../../../types/scrapbox';

const baseUrl = 'https://scrapbox.io';

export const getScrapbox = () => window.scrapbox;

export const getLines = () => getScrapbox().Page.lines;

export const getCurrentProjectName = () => getScrapbox().Project.name;

export const getCurrentPageName = () => getScrapbox().Page.title;

export const getPageUrl = (title: string) => `${baseUrl}/${encodeURIComponent(getCurrentProjectName())}/${encodeURIComponent(title)}`;

// ready after api requests initiated on react bootstrap completed
export const isScrapboxReady = () => getCurrentProjectName() !== undefined && getCurrentPageName() !== undefined;

export const changeRoute = (title: string) =>
  window.history.pushState(
    {
      path: `/${encodeURIComponent(getCurrentProjectName())}/${title}`,
    },
    title,
  );
