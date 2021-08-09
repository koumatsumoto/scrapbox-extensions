import { Router, ScrapboxClient } from 'scrapbox-tools';
import { DynamicConfig } from '../dynamic-config';

interface GlobalObject {
  scrapboxClient: ScrapboxClient;
  router: Router;
  dynamicConfig: DynamicConfig;
}

let globalObject: GlobalObject | undefined;

export const getGlobalObject = () => {
  if (globalObject) {
    return globalObject;
  }

  const scrapboxClient = new ScrapboxClient();
  const router = new Router();
  const dynamicConfig = new DynamicConfig(scrapboxClient);

  globalObject = {
    scrapboxClient,
    router,
    dynamicConfig,
  };

  // for debug
  (window as any)['sx'] = globalObject;

  return globalObject;
};
