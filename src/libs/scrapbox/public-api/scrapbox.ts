import '../../../types/scrapbox';

export const getScrapbox = () => window.scrapbox;

export const getCurrentProjectName = () => {
  getScrapbox().Project.name;
};

export const getCurrentPageName = () => {
  getScrapbox().Page.title;
};

// after api response on react bootstrap
export const isScrapboxReady = () => {
  return getCurrentProjectName() !== undefined && getCurrentPageName() !== undefined;
};
