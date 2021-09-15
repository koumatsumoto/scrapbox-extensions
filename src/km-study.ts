import { Router, ScrapboxApi } from 'scrapbox-tools';
import { documentReady } from './libs';
import { addContentsButton, customListStyle, customPageStyle, DynamicConfig, replaceLinkToNewPage } from './scripts';

const main = () => {
  const scrapboxApi = new ScrapboxApi();
  const router = new Router();
  const dynamicConfig = new DynamicConfig(scrapboxApi);
  // for debug
  (window as any)['sx'] = { scrapboxApi, router, dynamicConfig };

  documentReady().subscribe(() => {
    customListStyle({ scrapboxApi });
    customPageStyle();
    addContentsButton({ scrapboxApi, dynamicConfig });
    replaceLinkToNewPage({ router });
  });
};

main();
