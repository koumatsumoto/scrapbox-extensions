import { Router } from 'scrapbox-tools/router';
import { getScrapboxClient, ScrapboxClient } from 'scrapbox-tools/scrapbox-client';
import { getCurrentProjectName } from '../../libs/scrapbox/browser-api';

type HelpersObject = Readonly<{
  scrapboxClient: ScrapboxClient;
  router: Router;
}>;
let initializingHelpers: Promise<HelpersObject>;

export const setupGlobalHelpers = () => {
  const initClient = getScrapboxClient({ projectName: getCurrentProjectName() });
  const initRouter = Promise.resolve(new Router({ debug: true }));

  initializingHelpers = Promise.all([initClient, initRouter]).then(([scrapboxClient, router]) => ({
    scrapboxClient,
    router,
  }));
};

export const getGlobalHelpers = async () => {
  if (!initializingHelpers) {
    setupGlobalHelpers();
  }

  return initializingHelpers;
};
