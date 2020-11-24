import { Router } from 'scrapbox-tools/router';
import { getScrapboxClient, ScrapboxClient } from 'scrapbox-tools/scrapbox-client';
import { getCurrentProjectName } from '../../libs/scrapbox/browser-api';

let gettingClient: Promise<ScrapboxClient>;
export const setupGlobalHelpers = () => {
  gettingClient = getScrapboxClient({ projectName: getCurrentProjectName() });
};

export const getGlobalHelpers = async () => {
  if (!gettingClient) {
    setupGlobalHelpers();
  }

  const [scrapboxClient] = await Promise.all([gettingClient]);

  return {
    scrapboxClient,
    router: new Router(),
  };
};
