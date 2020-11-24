import { getScrapboxClient, ScrapboxClient } from 'scrapbox-tools/scrapbox-client';
import { getCurrentProjectName } from '../../libs/scrapbox/browser-api';

let gettingClient: Promise<ScrapboxClient>;
export const setupGlobalHelpers = () => {
  getScrapboxClient({ projectName: getCurrentProjectName() }).catch();
};

export const getGlobalHelpers = async () => {
  const [scrapboxClient] = await Promise.all([gettingClient]);

  return { scrapboxClient };
};
