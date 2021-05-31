import { Router } from 'scrapbox-tools/router';
import { ScrapboxClient } from 'scrapbox-tools/scrapbox-client';

type HelpersObject = Readonly<{
  scrapboxClient: ScrapboxClient;
  router: Router;
}>;
let globalHelpers: HelpersObject | undefined;

export const getGlobalHelpers = () => {
  if (globalHelpers === undefined) {
    globalHelpers = {
      scrapboxClient: new ScrapboxClient(),
      router: new Router(),
    };
  }

  return globalHelpers;
};
