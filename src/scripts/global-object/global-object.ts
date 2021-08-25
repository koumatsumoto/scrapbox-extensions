import { Router, ScrapboxApi } from 'scrapbox-tools';
import { DynamicConfig } from '../dynamic-config';

interface GlobalObject {
  scrapboxApi: ScrapboxApi;
  router: Router;
  dynamicConfig: DynamicConfig;
}

let globalObject: GlobalObject | undefined;

export const getGlobalObject = () => {
  if (globalObject) {
    return globalObject;
  }

  const scrapboxApi = new ScrapboxApi();
  const router = new Router();
  const dynamicConfig = new DynamicConfig(scrapboxApi);

  globalObject = {
    scrapboxApi,
    router,
    dynamicConfig,
  };

  // for debug
  (window as any)['sx'] = globalObject;

  return globalObject;
};
