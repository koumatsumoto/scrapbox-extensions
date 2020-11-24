import { Router } from 'scrapbox-tools/router';
import { getScrapboxClient, ScrapboxClient } from 'scrapbox-tools/scrapbox-client';
import { getCurrentProjectName } from '../../libs/scrapbox/browser-api';

let gettingClient: Promise<ScrapboxClient>;
let router: Router;
export const setupGlobalHelpers = () => {
  gettingClient = getScrapboxClient({ projectName: getCurrentProjectName() });
  router = new Router({ debug: true });
};

const isSetupCompleted = () => !gettingClient || !router;

export const getGlobalHelpers = async () => {
  if (!isSetupCompleted()) {
    setupGlobalHelpers();
  }

  const [scrapboxClient] = await Promise.all([gettingClient]);

  return {
    scrapboxClient,
    router,
  };
};
