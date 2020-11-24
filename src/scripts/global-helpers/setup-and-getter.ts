import { Router } from 'scrapbox-tools/router';
import { getScrapboxClient, ScrapboxClient } from 'scrapbox-tools/scrapbox-client';
import { getCurrentProjectName } from '../../libs/scrapbox/browser-api';

let gettingClient: Promise<ScrapboxClient>;
let router: Router;
export const setupGlobalHelpers = () => {
  gettingClient = getScrapboxClient({ projectName: getCurrentProjectName() });
  router = new Router({ debug: true });
};

export const getGlobalHelpers = async () => {
  if (!gettingClient || !router) {
    setupGlobalHelpers();
  }

  const [scrapboxClient] = await Promise.all([gettingClient]);

  return {
    scrapboxClient,
    router,
  };
};
