import { getScrapboxClient, ScrapboxClient } from 'scrapbox-tools/scrapbox-client';
import { logOnly } from '../../libs/common/logger';
import { getCurrentProjectName } from '../../libs/scrapbox/browser-api';
import { Router } from '../../libs/scrapbox/router';

let gettingClient: Promise<ScrapboxClient>;
export const setupGlobalHelpers = () => {
  getScrapboxClient({ projectName: getCurrentProjectName() }).catch(logOnly);
};

export const getGlobalHelpers = async () => {
  const [scrapboxClient] = await Promise.all([gettingClient]);

  return {
    scrapboxClient,
    router: new Router(),
  };
};
